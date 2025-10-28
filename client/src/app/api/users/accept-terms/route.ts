import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase/client'

const CURRENT_TERMS_VERSION = '1.0'

export async function POST(request: NextRequest) {
  try {
    console.log('✍️ Processing terms acceptance')

    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Usuario no autenticado' },
        { status: 401 }
      )
    }

    console.log('👤 User authenticated:', userId)

    // Check if user exists in user_referrals table
    const { data: existingUser, error: fetchError } = await supabase
      .from('user_referrals')
      .select('id, user_id')
      .eq('user_id', userId)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('❌ Error fetching user:', fetchError)
      return NextResponse.json(
        { success: false, error: 'Error al verificar usuario' },
        { status: 500 }
      )
    }

    if (!existingUser) {
      console.log('⚠️ User not found in referrals table, cannot accept terms')
      return NextResponse.json(
        {
          success: false,
          error: 'Usuario no registrado en sistema de referidos'
        },
        { status: 404 }
      )
    }

    // Update terms acceptance
    const { data: updatedUser, error: updateError } = await supabase
      .from('user_referrals')
      .update({
        terms_accepted_at: new Date().toISOString(),
        terms_version: CURRENT_TERMS_VERSION,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single()

    if (updateError) {
      console.error('❌ Error updating terms acceptance:', updateError)
      return NextResponse.json(
        { success: false, error: 'Error al aceptar términos' },
        { status: 500 }
      )
    }

    console.log('✅ Terms accepted successfully')

    return NextResponse.json({
      success: true,
      data: {
        acceptedAt: updatedUser.terms_accepted_at,
        version: updatedUser.terms_version,
        message: 'Términos aceptados correctamente'
      }
    })

  } catch (error) {
    console.error('❌ Error accepting terms:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor al aceptar términos'
      },
      { status: 500 }
    )
  }
}
