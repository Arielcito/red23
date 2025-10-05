import { NextRequest, NextResponse } from 'next/server'
import { PromptsService } from '@/lib/services/promptsService'

export async function GET() {
  try {
    console.log('📋 API: Fetching automatic prompts')

    const prompts = await PromptsService.getAllPrompts()

    return NextResponse.json({
      success: true,
      data: prompts
    })
  } catch (error) {
    console.error('❌ API Error fetching prompts:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message: 'Error fetching prompts',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log('🆕 API: Creating new prompt:', body.title)

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

    const newPrompt = await PromptsService.createPrompt({
      title: body.title,
      content: body.content,
      category: body.category,
      is_active: body.is_active
    })

    return NextResponse.json({
      success: true,
      data: newPrompt
    }, { status: 201 })
  } catch (error) {
    console.error('❌ API Error creating prompt:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'CREATE_ERROR',
          message: 'Error creating prompt',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      },
      { status: 500 }
    )
  }
}