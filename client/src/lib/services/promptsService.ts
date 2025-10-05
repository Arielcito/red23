import { createClient } from '@supabase/supabase-js'
import type { AutomaticPrompt } from '@/lib/supabase/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Server-side client with service role for bypassing RLS
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export class PromptsService {

  // Get all prompts
  static async getAllPrompts(): Promise<AutomaticPrompt[]> {
    try {
      console.log('📋 Fetching all automatic prompts')

      const { data, error } = await supabaseAdmin
        .from('automatic_prompts')
        .select('*')
        .order('order_index', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Error fetching prompts:', error)
        throw new Error(`Error fetching prompts: ${error.message}`)
      }

      console.log(`✅ Found ${data?.length || 0} prompts`)
      return data || []

    } catch (error) {
      console.error('❌ Error in PromptsService.getAllPrompts:', error)
      throw error
    }
  }

  // Get active prompts only
  static async getActivePrompts(): Promise<AutomaticPrompt[]> {
    try {
      console.log('📋 Fetching active automatic prompts')

      const { data, error } = await supabaseAdmin
        .from('automatic_prompts')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Error fetching active prompts:', error)
        throw new Error(`Error fetching active prompts: ${error.message}`)
      }

      console.log(`✅ Found ${data?.length || 0} active prompts`)
      return data || []

    } catch (error) {
      console.error('❌ Error in PromptsService.getActivePrompts:', error)
      throw error
    }
  }

  // Get prompt by ID
  static async getPromptById(id: number): Promise<AutomaticPrompt | null> {
    try {
      console.log(`📋 Fetching prompt by ID: ${id}`)

      const { data, error } = await supabaseAdmin
        .from('automatic_prompts')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('❌ Prompt not found')
          return null
        }
        console.error('❌ Error fetching prompt:', error)
        throw new Error(`Error fetching prompt: ${error.message}`)
      }

      console.log(`✅ Prompt found: ${data.title}`)
      return data

    } catch (error) {
      console.error('❌ Error in PromptsService.getPromptById:', error)
      throw error
    }
  }

  // Create new prompt
  static async createPrompt(promptData: {
    title: string
    content: string
    category?: string
    is_active?: boolean
  }): Promise<AutomaticPrompt> {
    try {
      console.log('🆕 Creating new prompt:', promptData.title)

      // Get next order index
      const { data: lastPrompt, error: lastPromptError } = await supabaseAdmin
        .from('automatic_prompts')
        .select('order_index')
        .order('order_index', { ascending: false })
        .limit(1)
        .single()

      if (lastPromptError && lastPromptError.code !== 'PGRST116') {
        console.error('Error getting last prompt:', lastPromptError)
        throw lastPromptError
      }

      const nextOrderIndex = (lastPrompt?.order_index || 0) + 1

      const { data, error } = await supabaseAdmin
        .from('automatic_prompts')
        .insert({
          title: promptData.title.trim(),
          content: promptData.content.trim(),
          category: promptData.category || 'general',
          is_active: promptData.is_active ?? true,
          order_index: nextOrderIndex
        })
        .select()
        .single()

      if (error) {
        console.error('❌ Error creating prompt:', error)
        throw new Error(`Error creating prompt: ${error.message}`)
      }

      console.log(`✅ Prompt created successfully: ${data.id}`)
      return data

    } catch (error) {
      console.error('❌ Error in PromptsService.createPrompt:', error)
      throw error
    }
  }

  // Update prompt
  static async updatePrompt(id: number, updates: {
    title?: string
    content?: string
    category?: string
    is_active?: boolean
    order_index?: number
  }): Promise<AutomaticPrompt> {
    try {
      console.log(`📝 Updating prompt: ${id}`)

      const updateData: Record<string, unknown> = {}
      if (updates.title !== undefined) updateData.title = updates.title.trim()
      if (updates.content !== undefined) updateData.content = updates.content.trim()
      if (updates.category !== undefined) updateData.category = updates.category
      if (updates.is_active !== undefined) updateData.is_active = updates.is_active
      if (updates.order_index !== undefined) updateData.order_index = updates.order_index
      updateData.updated_at = new Date().toISOString()

      const { data, error } = await supabaseAdmin
        .from('automatic_prompts')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('❌ Error updating prompt:', error)
        throw new Error(`Error updating prompt: ${error.message}`)
      }

      console.log(`✅ Prompt updated successfully: ${data.title}`)
      return data

    } catch (error) {
      console.error('❌ Error in PromptsService.updatePrompt:', error)
      throw error
    }
  }

  // Delete prompt
  static async deletePrompt(id: number): Promise<void> {
    try {
      console.log(`🗑️ Deleting prompt: ${id}`)

      const { error } = await supabaseAdmin
        .from('automatic_prompts')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('❌ Error deleting prompt:', error)
        throw new Error(`Error deleting prompt: ${error.message}`)
      }

      console.log(`✅ Prompt deleted successfully`)

    } catch (error) {
      console.error('❌ Error in PromptsService.deletePrompt:', error)
      throw error
    }
  }
}
