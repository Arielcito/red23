import { useState, useCallback, useEffect } from 'react'
import { getApiConfig } from '@/lib/config/imageGenerator'
import type {
  GetWinnersRequest,
  GetWinnersResponse,
  WinnerRecord,
  WinnersApiHook
} from '@/lib/types/imageGeneration'

export const useWinnersApi = (): WinnersApiHook => {
  const [winners, setWinners] = useState<WinnerRecord[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getWinners = useCallback(async (params?: GetWinnersRequest): Promise<GetWinnersResponse | null> => {
    try {
      console.log('🏆 Obteniendo ganadores desde la API:', params)
      
      setIsLoading(true)
      setError(null)

      const apiConfig = getApiConfig()
      
      // Construir query params
      const queryParams = new URLSearchParams()
      if (params?.date) queryParams.append('date', params.date)

      const queryString = queryParams.toString()
      const url = `${apiConfig.baseUrl}/winners${queryString ? `?${queryString}` : ''}`

      console.log('🌐 URL de consulta:', url)

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': apiConfig.authorizationToken
        }
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Error en la respuesta del servidor:', {
          status: response.status,
          statusText: response.statusText,
          errorText
        })

        let errorMessage = 'Error al obtener los ganadores'
        if (response.status === 401) {
          errorMessage = 'Error de autenticación con la API'
        } else if (response.status >= 500) {
          errorMessage = 'Error interno del servidor, intenta más tarde'
        }

        throw new Error(`${errorMessage} (${response.status})`)
      }

      const data: GetWinnersResponse = await response.json()
      
      console.log('📦 Respuesta de ganadores recibida:', {
        status: data.status,
        winnersCount: data.data?.length || 0
      })

      if (data.status !== 'success') {
        throw new Error('La API retornó un estado de error')
      }

      // Actualizar estado local
      setWinners(data.data || [])

      console.log('✅ Ganadores obtenidos exitosamente:', data.data?.length || 0)
      return data

    } catch (err) {
      let errorMessage = 'Error desconocido al obtener ganadores'

      if (err instanceof Error) {
        if (err.name === 'TypeError' && err.message.includes('fetch')) {
          errorMessage = 'Error de conexión, verifica tu conexión a internet'
        } else {
          errorMessage = err.message
        }
      }

      console.error('❌ Error obteniendo ganadores:', {
        error: err,
        message: errorMessage
      })

      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const refreshWinners = useCallback(async (): Promise<void> => {
    await getWinners()
  }, [getWinners])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Cargar ganadores iniciales al montar el componente
  useEffect(() => {
    refreshWinners()
  }, [refreshWinners])

  return {
    winners,
    isLoading,
    error,
    getWinners,
    refreshWinners,
    clearError
  }
}