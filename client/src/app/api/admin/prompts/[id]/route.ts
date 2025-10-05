import { NextRequest, NextResponse } from 'next/server'
import { PromptsService } from '@/lib/services/promptsService'

type RouteContext = {
  params: Promise<Record<string, string | string[] | undefined>>
}

async function resolveParams(
  context: RouteContext
): Promise<Record<string, string | string[] | undefined>> {
  return await context.params
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const params = await resolveParams(context)
    const idValue = params?.id
    const idString = Array.isArray(idValue) ? idValue[0] : idValue
    const id = parseInt(idString ?? '')
    const body = await request.json()

    console.log('📝 API: Updating prompt:', id)

    if (isNaN(id)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_ID',
            message: 'Invalid prompt ID',
            details: ['ID must be a valid number']
          }
        },
        { status: 400 }
      )
    }

    // Validation
    if (!body.title?.trim() || !body.content?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Title and content are required',
            details: ['Title and content cannot be empty']
          }
        },
        { status: 400 }
      )
    }

    const updatedPrompt = await PromptsService.updatePrompt(id, {
      title: body.title,
      content: body.content,
      category: body.category,
      is_active: body.is_active
    })

    if (!updatedPrompt) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Prompt not found',
            details: [`Prompt with ID ${id} not found`]
          }
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: updatedPrompt
    })
  } catch (error) {
    console.error('❌ API Error updating prompt:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'UPDATE_ERROR',
          message: 'Error updating prompt',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const params = await resolveParams(context)
    const idValue = params?.id
    const idString = Array.isArray(idValue) ? idValue[0] : idValue
    const id = parseInt(idString ?? '')

    console.log('🗑️ API: Deleting prompt:', id)

    if (isNaN(id)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_ID',
            message: 'Invalid prompt ID',
            details: ['ID must be a valid number']
          }
        },
        { status: 400 }
      )
    }

    await PromptsService.deletePrompt(id)

    return NextResponse.json({
      success: true,
      message: 'Prompt deleted successfully'
    })
  } catch (error) {
    console.error('❌ API Error deleting prompt:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'DELETE_ERROR',
          message: 'Error deleting prompt',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      },
      { status: 500 }
    )
  }
}
