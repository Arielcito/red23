import { supabase } from '@/lib/supabase/client'
import type { UserReferral, NewUserReferral, ReferralTracking, NewReferralTracking } from '@/lib/supabase/types'
import { nanoid } from 'nanoid'

export interface CreateReferralData {
  userId: string
  referredByCode?: string
}

export interface ReferralStats {
  totalReferrals: number
  pendingReferrals: number
  completedReferrals: number
  myReferralCode: string
}

export interface CodeValidationResult {
  isValid: boolean
  error?: string
  suggestions?: string[]
}

export class ReferralService {
  static generateReferralCode(): string {
    const code = nanoid(8).toUpperCase()
    console.log('🎯 Generando código de referido:', code)
    return code
  }

  static validateCustomReferralCode(code: string): CodeValidationResult {
    // Normalizar código
    const normalizedCode = code.trim().toUpperCase()

    // Validar longitud
    if (normalizedCode.length < 3) {
      return {
        isValid: false,
        error: 'El código debe tener al menos 3 caracteres',
        suggestions: ['Prueba con un código más largo']
      }
    }

    if (normalizedCode.length > 15) {
      return {
        isValid: false,
        error: 'El código no puede tener más de 15 caracteres',
        suggestions: ['Prueba con un código más corto']
      }
    }

    // Validar formato (solo alfanuméricos, guiones y guiones bajos)
    const validFormat = /^[A-Z0-9_-]+$/
    if (!validFormat.test(normalizedCode)) {
      return {
        isValid: false,
        error: 'Solo se permiten letras, números, guiones (-) y guiones bajos (_)',
        suggestions: ['Usa solo letras, números, - y _']
      }
    }

    // Validar palabras prohibidas
    const prohibitedWords = ['ADMIN', 'TEST', 'NULL', 'UNDEFINED', 'RED23', 'CASINO', 'REFERRAL', 'CODE']
    if (prohibitedWords.some(word => normalizedCode.includes(word))) {
      return {
        isValid: false,
        error: 'Este código contiene palabras reservadas',
        suggestions: ['Prueba con un código diferente']
      }
    }

    // Validar que no sea solo números o solo guiones
    if (/^[\d-_]+$/.test(normalizedCode)) {
      return {
        isValid: false,
        error: 'El código debe contener al menos una letra',
        suggestions: ['Agrega algunas letras al código']
      }
    }

    return { isValid: true }
  }

  static async checkReferralCodeAvailability(code: string, excludeUserId?: string): Promise<boolean> {
    try {
      const normalizedCode = code.trim().toUpperCase()
      console.log('🔍 Verificando disponibilidad del código:', normalizedCode)

      const { data: existingUser, error } = await supabase
        .from('user_referrals')
        .select('user_id')
        .eq('referral_code', normalizedCode)
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking code availability:', error)
        throw error
      }

      // Si no existe ningún usuario con ese código, está disponible
      if (!existingUser) {
        return true
      }

      // Si existe pero es el mismo usuario (para actualización), está disponible
      if (excludeUserId && existingUser.user_id === excludeUserId) {
        return true
      }

      // El código ya está en uso por otro usuario
      return false
    } catch (error) {
      console.error('❌ Error verificando disponibilidad:', error)
      throw new Error('Error verificando disponibilidad del código')
    }
  }

  static async updateUserReferralCode(userId: string, newCode: string) {
    try {
      const normalizedCode = newCode.trim().toUpperCase()
      console.log('🔄 Actualizando código de referido:', { userId, newCode: normalizedCode })

      const { data: updatedUser, error } = await supabase
        .from('user_referrals')
        .update({
          referral_code: normalizedCode,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select('*')
        .single()

      if (error) {
        console.error('Error updating referral code:', error)
        throw error
      }

      if (!updatedUser) {
        throw new Error('Usuario no encontrado')
      }

      // También actualizar en referral_tracking si hay referencias al código anterior
      await supabase
        .from('referral_tracking')
        .update({ referral_code: normalizedCode })
        .eq('referrer_user_id', userId)

      console.log('✅ Código de referido actualizado exitosamente')
      return updatedUser
    } catch (error) {
      console.error('❌ Error actualizando código de referido:', error)
      throw new Error('Error al actualizar el código de referido')
    }
  }

  static async createUserReferral(data: CreateReferralData) {
    try {
      console.log('👤 Creando registro de referido para usuario:', data.userId)

      const { data: existingUser, error: existingUserError } = await supabase
        .from('user_referrals')
        .select('*')
        .eq('user_id', data.userId)
        .limit(1)
        .single()

      if (existingUserError && existingUserError.code !== 'PGRST116') {
        console.error('Error checking existing user:', existingUserError)
        throw new Error('Error verificando usuario existente')
      }

      if (existingUser) {
        console.log('⚠️ Usuario ya tiene código de referido:', existingUser.referral_code)
        return existingUser
      }

      let referredByUserId: string | undefined
      if (data.referredByCode) {
        const referrer = await this.getUserByReferralCode(data.referredByCode)
        if (referrer) {
          referredByUserId = referrer.user_id
          console.log('🔗 Usuario referido por:', referredByUserId)
        } else {
          console.log('⚠️ Código de referido no válido:', data.referredByCode)
        }
      }

      let referralCode: string
      let isUnique = false
      let attempts = 0
      
      do {
        referralCode = this.generateReferralCode()
        const existing = await this.getUserByReferralCode(referralCode)
        isUnique = !existing
        attempts++
      } while (!isUnique && attempts < 10)

      if (!isUnique) {
        throw new Error('No se pudo generar un código único después de 10 intentos')
      }

      const referralData: NewUserReferral = {
        user_id: data.userId,
        referral_code: referralCode!,
        referred_by_code: data.referredByCode,
        referred_by_user_id: referredByUserId
      }

      const { data: insertedReferral, error: insertError } = await supabase
        .from('user_referrals')
        .insert(referralData)
        .select('*')
        .single()

      if (insertError) {
        console.error('Error inserting referral:', insertError)
        throw new Error('Error al insertar el referido')
      }

      console.log('✅ Registro de referido creado exitosamente:', {
        id: insertedReferral?.id,
        referral_code: insertedReferral?.referral_code,
        referred_by_code: insertedReferral?.referred_by_code
      })

      if (referredByUserId) {
        await this.createReferralTracking({
          referrerUserId: referredByUserId,
          referredUserId: data.userId,
          referralCode: data.referredByCode!
        })
      }

      return insertedReferral!
    } catch (error) {
      console.error('❌ Error creando registro de referido:', error)
      throw new Error('Error al crear el registro de referido')
    }
  }

  static async getUserByReferralCode(referralCode: string) {
    try {
      const { data: user, error } = await supabase
        .from('user_referrals')
        .select('*')
        .eq('referral_code', referralCode)
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Error obteniendo usuario por código:', error)
        throw error
      }

      return user || null
    } catch (error) {
      console.error('❌ Error obteniendo usuario por código:', error)
      return null
    }
  }

  static async getUserReferralData(userId: string) {
    try {
      console.log('🔍 Obteniendo datos de referido para usuario:', userId)

      const { data: userReferral, error } = await supabase
        .from('user_referrals')
        .select('*')
        .eq('user_id', userId)
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error getting user referral:', error)
        throw error
      }

      if (!userReferral) {
        console.log('⚠️ Usuario no tiene datos de referido')
        return null
      }

      console.log('✅ Datos de referido obtenidos:', {
        referral_code: userReferral.referral_code,
        referred_by_code: userReferral.referred_by_code
      })

      return userReferral
    } catch (error) {
      console.error('❌ Error obteniendo datos de referido:', error)
      throw new Error('Error al obtener los datos de referido')
    }
  }

  static async createReferralTracking(data: {
    referrerUserId: string
    referredUserId: string
    referralCode: string
  }) {
    try {
      console.log('📊 Creando tracking de referido:', data)

      const trackingData: NewReferralTracking = {
        referrer_user_id: data.referrerUserId,
        referred_user_id: data.referredUserId,
        referral_code: data.referralCode,
        status: 'pending'
      }

      const { data: insertedTracking, error } = await supabase
        .from('referral_tracking')
        .insert(trackingData)
        .select('*')
        .single()

      if (error) {
        console.error('Error inserting tracking:', error)
        throw error
      }

      console.log('✅ Tracking de referido creado:', insertedTracking?.id)
      return insertedTracking!
    } catch (error) {
      console.error('❌ Error creando tracking de referido:', error)
      throw new Error('Error al crear el tracking de referido')
    }
  }

  static async completeReferralTracking(referredUserId: string) {
    try {
      console.log('✔️ Completando tracking de referido para:', referredUserId)

      const { data: updatedTracking, error } = await supabase
        .from('referral_tracking')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('referred_user_id', referredUserId)
        .eq('status', 'pending')
        .select('*')
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error updating tracking:', error)
        throw error
      }

      if (updatedTracking) {
        console.log('✅ Tracking completado:', updatedTracking.id)
      }

      return updatedTracking
    } catch (error) {
      console.error('❌ Error completando tracking:', error)
      throw new Error('Error al completar el tracking de referido')
    }
  }

  static async getReferralStats(userId: string): Promise<ReferralStats> {
    try {
      console.log('📈 Obteniendo estadísticas de referidos para:', userId)

      const userReferral = await this.getUserReferralData(userId)
      if (!userReferral) {
        throw new Error('Usuario no encontrado en sistema de referidos')
      }

      const { count: totalCount, error: totalError } = await supabase
        .from('referral_tracking')
        .select('*', { count: 'exact', head: true })
        .eq('referrer_user_id', userId)

      if (totalError) {
        console.error('Error getting total count:', totalError)
        throw totalError
      }

      const { count: pendingCount, error: pendingError } = await supabase
        .from('referral_tracking')
        .select('*', { count: 'exact', head: true })
        .eq('referrer_user_id', userId)
        .eq('status', 'pending')

      if (pendingError) {
        console.error('Error getting pending count:', pendingError)
        throw pendingError
      }

      const { count: completedCount, error: completedError } = await supabase
        .from('referral_tracking')
        .select('*', { count: 'exact', head: true })
        .eq('referrer_user_id', userId)
        .eq('status', 'completed')

      if (completedError) {
        console.error('Error getting completed count:', completedError)
        throw completedError
      }

      const stats: ReferralStats = {
        totalReferrals: totalCount || 0,
        pendingReferrals: pendingCount || 0,
        completedReferrals: completedCount || 0,
        myReferralCode: userReferral.referral_code
      }

      console.log('✅ Estadísticas obtenidas:', stats)
      return stats
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas:', error)
      throw new Error('Error al obtener las estadísticas de referidos')
    }
  }

  static async getMyReferrals(userId: string) {
    try {
      console.log('👥 Obteniendo lista de referidos para:', userId)

      const { data: referrals, error } = await supabase
        .from('referral_tracking')
        .select(`
          id,
          referred_user_id,
          referral_code,
          status,
          created_at,
          completed_at
        `)
        .eq('referrer_user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error getting referrals:', error)
        throw error
      }

      const mappedReferrals = referrals?.map(r => ({
        id: r.id,
        referredUserId: r.referred_user_id,
        referralCode: r.referral_code,
        status: r.status,
        createdAt: r.created_at,
        completedAt: r.completed_at
      })) || []

      console.log('✅ Referidos obtenidos:', mappedReferrals.length)
      return mappedReferrals
    } catch (error) {
      console.error('❌ Error obteniendo lista de referidos:', error)
      throw new Error('Error al obtener la lista de referidos')
    }
  }

  static async validateReferralCode(referralCode: string): Promise<boolean> {
    try {
      console.log('🔍 Validando código de referido:', referralCode)
      
      const user = await this.getUserByReferralCode(referralCode)
      const isValid = !!user
      
      console.log('✅ Código de referido válido:', isValid)
      return isValid
    } catch (error) {
      console.error('❌ Error validando código:', error)
      return false
    }
  }
}