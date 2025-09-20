import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { RewardWinner, NewRewardWinner } from '@/lib/supabase/types'

// Cliente con service key para operaciones administrativas
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params
    console.log('📋 Fetching winner:', id)
    
    const winnerId = parseInt(id)
    if (isNaN(winnerId)) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid winner ID',
          details: 'Winner ID must be a valid number'
        }
      }, { status: 400 })
    }

    const { data: winner, error } = await supabaseAdmin
      .from('reward_winners')
      .select('*')
      .eq('id', winnerId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Winner not found',
            details: `Winner with ID ${winnerId} does not exist`
          }
        }, { status: 404 })
      }
      
      console.error('❌ Database error fetching winner:', error)
      throw new Error(`Database error: ${error.message}`)
    }

    console.log('✅ Loaded winner:', winner.id)

    return NextResponse.json({
      success: true,
      data: winner
    })
  } catch (error) {
    console.error('❌ Error fetching winner:', error)
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'FETCH_ERROR',
        message: 'Failed to fetch winner',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params
    console.log('📝 Updating winner:', id)
    
    const winnerId = parseInt(id)
    if (isNaN(winnerId)) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid winner ID',
          details: 'Winner ID must be a valid number'
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
    if (updates.type && !['daily', 'monthly'].includes(updates.type)) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid winner type',
          details: 'Type must be either "daily" or "monthly"'
        }
      }, { status: 400 })
    }

    console.log('📝 Updating winner with data:', updates)

    const { data: updatedWinner, error } = await supabaseAdmin
      .from('reward_winners')
      .update(updates)
      .eq('id', winnerId)
      .select('*')
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Winner not found',
            details: `Winner with ID ${winnerId} does not exist`
          }
        }, { status: 404 })
      }
      
      console.error('❌ Database error updating winner:', error)
      throw new Error(`Database error: ${error.message}`)
    }

    console.log('✅ Updated winner:', updatedWinner.id)

    return NextResponse.json({
      success: true,
      data: updatedWinner
    })
  } catch (error) {
    console.error('❌ Error updating winner:', error)
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'UPDATE_ERROR',
        message: 'Failed to update winner',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params
    console.log('🗑️ Deleting winner:', id)
    
    const winnerId = parseInt(id)
    if (isNaN(winnerId)) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid winner ID',
          details: 'Winner ID must be a valid number'
        }
      }, { status: 400 })
    }

    // Usar soft delete marcando como inactivo
    const { data: deletedWinner, error } = await supabaseAdmin
      .from('reward_winners')
      .update({ is_active: false })
      .eq('id', winnerId)
      .select('*')
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Winner not found',
            details: `Winner with ID ${winnerId} does not exist`
          }
        }, { status: 404 })
      }
      
      console.error('❌ Database error deleting winner:', error)
      throw new Error(`Database error: ${error.message}`)
    }

    console.log('✅ Deleted winner:', deletedWinner.id)

    return NextResponse.json({
      success: true,
      data: deletedWinner
    })
  } catch (error) {
    console.error('❌ Error deleting winner:', error)
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'DELETE_ERROR',
        message: 'Failed to delete winner',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 })
  }
}