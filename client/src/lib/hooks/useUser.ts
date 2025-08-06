"use client"

import { useUser as useClerkUser } from '@clerk/nextjs'
import { useMemo } from 'react'

export function useUser() {
  const { user, isLoaded } = useClerkUser()

  const userData = useMemo(() => {
    if (!user) {
      console.log('[User Hook] No hay usuario autenticado')
      return null
    }

    console.log('[User Hook] Datos del usuario obtenidos:', {
      id: user.id,
      email: user.primaryEmailAddress?.emailAddress,
      firstName: user.firstName,
      lastName: user.lastName
    })

    return {
      id: user.id,
      email: user.primaryEmailAddress?.emailAddress || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      fullName: user.fullName || '',
      imageUrl: user.imageUrl || '',
      createdAt: user.createdAt,
      lastSignInAt: user.lastSignInAt
    }
  }, [user])

  return {
    user: userData,
    isLoading: !isLoaded,
    isLoaded
  }
}