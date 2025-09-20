import { NextRequest, NextResponse } from 'next/server'
import { automaticPrompts } from '@/lib/db/schema'
import { db } from '@/lib/db'
import { eq } from 'drizzle-orm'

interface RouteParams {
  params: {
    id: string
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const id = parseInt(params.id)
    const body = await request.json()
    
    console.log('📝 Updating prompt:', id, body)

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

    const [updatedPrompt] = await db
      .update(automaticPrompts)
      .set({
        title: body.title.trim(),
        content: body.content.trim(),
        category: body.category || 'general',
        is_active: body.is_active ?? true,
        updated_at: new Date()
      })
      .where(eq(automaticPrompts.id, id))
      .returning()

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

    console.log('✅ Updated prompt:', updatedPrompt.id)

    return NextResponse.json({
      success: true,
      data: updatedPrompt
    })
  } catch (error) {
    console.error('❌ Error updating prompt:', error)
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

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const id = parseInt(params.id)
    
    console.log('🗑️ Deleting prompt:', id)

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

    const [deletedPrompt] = await db
      .delete(automaticPrompts)
      .where(eq(automaticPrompts.id, id))
      .returning()

    if (!deletedPrompt) {
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

    console.log('✅ Deleted prompt:', deletedPrompt.id)

    return NextResponse.json({
      success: true,
      data: deletedPrompt
    })
  } catch (error) {
    console.error('❌ Error deleting prompt:', error)
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