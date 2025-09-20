import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { RewardWinner, NewRewardWinner } from '@/lib/supabase/types'

// Cliente con service key para operaciones administrativas
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    console.log('📋 Fetching winners for admin')
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const type = searchParams.get('type') // 'daily' or 'monthly'
    const isActive = searchParams.get('active') // 'true' or 'false'
    
    const offset = (page - 1) * limit

    // Construir query base
    let query = supabaseAdmin
      .from('reward_winners')
      .select('*', { count: 'exact' })
      .order('won_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Aplicar filtros
    if (type && (type === 'daily' || type === 'monthly')) {
      query = query.eq('type', type)
    }

    if (isActive !== null) {
      query = query.eq('is_active', isActive === 'true')
    }

    const { data: winners, error, count } = await query

    if (error) {
      console.error('❌ Database error fetching winners:', error)
      throw new Error(`Database error: ${error.message}`)
    }

    console.log(`✅ Loaded ${winners?.length || 0} winners for admin`)

    return NextResponse.json({
      success: true,
      data: {
        winners: winners || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit)
        }
      }
    })
  } catch (error) {
    console.error('❌ Error fetching winners:', error)
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'FETCH_ERROR',
        message: 'Failed to fetch winners',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🆕 Creating new winner')
    
    const winnerData = await request.json() as NewRewardWinner
    
    // Validaciones básicas
    if (!winnerData.name || !winnerData.prize || !winnerData.type) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Missing required fields',
          details: 'Name, prize, and type are required'
        }
      }, { status: 400 })
    }

    if (!['daily', 'monthly'].includes(winnerData.type)) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid winner type',
          details: 'Type must be either "daily" or "monthly"'
        }
      }, { status: 400 })
    }

    console.log('📝 Creating winner with data:', winnerData)

    // Insertar nuevo ganador
    const { data: newWinner, error } = await supabaseAdmin
      .from('reward_winners')
      .insert({
        ...winnerData,
        won_at: winnerData.won_at || new Date().toISOString(),
        is_active: winnerData.is_active ?? true
      })
      .select('*')
      .single()

    if (error) {
      console.error('❌ Database error creating winner:', error)
      throw new Error(`Database error: ${error.message}`)
    }

    console.log('✅ Created new winner:', newWinner.id)

    return NextResponse.json({
      success: true,
      data: newWinner
    })
  } catch (error) {
    console.error('❌ Error creating winner:', error)
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'CREATE_ERROR',
        message: 'Failed to create winner',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 })
  }
}