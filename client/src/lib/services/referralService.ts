import { db, userReferrals, referralTracking, type NewUserReferral, type NewReferralTracking } from '@/lib/db'
import { eq, desc, and, count } from 'drizzle-orm'
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

export class ReferralService {
  static generateReferralCode(): string {
    const code = nanoid(8).toUpperCase()
    console.log('🎯 Generando código de referido:', code)
    return code
  }

  static async createUserReferral(data: CreateReferralData) {
    try {
      console.log('👤 Creando registro de referido para usuario:', data.userId)

      const existingUser = await db
        .select()
        .from(userReferrals)
        .where(eq(userReferrals.user_id, data.userId))
        .limit(1)

      if (existingUser.length > 0) {
        console.log('⚠️ Usuario ya tiene código de referido:', existingUser[0].referral_code)
        return existingUser[0]
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

      const [insertedReferral] = await db
        .insert(userReferrals)
        .values(referralData)
        .returning()

      console.log('✅ Registro de referido creado exitosamente:', {
        id: insertedReferral.id,
        referral_code: insertedReferral.referral_code,
        referred_by_code: insertedReferral.referred_by_code
      })

      if (referredByUserId) {
        await this.createReferralTracking({
          referrerUserId: referredByUserId,
          referredUserId: data.userId,
          referralCode: data.referredByCode!
        })
      }

      return insertedReferral
    } catch (error) {
      console.error('❌ Error creando registro de referido:', error)
      throw new Error('Error al crear el registro de referido')
    }
  }

  static async getUserByReferralCode(referralCode: string) {
    try {
      const [user] = await db
        .select()
        .from(userReferrals)
        .where(eq(userReferrals.referral_code, referralCode))
        .limit(1)

      return user || null
    } catch (error) {
      console.error('❌ Error obteniendo usuario por código:', error)
      return null
    }
  }

  static async getUserReferralData(userId: string) {
    try {
      console.log('🔍 Obteniendo datos de referido para usuario:', userId)

      const [userReferral] = await db
        .select()
        .from(userReferrals)
        .where(eq(userReferrals.user_id, userId))
        .limit(1)

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

      const [insertedTracking] = await db
        .insert(referralTracking)
        .values(trackingData)
        .returning()

      console.log('✅ Tracking de referido creado:', insertedTracking.id)
      return insertedTracking
    } catch (error) {
      console.error('❌ Error creando tracking de referido:', error)
      throw new Error('Error al crear el tracking de referido')
    }
  }

  static async completeReferralTracking(referredUserId: string) {
    try {
      console.log('✔️ Completando tracking de referido para:', referredUserId)

      const [updatedTracking] = await db
        .update(referralTracking)
        .set({
          status: 'completed',
          completed_at: new Date()
        })
        .where(
          and(
            eq(referralTracking.referred_user_id, referredUserId),
            eq(referralTracking.status, 'pending')
          )
        )
        .returning()

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

      const [totalResult] = await db
        .select({ count: count() })
        .from(referralTracking)
        .where(eq(referralTracking.referrer_user_id, userId))

      const [pendingResult] = await db
        .select({ count: count() })
        .from(referralTracking)
        .where(
          and(
            eq(referralTracking.referrer_user_id, userId),
            eq(referralTracking.status, 'pending')
          )
        )

      const [completedResult] = await db
        .select({ count: count() })
        .from(referralTracking)
        .where(
          and(
            eq(referralTracking.referrer_user_id, userId),
            eq(referralTracking.status, 'completed')
          )
        )

      const stats: ReferralStats = {
        totalReferrals: totalResult.count,
        pendingReferrals: pendingResult.count,
        completedReferrals: completedResult.count,
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

      const referrals = await db
        .select({
          id: referralTracking.id,
          referredUserId: referralTracking.referred_user_id,
          referralCode: referralTracking.referral_code,
          status: referralTracking.status,
          createdAt: referralTracking.created_at,
          completedAt: referralTracking.completed_at
        })
        .from(referralTracking)
        .where(eq(referralTracking.referrer_user_id, userId))
        .orderBy(desc(referralTracking.created_at))

      console.log('✅ Referidos obtenidos:', referrals.length)
      return referrals
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