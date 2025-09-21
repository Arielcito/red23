import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { ImageUploadService } from '@/lib/services/imageUploadService'
import { validateFile, uploadFile } from '@/lib/services/supabaseStorageService'

export async function POST(request: NextRequest) {
  try {
    console.log('📤 Iniciando proceso de upload de imagen con Supabase Storage')

    // Verificar autenticación con Clerk
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Usuario no autenticado' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const user_email = formData.get('user_email') as string
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const tags = formData.get('tags') as string

    console.log('📝 Datos recibidos:', {
      filesCount: files.length,
      user_email,
      title,
      hasDescription: !!description,
      hasTags: !!tags
    })

    if (!user_email) {
      return NextResponse.json(
        { success: false, error: 'Email de usuario requerido' },
        { status: 400 }
      )
    }

    if (!files.length) {
      return NextResponse.json(
        { success: false, error: 'No se enviaron archivos' },
        { status: 400 }
      )
    }

    const uploadedImages = []
    const errors = []

    for (const file of files) {
      console.log('📁 Procesando archivo:', {
        name: file.name,
        size: file.size,
        type: file.type
      })

      try {
        // Validate file using SupabaseStorageService
        const validation = validateFile(file)
        if (!validation.valid) {
          errors.push(`${file.name}: ${validation.error}`)
          continue
        }

        // Upload to Supabase Storage
        const uploadResult = await uploadFile(file, user_email)

        // Save to database with Supabase Storage URL
        const savedImage = await ImageUploadService.saveImage({
          user_email,
          prompt: title || `Imagen subida: ${file.name}`,
          result: uploadResult.publicUrl,
          tokens: 0
        })

        uploadedImages.push({
          id: savedImage.id,
          filename: uploadResult.name,
          url: uploadResult.publicUrl,
          size: uploadResult.size,
          type: uploadResult.type,
          created_at: savedImage.created_at,
          storage_path: uploadResult.path
        })

        console.log('✅ Imagen procesada exitosamente:', {
          id: savedImage.id,
          filename: uploadResult.name,
          url: uploadResult.publicUrl,
          storage_path: uploadResult.path
        })

      } catch (fileError) {
        console.error(`❌ Error procesando archivo ${file.name}:`, fileError)
        errors.push(`${file.name}: ${fileError instanceof Error ? fileError.message : 'Error desconocido'}`)
        continue
      }
    }

    // If no files were uploaded successfully
    if (uploadedImages.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `No se pudieron subir las imágenes. Errores: ${errors.join(', ')}` 
        },
        { status: 400 }
      )
    }

    const successMessage = `${uploadedImages.length} imagen${uploadedImages.length !== 1 ? 'es' : ''} subida${uploadedImages.length !== 1 ? 's' : ''} exitosamente`
    const finalMessage = errors.length > 0 
      ? `${successMessage}. Algunos archivos tuvieron errores: ${errors.join(', ')}`
      : successMessage

    console.log('🎉 Upload completado:', {
      totalImages: uploadedImages.length,
      errors: errors.length,
      user_email
    })

    return NextResponse.json({
      success: true,
      data: {
        message: finalMessage,
        images: uploadedImages,
        metadata: {
          title,
          description,
          tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
          errors: errors.length > 0 ? errors : undefined
        }
      }
    })

  } catch (error) {
    console.error('❌ Error en upload API:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor durante el upload' 
      },
      { status: 500 }
    )
  }
}
