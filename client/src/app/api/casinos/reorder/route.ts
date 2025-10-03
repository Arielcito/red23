import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Cliente con service key para operaciones administrativas
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Iniciando reordenamiento de casinos...')

    const { casinos } = await request.json()
    console.log('📋 Datos recibidos:', casinos)

    if (!casinos || !Array.isArray(casinos)) {
      return NextResponse.json({
        success: false,
        error: 'Se requiere un array de casinos con id y position'
      }, { status: 400 })
    }


    // Para evitar conflictos de unicidad, primero liberamos las posiciones
    // asignando posiciones temporales altas, luego asignamos las finales

    const tempPositionBase = 1000 // Base para posiciones temporales

    // Paso 1: Asignar posiciones temporales a todos los casinos
    console.log('🔄 Paso 1: Asignando posiciones temporales...')
    for (let i = 0; i < casinos.length; i++) {
      const casino = casinos[i]
      const tempPosition = tempPositionBase + i
      console.log(`🔄 Casino ${casino.id}: posición actual → ${tempPosition} (temporal)`)

      const { error: tempError } = await supabaseAdmin
        .from('casinos')
        .update({
          position: tempPosition,
          updated_at: new Date().toISOString()
        })
        .eq('id', casino.id)

      if (tempError) {
        console.error(`❌ Error asignando posición temporal al casino ${casino.id}:`, tempError)
        return NextResponse.json({
          success: false,
          error: `Error al asignar posición temporal al casino ${casino.id}`
        }, { status: 500 })
      }
    }

    // Paso 2: Asignar las posiciones finales
    console.log('🔄 Paso 2: Asignando posiciones finales...')
    for (const casino of casinos) {
      console.log(`🔄 Casino ${casino.id}: posición temporal → ${casino.position} (final)`)

      const { error: finalError } = await supabaseAdmin
        .from('casinos')
        .update({
          position: casino.position,
          updated_at: new Date().toISOString()
        })
        .eq('id', casino.id)

      if (finalError) {
        console.error(`❌ Error asignando posición final al casino ${casino.id}:`, finalError)
        return NextResponse.json({
          success: false,
          error: `Error al asignar posición final al casino ${casino.id}`
        }, { status: 500 })
      }
    }

    console.log('✅ Casinos reordenados exitosamente')
    return NextResponse.json({
      success: true,
      message: 'Casinos reordenados exitosamente'
    })

  } catch (error) {
    console.error('❌ Error en API reorder casinos:', error)
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 })
  }
}
