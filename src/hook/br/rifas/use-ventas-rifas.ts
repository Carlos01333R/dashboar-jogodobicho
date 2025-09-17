"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { VentaRifa } from "@/types/ventas-rifas"


interface UseVentasRifasReturn {
  data: VentaRifa | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useVentasRifas(numeroTicket: string | null): UseVentasRifasReturn {
  const [data, setData] = useState<VentaRifa | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchVentaRifa = async () => {
    if (!numeroTicket) {
      setData(null)
      setLoading(false)
      setError(null)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const { data: ventaData, error: supabaseError } = await supabase
        .from("ventas_rifas")
        .select("*")
        .eq("numero_ticket", numeroTicket)
        .single()

      if (supabaseError) {
        if (supabaseError.code === "PGRST116") {
          setError("No se encontró ningún ticket con ese número")
        } else {
          setError(supabaseError.message)
        }
        setData(null)
      } else {
        setData(ventaData)
      }
    } catch (err) {
      setError("Error inesperado al obtener los datos")
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVentaRifa()
  }, [numeroTicket])

  const refetch = async () => {
    await fetchVentaRifa()
  }

  return {
    data,
    loading,
    error,
    refetch,
  }
}
