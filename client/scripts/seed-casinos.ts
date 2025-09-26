#!/usr/bin/env tsx

// Script para poblar la tabla `casinos` con 10 registros de ejemplo
// Ejecutar con: `npx tsx scripts/seed-casinos.ts`

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import type { NewCasino, PrecioValue } from '../src/lib/supabase/types'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

type CasinoSeed = {
  casino_name: string
  antiguedad: string
  precio: PrecioValue
  rtp: number
  plat_similar?: string
  position?: number
  logo?: string
  image_url?: string
}

type CasinoPayload = NewCasino & { position?: number | null }

// Buscar variables en .env[.local] tanto en la raíz como en client/
const envCandidates = [
  path.resolve(process.cwd(), '.env.local'),
  path.resolve(process.cwd(), '.env'),
  path.resolve(__dirname, '..', '.env.local'),
  path.resolve(__dirname, '..', '.env')
]

envCandidates.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    dotenv.config({ path: filePath, override: true })
  }
})

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseKey = serviceRoleKey ?? anonKey

if (!supabaseUrl || !supabaseKey) {
  console.error('ERROR: No se encontraron las variables NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY/SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false
  }
})

const casinosData: CasinoSeed[] = [
  {
    casino_name: 'Casino Aurora',
    antiguedad: '8 anios',
    precio: 'medio',
    rtp: 97.4,
    plat_similar: 'Stake, Rollbit',
    position: 1,
    logo: 'https://images.unsplash.com/photo-1542144582-1ba00456b5d5?auto=format&fit=crop&w=160&q=80',
    image_url: 'https://images.unsplash.com/photo-1504275107627-0c2ba7a43dba?auto=format&fit=crop&w=1200&q=80'
  },
  {
    casino_name: 'Estrella Roja Casino',
    antiguedad: '5 anios',
    precio: 'barato',
    rtp: 96.1,
    plat_similar: 'LeoVegas, 888casino',
    position: 2,
    logo: 'https://images.unsplash.com/photo-1529429617124-aee388db15a1?auto=format&fit=crop&w=160&q=80',
    image_url: 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?auto=format&fit=crop&w=1200&q=80'
  },
  {
    casino_name: 'Prisma Royale',
    antiguedad: '12 anios',
    precio: 'medio',
    rtp: 98.2,
    plat_similar: 'Betsson, PlayOJO',
    position: 3,
    logo: 'https://images.unsplash.com/photo-1525182008055-f88b95ff7980?auto=format&fit=crop&w=160&q=80',
    image_url: 'https://images.unsplash.com/photo-1567598508481-65985588c673?auto=format&fit=crop&w=1200&q=80'
  },
  {
    casino_name: 'Oasis Digital',
    antiguedad: '4 anios',
    precio: 'muy barato',
    rtp: 95.8,
    plat_similar: 'Wildz, Casumo',
    logo: 'https://images.unsplash.com/photo-1607814079510-4e16fbe0b497?auto=format&fit=crop&w=160&q=80',
    image_url: 'https://images.unsplash.com/photo-1500043207225-3945f12668b8?auto=format&fit=crop&w=1200&q=80'
  },
  {
    casino_name: 'Ruta77 Slots',
    antiguedad: '2 anios',
    precio: 'muy barato',
    rtp: 95.5,
    plat_similar: 'SlotHunter, SlotWolf',
    logo: 'https://images.unsplash.com/photo-1579225448335-1dba4bb8aa3a?auto=format&fit=crop&w=160&q=80',
    image_url: 'https://images.unsplash.com/photo-1517230878791-4d2820e9eaef?auto=format&fit=crop&w=1200&q=80'
  },
  {
    casino_name: 'Fortuna Prime',
    antiguedad: '7 anios',
    precio: 'barato',
    rtp: 97.0,
    plat_similar: 'Mr Green, Bet365',
    logo: 'https://images.unsplash.com/photo-1526682847800-6d3a67b422c9?auto=format&fit=crop&w=160&q=80',
    image_url: 'https://images.unsplash.com/photo-1476900543704-4312b78632f8?auto=format&fit=crop&w=1200&q=80'
  },
  {
    casino_name: 'Nebula Spin',
    antiguedad: '3 anios',
    precio: 'barato',
    rtp: 96.7,
    plat_similar: 'SpinAway, Duelbits',
    logo: 'https://images.unsplash.com/photo-1533237269324-21f6dd66254a?auto=format&fit=crop&w=160&q=80',
    image_url: 'https://images.unsplash.com/photo-1505842465776-3acb7bd0cd81?auto=format&fit=crop&w=1200&q=80'
  },
  {
    casino_name: 'Rio Dorado',
    antiguedad: '6 anios',
    precio: 'medio',
    rtp: 95.9,
    plat_similar: 'Bodog, Codere',
    logo: 'https://images.unsplash.com/photo-1544124499-58912cbddaad?auto=format&fit=crop&w=160&q=80',
    image_url: 'https://images.unsplash.com/photo-1497644083578-611b798c60f3?auto=format&fit=crop&w=1200&q=80'
  },
  {
    casino_name: 'Quantum Luck',
    antiguedad: '1 anio',
    precio: 'barato',
    rtp: 96.3,
    plat_similar: 'BC.Game, Metaspins',
    logo: 'https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?auto=format&fit=crop&w=160&q=80',
    image_url: 'https://images.unsplash.com/photo-1500196932658-4ee1920a5a92?auto=format&fit=crop&w=1200&q=80'
  },
  {
    casino_name: 'Boreal Play',
    antiguedad: '9 anios',
    precio: 'muy barato',
    rtp: 97.8,
    plat_similar: 'Casimba, Casoo',
    logo: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=160&q=80',
    image_url: 'https://images.unsplash.com/photo-1476960853081-611b54f68947?auto=format&fit=crop&w=1200&q=80'
  }
]

function normalizeCasinoPayload(casino: CasinoSeed): CasinoPayload {
  return {
    casino_name: casino.casino_name,
    antiguedad: casino.antiguedad,
    precio: casino.precio,
    rtp: casino.rtp,
    plat_similar: casino.plat_similar ?? null,
    position: typeof casino.position === 'number' ? casino.position : null,
    logo: casino.logo ?? null,
    image_url: casino.image_url ?? null,
    is_active: true
  }
}

async function seedCasinos(): Promise<void> {
  console.log('Iniciando seed de casinos...')

  const { data: existingCasinos, error: fetchError } = await supabase
    .from('casinos')
    .select('id, casino_name')

  if (fetchError) {
    console.error('ERROR: No se pudieron leer los casinos existentes:', fetchError.message)
    process.exit(1)
  }

  type ExistingCasino = { id: string; casino_name: string }

  const existingMap = new Map<string, string>(
    ((existingCasinos as ExistingCasino[]) || []).map(item => [item.casino_name.toLowerCase(), item.id])
  )

  let inserted = 0
  let updated = 0

  for (const casino of casinosData) {
    const payload = normalizeCasinoPayload(casino)
    const existingId = existingMap.get(casino.casino_name.toLowerCase())

    if (existingId) {
      const { error } = await supabase
        .from('casinos')
        .update(payload)
        .eq('id', existingId)

      if (error) {
        console.error(`ERROR: Error actualizando ${casino.casino_name}:`, error.message)
        process.exit(1)
      }

      updated += 1
      console.log(`Actualizado: ${casino.casino_name}`)
    } else {
      const { error } = await supabase
        .from('casinos')
        .insert(payload)

      if (error) {
        console.error(`ERROR: Error insertando ${casino.casino_name}:`, error.message)
        process.exit(1)
      }

      inserted += 1
      console.log(`Insertado: ${casino.casino_name}`)
    }
  }

  console.log('')
  console.log('Seed completado')
  console.log(`   Insertados: ${inserted}`)
  console.log(`   Actualizados: ${updated}`)
}

seedCasinos().catch(error => {
  console.error('ERROR: Error inesperado durante el seed:', error)
  process.exit(1)
})
