"use client"

import { useAuth as useClerkAuth, useUser } from '@clerk/nextjs'

export function useAuth() {
  const { isSignedIn, isLoaded, signOut } = useClerkAuth()
  const { user } = useUser()

  console.log('[Auth Hook] Estado de autenticación:', { 
    isSignedIn, 
    isLoaded, 
    userId: user?.id 
  })

  const logout = async () => {
    console.log('[Auth Hook] Iniciando logout')
    try {
      await signOut()
      console.log('[Auth Hook] Logout exitoso')
    } catch (error) {
      console.error('[Auth Hook] Error en logout:', error)
    }
  }

  return {
    isAuthenticated: isSignedIn,
    isLoading: !isLoaded,
    user,
    logout
  }
}