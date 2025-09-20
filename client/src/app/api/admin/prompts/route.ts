import { NextRequest, NextResponse } from 'next/server'
import { automaticPrompts } from '@/lib/db/schema'
import { db } from '@/lib/db'
import { eq, desc } from 'drizzle-orm'

export async function GET() {
  try {
    console.log('📋 Fetching automatic prompts')
    
    const prompts = await db
      .select()
      .from(automaticPrompts)
      .orderBy(desc(automaticPrompts.order_index), desc(automaticPrompts.created_at))

    console.log(`✅ Found ${prompts.length} prompts`)

    return NextResponse.json({
      success: true,
      data: prompts
    })
  } catch (error) {
    console.error('❌ Error fetching prompts:', error)
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
    
    console.log('🆕 Creating new prompt:', body)

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

    // Get next order index
    const lastPrompt = await db
      .select()
      .from(automaticPrompts)
      .orderBy(desc(automaticPrompts.order_index))
      .limit(1)

    const nextOrderIndex = (lastPrompt[0]?.order_index || 0) + 1

    const [newPrompt] = await db
      .insert(automaticPrompts)
      .values({
        title: body.title.trim(),
        content: body.content.trim(),
        category: body.category || 'general',
        is_active: body.is_active ?? true,
        order_index: nextOrderIndex
      })
      .returning()

    console.log('✅ Created prompt:', newPrompt.id)

    return NextResponse.json({
      success: true,
      data: newPrompt
    }, { status: 201 })
  } catch (error) {
    console.error('❌ Error creating prompt:', error)
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