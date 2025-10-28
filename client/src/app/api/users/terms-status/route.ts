import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase/client'

const CURRENT_TERMS_VERSION = '1.0'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Checking user terms acceptance status')

    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Usuario no autenticado' },
        { status: 401 }
      )
    }

    console.log('👤 User authenticated:', userId)

    const { data: userReferral, error } = await supabase
      .from('user_referrals')
      .select('terms_accepted_at, terms_version')
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('❌ Error fetching terms status:', error)
      return NextResponse.json(
        { success: false, error: 'Error al verificar estado de términos' },
        { status: 500 }
      )
    }

    if (!userReferral) {
      console.log('⚠️ User not found in referrals table')
      return NextResponse.json({
        success: true,
        data: {
          hasAccepted: false,
          currentVersion: CURRENT_TERMS_VERSION,
          needsAcceptance: true
        }
      })
    }

    const hasAccepted = !!userReferral.terms_accepted_at
    const hasCurrentVersion = userReferral.terms_version === CURRENT_TERMS_VERSION
    const needsAcceptance = !hasAccepted || !hasCurrentVersion

    console.log('✅ Terms status:', { hasAccepted, hasCurrentVersion, needsAcceptance })

    return NextResponse.json({
      success: true,
      data: {
        hasAccepted,
        acceptedAt: userReferral.terms_accepted_at,
        acceptedVersion: userReferral.terms_version,
        currentVersion: CURRENT_TERMS_VERSION,
        needsAcceptance
      }
    })

  } catch (error) {
    console.error('❌ Error checking terms status:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor al verificar términos'
      },
      { status: 500 }
    )
  }
}
