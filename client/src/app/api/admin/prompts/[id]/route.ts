import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import type { AutomaticPrompt } from '@/lib/supabase/types'

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

    const { data: updatedPrompt, error: updateError } = await supabase
      .from('automatic_prompts')
      .update({
        title: body.title.trim(),
        content: body.content.trim(),
        category: body.category || 'general',
        is_active: body.is_active ?? true,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('*')
      .single()

    if (updateError && updateError.code !== 'PGRST116') {
      console.error('Error updating prompt:', updateError)
      throw updateError
    }

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

    console.log('✅ Updated prompt:', updatedPrompt?.id)

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

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const params = await resolveParams(context)
    const idValue = params?.id
    const idString = Array.isArray(idValue) ? idValue[0] : idValue
    const id = parseInt(idString ?? '')
    
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

    const { data: deletedPrompt, error: deleteError } = await supabase
      .from('automatic_prompts')
      .delete()
      .eq('id', id)
      .select('*')
      .single()

    if (deleteError && deleteError.code !== 'PGRST116') {
      console.error('Error deleting prompt:', deleteError)
      throw deleteError
    }

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

    console.log('✅ Deleted prompt:', deletedPrompt?.id)

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
