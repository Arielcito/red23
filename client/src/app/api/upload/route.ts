import { NextRequest, NextResponse } from 'next/server'
import { ImageUploadService } from '@/lib/services/imageUploadService'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { nanoid } from 'nanoid'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']

export async function POST(request: NextRequest) {
  try {
    console.log('📤 Iniciando proceso de upload de imagen')

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

    for (const file of files) {
      console.log('📁 Procesando archivo:', {
        name: file.name,
        size: file.size,
        type: file.type
      })

      // Validar tipo de archivo
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { 
            success: false, 
            error: `Tipo de archivo no soportado: ${file.type}. Formatos permitidos: JPG, PNG, GIF, WebP` 
          },
          { status: 400 }
        )
      }

      // Validar tamaño
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { 
            success: false, 
            error: `Archivo demasiado grande: ${(file.size / 1024 / 1024).toFixed(2)}MB. Máximo permitido: 10MB` 
          },
          { status: 400 }
        )
      }

      // Generar nombre único para el archivo
      const fileExtension = file.name.split('.').pop()
      const uniqueFileName = `${nanoid()}.${fileExtension}`
      
      // Guardar archivo en el sistema de archivos
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      // Crear directorio de uploads si no existe
      const uploadsDir = join(process.cwd(), 'public', 'uploads')
      const filePath = join(uploadsDir, uniqueFileName)

      try {
        await mkdir(uploadsDir, { recursive: true })
        await writeFile(filePath, buffer)
        console.log('💾 Archivo guardado en:', filePath)
      } catch (fsError) {
        console.error('❌ Error guardando archivo:', fsError)
        return NextResponse.json(
          { success: false, error: 'Error guardando el archivo en el servidor' },
          { status: 500 }
        )
      }

      // Crear URL pública para el archivo
      const publicUrl = `/uploads/${uniqueFileName}`

      // Guardar en la base de datos
      try {
        const savedImage = await ImageUploadService.saveImage({
          user_email,
          prompt: title || `Imagen subida: ${file.name}`,
          result: publicUrl,
          tokens: 0
        })

        uploadedImages.push({
          id: savedImage.id,
          filename: file.name,
          url: publicUrl,
          size: file.size,
          type: file.type,
          created_at: savedImage.created_at
        })

        console.log('✅ Imagen procesada exitosamente:', {
          id: savedImage.id,
          filename: file.name,
          url: publicUrl
        })
      } catch (dbError) {
        console.error('❌ Error guardando en DB:', dbError)
        return NextResponse.json(
          { success: false, error: 'Error guardando la información de la imagen' },
          { status: 500 }
        )
      }
    }

    console.log('🎉 Upload completado exitosamente:', {
      totalImages: uploadedImages.length,
      user_email
    })

    return NextResponse.json({
      success: true,
      data: {
        message: `${uploadedImages.length} imagen${uploadedImages.length !== 1 ? 'es' : ''} subida${uploadedImages.length !== 1 ? 's' : ''} exitosamente`,
        images: uploadedImages,
        metadata: {
          title,
          description,
          tags: tags ? tags.split(',').map(tag => tag.trim()) : []
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
