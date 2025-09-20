import { NextRequest, NextResponse } from 'next/server'
import { RewardStorageService } from '@/lib/services/rewardStorageService'
import type { RewardImages } from '@/lib/supabase/types'

export async function GET(request: NextRequest) {
  try {
    console.log('📋 Fetching reward images for admin')
    
    const { searchParams } = new URL(request.url)
    const imageType = searchParams.get('type') // 'winner_avatar', 'banner_image', 'prize_image'
    const limit = parseInt(searchParams.get('limit') || '50')

    const images = await RewardStorageService.getImages(imageType || undefined, limit)

    console.log(`✅ Loaded ${images.length} reward images`)

    return NextResponse.json({
      success: true,
      data: {
        images,
        count: images.length
      }
    })
  } catch (error) {
    console.error('❌ Error fetching reward images:', error)
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'FETCH_ERROR',
        message: 'Failed to fetch reward images',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('📤 Uploading new reward image')
    
    const formData = await request.formData()
    const file = formData.get('file') as File
    const name = formData.get('name') as string
    const description = formData.get('description') as string | null
    const imageType = formData.get('imageType') as 'winner_avatar' | 'banner_image' | 'prize_image'
    const uploadedBy = formData.get('uploadedBy') as string | null

    // Validaciones básicas
    if (!file || !name || !imageType) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Missing required fields',
          details: 'File, name, and imageType are required'
        }
      }, { status: 400 })
    }

    if (!['winner_avatar', 'banner_image', 'prize_image'].includes(imageType)) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid image type',
          details: 'Type must be one of: winner_avatar, banner_image, prize_image'
        }
      }, { status: 400 })
    }

    console.log('📝 Uploading image with data:', {
      name,
      imageType,
      size: file.size,
      type: file.type
    })

    // Subir imagen usando el servicio
    const result = await RewardStorageService.uploadImage({
      file,
      name,
      description: description || undefined,
      imageType,
      uploadedBy: uploadedBy || undefined
    })

    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'UPLOAD_ERROR',
          message: 'Failed to upload image',
          details: result.error
        }
      }, { status: 400 })
    }

    console.log('✅ Image uploaded successfully:', result.data?.id)

    return NextResponse.json({
      success: true,
      data: {
        id: result.data!.id,
        imageUrl: result.data!.imageUrl,
        message: 'Image uploaded successfully'
      }
    })
  } catch (error) {
    console.error('❌ Error uploading reward image:', error)
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'UPLOAD_ERROR',
        message: 'Failed to upload reward image',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 })
  }
}