"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
interface GanadorDetalle {
  id: number
  numero_ticket: string
  nombre: string
  usuario: string
  telefono: string
  zona: string
  fecha_apuesta: string
  fecha_sorteo: string
  premio_total: number
  cantidad_apuestas: number
  modalidades: string[]
  loterias: string[]
  numeros_apostados: string[]
  grupos_apostados: string[]
  apuestas_detalle: any[]
  created_at: string
  updated_at: string
}

interface EstadisticaMensual {
  mes: string
  ganadores?: number
  premios?: number
}

interface GanadoresSummaryData {
  filtros_aplicados: {
    zona: string | null
    fecha_inicio: string | null
    fecha_fin: string | null
  }
  resumen: {
    total_ganadores: number
    total_premios: number
    premio_promedio: number
  }
  estadisticas_mensuales: {
    ganadores_por_mes: EstadisticaMensual[]
    premios_por_mes: EstadisticaMensual[]
  }
  ganadores: GanadorDetalle[]
}

interface UseGanadoresSummaryParams {
  zona?: string
  fecha_inicio?: string
  fecha_fin?: string
}

export function useGanadoresSummary(params: UseGanadoresSummaryParams = {}) {
  const [data, setData] = useState<GanadoresSummaryData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchGanadoresSummary = async () => {
    try {
      setLoading(true)
      setError(null)


      const { data: result, error: supabaseError } = await supabase.rpc("get_ganadores_summary", {
        p_zona: params.zona || null,
        p_fecha_inicio: params.fecha_inicio || null,
        p_fecha_fin: params.fecha_fin || null,
      })

      if (supabaseError) {
        throw new Error(supabaseError.message)
      }

      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGanadoresSummary()
  }, [params.zona, params.fecha_inicio, params.fecha_fin])

  return {
    data,
    loading,
    error,
    refetch: fetchGanadoresSummary,
  }
}
