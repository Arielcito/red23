#!/usr/bin/env node

/**
 * Script para configurar Supabase Storage automáticamente
 * Ejecutar con: node scripts/setup-storage.js
 */

require('dotenv').config({ path: '.env' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

async function setupStorage() {
  try {
    console.log('🔧 Configurando Supabase Storage...')
    console.log('================================')

    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Variables de entorno faltantes')
      return
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // 1. Crear bucket si no existe
    console.log('1. Verificando/creando bucket "images"...')
    const { data: buckets } = await supabase.storage.listBuckets()
    const bucketExists = buckets?.some(bucket => bucket.id === 'images')

    if (!bucketExists) {
      console.log('   Creando bucket...')
      const { data, error } = await supabase.storage.createBucket('images', {
        public: true
      })
      
      if (error) {
        console.error('   ❌ Error creando bucket:', error.message)
      } else {
        console.log('   ✅ Bucket creado exitosamente')
      }
    } else {
      console.log('   ✅ Bucket ya existe')
    }

    // 2. Configurar bucket como público
    console.log('2. Configurando bucket como público...')
    const { error: updateError } = await supabase.storage.updateBucket('images', {
      public: true
    })
    
    if (updateError) {
      console.log('   ⚠️ No se pudo actualizar configuración del bucket:', updateError.message)
    } else {
      console.log('   ✅ Bucket configurado como público')
    }

    // 3. Probar upload de test
    console.log('3. Probando upload de prueba...')
    
    // Crear un archivo de prueba simple
    const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' })
    const testPath = `test_${Date.now()}.txt`
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('images')
      .upload(testPath, testFile, {
        cacheControl: '3600',
        upsert: true
      })

    if (uploadError) {
      console.error('   ❌ Error en upload de prueba:', uploadError.message)
      console.log('')
      console.log('🔍 SOLUCIONES POSIBLES:')
      console.log('1. Ejecutar el script SQL en Supabase Dashboard:')
      console.log('   migrations/fix_storage_policies.sql')
      console.log('')
      console.log('2. O crear políticas manualmente en Dashboard > Storage > Policies:')
      console.log('   - SELECT: bucket_id = \'images\'')
      console.log('   - INSERT: bucket_id = \'images\'')
      console.log('   - UPDATE: bucket_id = \'images\'')
      console.log('   - DELETE: bucket_id = \'images\'')
    } else {
      console.log('   ✅ Upload de prueba exitoso:', uploadData.path)
      
      // Limpiar archivo de prueba
      await supabase.storage.from('images').remove([testPath])
      console.log('   🧹 Archivo de prueba eliminado')
    }

    console.log('')
    console.log('🏁 Configuración completada')

  } catch (error) {
    console.error('❌ Error durante la configuración:', error.message)
  }
}

setupStorage()