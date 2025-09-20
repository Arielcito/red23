import { useState, useEffect } from 'react'
import type { AutomaticPrompt, NewAutomaticPrompt } from '@/lib/supabase/types'

interface UseAdminPromptsReturn {
  prompts: AutomaticPrompt[]
  isLoading: boolean
  error: string | null
  createPrompt: (data: Omit<NewAutomaticPrompt, 'id' | 'created_at' | 'updated_at' | 'order_index'>) => Promise<void>
  updatePrompt: (id: number, data: Partial<AutomaticPrompt>) => Promise<void>
  deletePrompt: (id: number) => Promise<void>
  reorderPrompts: (prompts: AutomaticPrompt[]) => Promise<void>
  refetch: () => Promise<void>
}

export function useAdminPrompts(): UseAdminPromptsReturn {
  const [prompts, setPrompts] = useState<AutomaticPrompt[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPrompts = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      console.log('📋 Fetching admin prompts')
      
      const response = await fetch('/api/admin/prompts')
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to fetch prompts')
      }

      console.log(`✅ Loaded ${result.data.length} prompts`)
      setPrompts(result.data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch prompts'
      console.error('❌ Error fetching prompts:', errorMessage)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const createPrompt = async (data: Omit<NewAutomaticPrompt, 'id' | 'created_at' | 'updated_at' | 'order_index'>) => {
    try {
      setError(null)
      
      console.log('🆕 Creating prompt:', data)
      
      const response = await fetch('/api/admin/prompts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to create prompt')
      }

      console.log('✅ Created prompt:', result.data.id)
      
      // Add new prompt to the list
      setPrompts(prev => [result.data, ...prev])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create prompt'
      console.error('❌ Error creating prompt:', errorMessage)
      setError(errorMessage)
      throw err
    }
  }

  const updatePrompt = async (id: number, data: Partial<AutomaticPrompt>) => {
    try {
      setError(null)
      
      console.log('📝 Updating prompt:', id, data)
      
      const response = await fetch(`/api/admin/prompts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to update prompt')
      }

      console.log('✅ Updated prompt:', result.data.id)
      
      // Update prompt in the list
      setPrompts(prev => 
        prev.map(prompt => 
          prompt.id === id ? result.data : prompt
        )
      )
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update prompt'
      console.error('❌ Error updating prompt:', errorMessage)
      setError(errorMessage)
      throw err
    }
  }

  const deletePrompt = async (id: number) => {
    try {
      setError(null)
      
      console.log('🗑️ Deleting prompt:', id)
      
      const response = await fetch(`/api/admin/prompts/${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to delete prompt')
      }

      console.log('✅ Deleted prompt:', id)
      
      // Remove prompt from the list
      setPrompts(prev => prev.filter(prompt => prompt.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete prompt'
      console.error('❌ Error deleting prompt:', errorMessage)
      setError(errorMessage)
      throw err
    }
  }

  const reorderPrompts = async (reorderedPrompts: AutomaticPrompt[]) => {
    try {
      setError(null)
      
      console.log('🔄 Reordering prompts')
      
      // Update order_index for each prompt based on new position
      const updates = reorderedPrompts.map((prompt, index) => ({
        ...prompt,
        order_index: reorderedPrompts.length - index
      }))

      // Update in parallel
      await Promise.all(
        updates.map(prompt => 
          updatePrompt(prompt.id, { order_index: prompt.order_index })
        )
      )

      console.log('✅ Reordered prompts')
      
      // Update local state
      setPrompts(updates)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reorder prompts'
      console.error('❌ Error reordering prompts:', errorMessage)
      setError(errorMessage)
      throw err
    }
  }

  useEffect(() => {
    fetchPrompts()
  }, [])

  return {
    prompts,
    isLoading,
    error,
    createPrompt,
    updatePrompt,
    deletePrompt,
    reorderPrompts,
    refetch: fetchPrompts
  }
}