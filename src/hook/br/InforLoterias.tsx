import { useState, useEffect, useCallback } from "react"
import { supabase } from "../../lib/supabase"

export interface Loteria {
  id: string
  name: string
  sorteo_time: string
  full_name: string
  created_at: string
  updated_at: string
  dias: Record<string, string>
}

// Cache simple en memoria
const loteriasCache = {
  data: null as Loteria[] | null,
  timestamp: 0,
  isValid: () => {
    return loteriasCache.data && 
           loteriasCache.timestamp && 
           (Date.now() - loteriasCache.timestamp < 2 * 60 * 1000) // 2 minutos
  }
}

export const isLoteriaAvailable = (loteria: Loteria): boolean => {
  const now = new Date()

  // Get current day in Spanish (matching the dias object keys)
  const dayNames = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"]
  const currentDay = dayNames[now.getDay()]

  // Get current time in HH:MM format (Brazil timezone)
  const currentTime = now.toLocaleTimeString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
  })

  // Check if lottery has schedule for current day
  if (!loteria.dias || !loteria.dias[currentDay]) {
    return false
  }

  const lotteryTime = loteria.dias[currentDay]

  // Compare times (assuming format HH:MM)
  return currentTime < lotteryTime
}

export function useLoteriasRg() {
  const [loterias, setLoterias] = useState<Loteria[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLoterias = useCallback(async (forceRefresh = false) => {
    // Usar cache si está disponible y no es forzado
    if (!forceRefresh && loteriasCache.isValid() && loteriasCache.data) {
      setLoterias(loteriasCache.data)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const { data, error: supabaseError } = await supabase
        .from('loteriasbr')
        .select('*')
        .order('name')

      if (supabaseError) {
        throw supabaseError
      }

      const loteriasData = data || []
      setLoterias(loteriasData)
      
      // Actualizar cache
      loteriasCache.data = loteriasData
      loteriasCache.timestamp = Date.now()
      
    } catch (err) {
      console.error("Error fetching loterias:", err)
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLoterias()
  }, [fetchLoterias])

  // Función auxiliar para filtrar loterías disponibles
  const getAvailableLoterias = useCallback((): Loteria[] => {
    return loterias.filter(loteria => isLoteriaAvailable(loteria))
  }, [loterias])

  // Función auxiliar para filtrar loterías no disponibles
  const getUnavailableLoterias = useCallback((): Loteria[] => {
    return loterias.filter(loteria => !isLoteriaAvailable(loteria))
  }, [loterias])

  return {
    loterias,
    loading,
    error,
    refetch: () => fetchLoterias(true), // Forzar refresh
    isLoteriaAvailable, // Función standalone
    getAvailableLoterias, // Loterías disponibles ahora
    getUnavailableLoterias, // Loterías no disponibles
  }
}