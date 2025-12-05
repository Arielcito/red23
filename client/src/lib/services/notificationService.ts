import type {
  BroadcastNotificationResponse,
  CreateNotificationRequest,
  Notification,
  NotificationDB,
} from '@/lib/types/notifications'
import { supabase } from '@/lib/supabase/client'

export class NotificationService {
  /**
   * Create notification and broadcast to ALL users
   */
  static async createAndBroadcast(
    data: CreateNotificationRequest
  ): Promise<BroadcastNotificationResponse['data']> {
    console.log('📢 Service: Creating and broadcasting notification')

    // 1. Create notification record
    const { data: notification, error: notifError } = await supabase
      .from('notifications')
      .insert({
        type: data.type,
        title: data.title,
        message: data.message,
        data: data.data || null
      })
      .select()
      .single()

    if (notifError) {
      console.error('❌ Error creating notification:', notifError)
      throw new Error(`Error creando notificación: ${notifError.message}`)
    }

    console.log(`✅ Notification created with ID: ${notification.id}`)

    // 2. Get ALL users from platform
    const { data: users, error: usersError } = await supabase
      .rpc('get_all_user_ids')

    if (usersError || !users) {
      console.error('❌ Error fetching users:', usersError)
      // Still return notification even if broadcast partially fails
      return {
        notification: notification as NotificationDB,
        broadcastCount: 0
      }
    }

    console.log(`📊 Found ${users.length} users to notify`)

    // 3. Create user_notifications records for all users
    const userNotifications = users.map((userId: string) => ({
      user_id: userId,
      notification_id: notification.id,
      read_at: null,
      deleted_at: null
    }))

    const { data: insertedRecords, error: broadcastError } = await supabase
      .from('user_notifications')
      .insert(userNotifications)
      .select()

    if (broadcastError) {
      console.error('❌ Error broadcasting to users:', broadcastError)
      throw new Error(`Error enviando notificación: ${broadcastError.message}`)
    }

    const broadcastCount = insertedRecords?.length || 0
    console.log(`✅ Broadcast complete: ${broadcastCount} users notified`)

    return {
      notification: notification as NotificationDB,
      broadcastCount
    }
  }

  /**
   * Get user's notifications (active, not deleted, ordered by newest)
   */
  static async getUserNotifications(userId: string): Promise<Notification[]> {
    console.log(`🔔 Service: Fetching notifications for user ${userId}`)

    const { data, error } = await supabase
      .from('user_notifications')
      .select(`
        id,
        read_at,
        created_at,
        notifications (
          id,
          type,
          title,
          message,
          data,
          created_at,
          updated_at
        )
      `)
      .eq('user_id', userId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Error fetching notifications:', error)
      throw new Error(`Error obteniendo notificaciones: ${error.message}`)
    }

    // Transform to frontend format
    return data.map(un => {
      const notif = un.notifications as unknown as NotificationDB
      return {
        id: notif.id,
        type: notif.type,
        title: notif.title,
        message: notif.message,
        timestamp: new Date(notif.created_at),
        read: un.read_at !== null,
        data: notif.data || undefined
      } as Notification
    })
  }

  /**
   * Mark notification as read for user
   */
  static async markAsRead(userId: string, notificationId: string): Promise<void> {
    console.log(`✓ Service: Marking notification ${notificationId} as read for user ${userId}`)

    const { error } = await supabase
      .from('user_notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('notification_id', notificationId)
      .is('read_at', null)

    if (error) {
      console.error('❌ Error marking as read:', error)
      throw new Error(`Error marcando como leída: ${error.message}`)
    }
  }

  /**
   * Soft delete notification for user
   */
  static async softDeleteForUser(userId: string, notificationId: string): Promise<void> {
    console.log(`🗑️ Service: Soft deleting notification ${notificationId} for user ${userId}`)

    const { error } = await supabase
      .from('user_notifications')
      .update({ deleted_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('notification_id', notificationId)
      .is('deleted_at', null)

    if (error) {
      console.error('❌ Error soft deleting:', error)
      throw new Error(`Error eliminando notificación: ${error.message}`)
    }
  }

  /**
   * Soft delete all notifications for user
   */
  static async softDeleteAllForUser(userId: string): Promise<void> {
    console.log(`🗑️ Service: Soft deleting all notifications for user ${userId}`)

    const { error } = await supabase
      .from('user_notifications')
      .update({ deleted_at: new Date().toISOString() })
      .eq('user_id', userId)
      .is('deleted_at', null)

    if (error) {
      console.error('❌ Error soft deleting all notifications:', error)
      throw new Error(`Error eliminando todas las notificaciones: ${error.message}`)
    }
  }
}
