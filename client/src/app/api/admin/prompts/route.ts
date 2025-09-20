import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import type { AutomaticPrompt } from '@/lib/supabase/types'

export async function GET() {
  try {
    console.log('📋 Fetching automatic prompts')
    
    const { data: prompts, error } = await supabase
      .from('automatic_prompts')
      .select('*')
      .order('order_index', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Error fetching prompts from Supabase:', error)
      throw error
    }

    console.log(`✅ Found ${prompts?.length || 0} prompts`)

    return NextResponse.json({
      success: true,
      data: prompts || []
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
    const { data: lastPrompt, error: lastPromptError } = await supabase
      .from('automatic_prompts')
      .select('order_index')
      .order('order_index', { ascending: false })
      .limit(1)
      .single()

    if (lastPromptError && lastPromptError.code !== 'PGRST116') {
      console.error('Error getting last prompt:', lastPromptError)
      throw lastPromptError
    }

    const nextOrderIndex = (lastPrompt?.order_index || 0) + 1

    const { data: newPrompt, error: insertError } = await supabase
      .from('automatic_prompts')
      .insert({
        title: body.title.trim(),
        content: body.content.trim(),
        category: body.category || 'general',
        is_active: body.is_active ?? true,
        order_index: nextOrderIndex
      })
      .select('*')
      .single()

    if (insertError) {
      console.error('Error inserting prompt:', insertError)
      throw insertError
    }

    console.log('✅ Created prompt:', newPrompt?.id)

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