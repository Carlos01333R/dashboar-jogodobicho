"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

export interface Loteria {
  id: string
  name: string
  sorteo_time: string
  full_name: string
  created_at?: string
  updated_at?: string
}

export function useLoteriasbr() {
  const [loterias, setLoterias] = useState<Loteria[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchLoterias() {
      try {
        setLoading(true)
        setError(null)

        const { data, error: supabaseError } = await supabase
          .from("loteriasbr")
          .select("*")
          .order("sorteo_time", { ascending: true })

        if (supabaseError) {
          throw supabaseError
        }

        setLoterias(data || [])
      } catch (err) {
        console.error("Error fetching loterias:", err)
        setError(err instanceof Error ? err.message : "Error desconocido")
      } finally {
        setLoading(false)
      }
    }

    fetchLoterias()
  }, [])

  const updateLoteria = async (id: string, newTime: string) => {
    try {
      const { error: supabaseError } = await supabase
        .from("loterias")
        .update({
          sorteo_time: newTime,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)

      if (supabaseError) {
        throw supabaseError
      }

      // Update local state
      setLoterias((prev) =>
        prev
          .map((loteria) => (loteria.id === id ? { ...loteria, sorteo_time: newTime } : loteria))
          .sort((a, b) => a.sorteo_time.localeCompare(b.sorteo_time)),
      )

      return { success: true }
    } catch (err) {
      console.error("Error updating loteria:", err)
      return {
        success: false,
        error: err instanceof Error ? err.message : "Error desconocido",
      }
    }
  }

  const refetch = () => {
    setLoading(true)
    setError(null)
    // Re-ejecutar el useEffect
    window.location.reload()
  }

  return {
    loterias,
    loading,
    error,
    refetch,
    updateLoteria, // Added updateLoteria to return object
  }
}
