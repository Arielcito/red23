import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

interface PendingUserData {
  email: string
  name: string
  telegram?: string
  country: string
  referralCode?: string
  whatsappMessage?: string
}

export async function POST(request: NextRequest) {
  try {
    console.log('🎯 Iniciando registro de usuario pendiente')

    const { email, name, telegram, country, referralCode, whatsappMessage }: PendingUserData = await request.json()

    console.log('📝 Datos recibidos:', {
      email,
      name,
      country,
      hasReferralCode: !!referralCode,
      hasTelegram: !!telegram
    })

    // Validaciones básicas
    if (!email || !name || !country) {
      return NextResponse.json(
        { success: false, error: 'Email, nombre y país son requeridos' },
        { status: 400 }
      )
    }

    // Verificar si ya existe un usuario pendiente con este email
    const { data: existingPendingUser, error: checkError } = await supabase
      .from('pending_users')
      .select('id, status, created_at')
      .eq('email', email)
      .eq('status', 'pending')
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error verificando usuario pendiente existente:', checkError)
      return NextResponse.json(
        { success: false, error: 'Error verificando usuario existente' },
        { status: 500 }
      )
    }

    if (existingPendingUser) {
      console.log('⚠️ Usuario pendiente ya existe:', existingPendingUser.id)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Ya existe una solicitud pendiente para este email',
          data: { existingSince: existingPendingUser.created_at }
        },
        { status: 409 }
      )
    }

    // Validar código de referido si se proporciona
    let referredByCode = null
    if (referralCode) {
      const { data: referrerUser, error: referrerError } = await supabase
        .from('user_referrals')
        .select('user_id, referral_code')
        .eq('referral_code', referralCode)
        .single()

      if (referrerError || !referrerUser) {
        console.log('⚠️ Código de referido inválido:', referralCode)
        return NextResponse.json(
          { success: false, error: 'Código de referido inválido' },
          { status: 400 }
        )
      }

      referredByCode = referralCode
      console.log('✅ Código de referido válido:', referralCode)
    }

    // Crear registro de usuario pendiente
    const pendingUserData = {
      email,
      name,
      telegram: telegram || null,
      country,
      referral_code: null, // Se generará cuando se complete el registro
      referred_by_code: referredByCode,
      whatsapp_message: whatsappMessage || null,
      status: 'pending' as const
    }

    const { data: insertedUser, error: insertError } = await supabase
      .from('pending_users')
      .insert(pendingUserData)
      .select('*')
      .single()

    if (insertError) {
      console.error('❌ Error insertando usuario pendiente:', insertError)
      return NextResponse.json(
        { success: false, error: 'Error al crear el registro pendiente' },
        { status: 500 }
      )
    }

    console.log('✅ Usuario pendiente creado exitosamente:', {
      id: insertedUser.id,
      email: insertedUser.email,
      hasReferralCode: !!insertedUser.referred_by_code
    })

    return NextResponse.json({
      success: true,
      data: {
        id: insertedUser.id,
        email: insertedUser.email,
        status: insertedUser.status,
        referredByCode: insertedUser.referred_by_code,
        message: 'Usuario pendiente registrado exitosamente. Complete su registro para activar su cuenta.'
      }
    })

  } catch (error) {
    console.error('❌ Error en API de usuario pendiente:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error interno del servidor'
      },
      { status: 500 }
    )
  }
}

// Endpoint para completar registro pendiente (cuando el usuario se registra con Clerk)
export async function PATCH(request: NextRequest) {
  try {
    console.log('🔗 Iniciando vinculación de usuario pendiente con Clerk')

    const { email, clerkUserId } = await request.json()

    if (!email || !clerkUserId) {
      return NextResponse.json(
        { success: false, error: 'Email y Clerk User ID son requeridos' },
        { status: 400 }
      )
    }

    // Buscar usuario pendiente por email
    const { data: pendingUser, error: findError } = await supabase
      .from('pending_users')
      .select('*')
      .eq('email', email)
      .eq('status', 'pending')
      .single()

    if (findError || !pendingUser) {
      console.log('⚠️ No se encontró usuario pendiente para:', email)
      return NextResponse.json(
        { success: false, error: 'No se encontró registro pendiente para este email' },
        { status: 404 }
      )
    }

    // Actualizar registro pendiente con datos de Clerk
    const { data: updatedUser, error: updateError } = await supabase
      .from('pending_users')
      .update({
        clerk_user_id: clerkUserId,
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', pendingUser.id)
      .select('*')
      .single()

    if (updateError) {
      console.error('❌ Error actualizando usuario pendiente:', updateError)
      return NextResponse.json(
        { success: false, error: 'Error al vincular usuario con Clerk' },
        { status: 500 }
      )
    }

    console.log('✅ Usuario pendiente vinculado exitosamente:', {
      id: updatedUser.id,
      email: updatedUser.email,
      clerkUserId
    })

    return NextResponse.json({
      success: true,
      data: {
        id: updatedUser.id,
        email: updatedUser.email,
        clerkUserId: updatedUser.clerk_user_id,
        referredByCode: updatedUser.referred_by_code,
        message: 'Usuario vinculado exitosamente con Clerk'
      }
    })

  } catch (error) {
    console.error('❌ Error en vinculación con Clerk:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error interno del servidor'
      },
      { status: 500 }
    )
  }
}