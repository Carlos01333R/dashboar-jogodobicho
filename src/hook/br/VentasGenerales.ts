"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

interface MesData {
  year: number
  mes: string
  monto_total_apostado: number
  total_neto: number
  ganancias: number
  premio_potencial_total: number
  total_apuestas: number
  promedio_monto: number
  promedio_premio: number
}

interface ApuestasResumen {
  meses: MesData[]
  total_general: {
    monto_total_apostado: number
    total_neto: number
    ganancias: number
    premio_potencial_total: number
    total_apuestas: number
    promedio_monto: number
    promedio_premio: number
  }
}

export function useApuestasResumenBr() {
  const [data, setData] = useState<ApuestasResumen | null>([] as any)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchApuestasResumen() {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase.rpc("apuestas_resumen_json").single()

      if (error) {
        setError(error.message)
        setData(null)
      } else {
        setData(data as ApuestasResumen)
      }
      setLoading(false)
    }

    fetchApuestasResumen()
  }, [])

  return { data, loading, error }
}
