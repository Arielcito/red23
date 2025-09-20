import { NextRequest, NextResponse } from 'next/server'
import { RewardStorageService } from '@/lib/services/rewardStorageService'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log('📝 Updating reward image:', id)
    
    const imageId = parseInt(id)
    if (isNaN(imageId)) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid image ID',
          details: 'Image ID must be a valid number'
        }
      }, { status: 400 })
    }

    const updates = await request.json()
    
    // Validar que el body sea un objeto válido
    if (typeof updates !== 'object' || updates === null) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request body',
          details: 'Request body must be a valid object'
        }
      }, { status: 400 })
    }

    // Validar campos específicos si están presentes
    if (updates.image_type && !['winner_avatar', 'banner_image', 'prize_image'].includes(updates.image_type)) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid image type',
          details: 'Type must be one of: winner_avatar, banner_image, prize_image'
        }
      }, { status: 400 })
    }

    console.log('📝 Updating image with data:', updates)

    const updatedImage = await RewardStorageService.updateImage(imageId, updates)

    if (!updatedImage) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Image not found',
          details: `Image with ID ${imageId} does not exist`
        }
      }, { status: 404 })
    }

    console.log('✅ Updated reward image:', updatedImage.id)

    return NextResponse.json({
      success: true,
      data: updatedImage
    })
  } catch (error) {
    console.error('❌ Error updating reward image:', error)
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'UPDATE_ERROR',
        message: 'Failed to update reward image',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log('🗑️ Deleting reward image:', id)
    
    const imageId = parseInt(id)
    if (isNaN(imageId)) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid image ID',
          details: 'Image ID must be a valid number'
        }
      }, { status: 400 })
    }

    const success = await RewardStorageService.deleteImage(imageId)

    if (!success) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'DELETE_ERROR',
          message: 'Failed to delete image',
          details: `Could not delete image with ID ${imageId}`
        }
      }, { status: 404 })
    }

    console.log('✅ Deleted reward image:', imageId)

    return NextResponse.json({
      success: true,
      data: {
        id: imageId,
        message: 'Image deleted successfully'
      }
    })
  } catch (error) {
    console.error('❌ Error deleting reward image:', error)
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'DELETE_ERROR',
        message: 'Failed to delete reward image',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 })
  }
}
