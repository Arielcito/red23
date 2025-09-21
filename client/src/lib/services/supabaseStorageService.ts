import { supabase } from '@/lib/supabase/client'
import { nanoid } from 'nanoid'

export interface UploadImageResult {
  id: string
  path: string
  publicUrl: string
  size: number
  type: string
  name: string
  originalName?: string
}

export interface UploadProgress {
  fileName: string
  progress: number
  uploaded: boolean
  error?: string
}

export interface StorageFile {
  name: string
  id: string
  updated_at: string
  created_at: string
  last_accessed_at: string
  metadata: Record<string, unknown>
}

const BUCKET_NAME = 'images'
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp'
]

// Validate file before upload
function validateFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Tipo de archivo no soportado: ${file.type}. Formatos permitidos: JPG, PNG, GIF, WebP`
    }
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `Archivo demasiado grande: ${(file.size / 1024 / 1024).toFixed(2)}MB. Máximo permitido: 10MB`
    }
  }

  return { valid: true }
}

// Generate unique file path with standardized naming
function generateFilePath(file: File, userEmail: string): string {
  const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  
  // Generate unique ID for the file
  const uniqueId = nanoid(12) // Longer ID for better uniqueness
  const timestamp = Date.now()
  
  // Create standardized filename: IMG_[uniqueId]_[timestamp].[extension]
  const standardizedFileName = `IMG_${uniqueId}_${timestamp}.${fileExtension}`

  // Create folder structure: user_email/year/month/filename
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')

  // Sanitize email for folder name (replace special chars with underscores)
  const sanitizedEmail = userEmail.replace(/[^a-zA-Z0-9]/g, '_')

  return `${sanitizedEmail}/${year}/${month}/${standardizedFileName}`
}

// Generate display-friendly filename for UI
function generateDisplayName(originalName: string): string {
  const fileExtension = originalName.split('.').pop()?.toLowerCase() || 'jpg'
  const uniqueId = nanoid(8)
  const timestamp = new Date().toISOString().slice(0, 10) // YYYY-MM-DD format
  
  // Clean original name (remove extension and special chars)
  const cleanName = originalName
    .replace(/\.[^/.]+$/, '') // Remove extension
    .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special chars
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .substring(0, 20) // Limit length
  
  return `${cleanName}_${timestamp}_${uniqueId}.${fileExtension}`
}

// Upload single file to Supabase Storage
async function uploadFile(file: File, userEmail: string): Promise<UploadImageResult> {
    try {
      console.log('📤 Uploading file to Supabase Storage:', {
        name: file.name,
        size: file.size,
        type: file.type,
        userEmail,
        bucketName: BUCKET_NAME
      })

      // Validate file
      const validation = validateFile(file)
      if (!validation.valid) {
        throw new Error(validation.error)
      }

      // Generate unique path
      const filePath = generateFilePath(file, userEmail)
      console.log('📂 Generated file path:', filePath)

      console.log('🚀 Attempting direct upload to Supabase Storage...')

      // Upload to Supabase Storage with upsert to avoid conflicts
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true, // Changed to true to avoid conflicts
          duplex: 'half'
        })

      if (uploadError) {
        console.error('❌ Supabase upload error:', {
          error: uploadError,
          message: uploadError.message,
          filePath,
          bucketName: BUCKET_NAME
        })

        // Check for specific RLS policy error
        if (uploadError.message.includes('row-level security policy') || uploadError.message.includes('RLS')) {
          throw new Error(`RLS Policy Error: The storage bucket '${BUCKET_NAME}' requires proper Row Level Security ${uploadError.message}`)
        }

        // Check for authentication error
        if (uploadError.message.includes('JWT') || uploadError.message.includes('authentication')) {
          throw new Error(`Authentication Error: Unable to authenticate with Supabase Storage. Please check your Supabase configuration and ensure you're properly authenticated.`)
        }

        // Check for bucket permission error
        if (uploadError.message.includes('permission') || uploadError.message.includes('access')) {
          throw new Error(`Permission Error: Insufficient permissions to upload to bucket '${BUCKET_NAME}'. Please check your Supabase policies and authentication.`)
        }

        throw new Error(`Upload failed: ${uploadError.message}`)
      }

      if (!uploadData?.path) {
        throw new Error('Upload succeeded but no file path was returned')
      }

      console.log('✅ File uploaded to storage:', uploadData.path)

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(uploadData.path)

      if (!urlData.publicUrl) {
        throw new Error('Failed to get public URL for uploaded file')
      }

      // Generate display-friendly name for UI
      const displayName = generateDisplayName(file.name)
      
      const result: UploadImageResult = {
        id: nanoid(),
        path: uploadData.path,
        publicUrl: urlData.publicUrl,
        size: file.size,
        type: file.type,
        name: displayName, // Use standardized display name
        originalName: file.name // Keep original name for reference
      }

      console.log('✅ File uploaded successfully:', {
        originalName: file.name,
        standardizedName: displayName,
        storagePath: result.path,
        publicUrl: result.publicUrl,
        size: result.size
      })

      return result

    } catch (error) {
      console.error('❌ Error uploading file to Supabase:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        fileName: file.name,
        userEmail,
        bucketName: BUCKET_NAME
      })
      throw error
    }
  }

// Upload multiple files
async function uploadFiles(
  files: File[],
  userEmail: string,
  onProgress?: (progress: UploadProgress[]) => void
): Promise<UploadImageResult[]> {
  const results: UploadImageResult[] = []
  const progressList: UploadProgress[] = files.map(file => ({
    fileName: file.name,
    progress: 0,
    uploaded: false
  }))

  // Report initial progress
  if (onProgress) {
    onProgress([...progressList])
  }

  for (let i = 0; i < files.length; i++) {
    const file = files[i]

    try {
      // Update progress - starting upload
      progressList[i].progress = 10
      if (onProgress) {
        onProgress([...progressList])
      }

      const result = await uploadFile(file, userEmail)
      results.push(result)

      // Update progress - completed
      progressList[i].progress = 100
      progressList[i].uploaded = true
      if (onProgress) {
        onProgress([...progressList])
      }

    } catch (error) {
      console.error(`❌ Error uploading file ${file.name}:`, error)

      // Update progress - error
      progressList[i].error = error instanceof Error ? error.message : 'Unknown error'
      progressList[i].progress = 0
      if (onProgress) {
        onProgress([...progressList])
      }

      // Continue with other files instead of failing completely
      continue
    }
  }

  return results
}

// Delete file from storage
async function deleteFile(filePath: string): Promise<void> {
  try {
    console.log('🗑️ Deleting file from Supabase Storage:', filePath)

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath])

    if (error) {
      console.error('❌ Error deleting file:', error)
      throw new Error(`Error deleting file: ${error.message}`)
    }

    console.log('✅ File deleted successfully:', filePath)
  } catch (error) {
    console.error('❌ Error deleting file from Supabase:', error)
    throw error
  }
}

// List files for a user
async function listUserFiles(userEmail: string): Promise<StorageFile[]> {
  try {
    const sanitizedEmail = userEmail.replace(/[^a-zA-Z0-9]/g, '_')

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list(sanitizedEmail, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      })

    if (error) {
      console.error('❌ Error listing files:', error)
      throw new Error(`Error listing files: ${error.message}`)
    }

    return data || []
  } catch (error) {
    console.error('❌ Error listing user files:', error)
    throw error
  }
}

// Get signed URL for private access (if needed)
async function getSignedUrl(filePath: string, expiresIn: number = 3600): Promise<string> {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(filePath, expiresIn)

    if (error) {
      throw new Error(`Error creating signed URL: ${error.message}`)
    }

    return data.signedUrl
  } catch (error) {
    console.error('❌ Error creating signed URL:', error)
    throw error
  }
}

export {
  validateFile,
  generateFilePath,
  generateDisplayName,
  uploadFile,
  uploadFiles,
  deleteFile,
  listUserFiles,
  getSignedUrl
}