"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

export interface Loteria {
  id: string
  name: string
  sorteo_time?: string
  full_name: string
  dias: Record<string, string> // JSON object with day -> time mapping
  dias_activos?: string[] // Array of active days
  created_at?: string
  updated_at?: string
}

export function useLoterias() {
  const [loterias, setLoterias] = useState<Loteria[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchLoterias() {
      try {
        setLoading(true)
        setError(null)

        const { data, error: supabaseError } = await supabase.rpc("get_loteriasbr_with_active_days")

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

  const updateLoteria = async (id: string, dias: Record<string, string>) => {
    try {
      const { error: supabaseError } = await supabase
        .from("loteriasbr")
        .update({
          dias: dias,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)

      if (supabaseError) {
        throw supabaseError
      }

      // Update local state
      setLoterias((prev) =>
        prev.map((loteria) =>
          loteria.id === id
            ? {
                ...loteria,
                dias: dias,
                dias_activos: Object.keys(dias).filter((day) => dias[day]),
              }
            : loteria,
        ),
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

  const createLoteria = async (loteria: Omit<Loteria, "created_at" | "updated_at" | "dias_activos">) => {
    try {
      const { data, error: supabaseError } = await supabase
        .from("loteriasbr")
        .insert([
          {
            id: loteria.id,
            name: loteria.name,
            full_name: loteria.full_name,
            sorteo_time: loteria.sorteo_time,
            dias: loteria.dias,
          },
        ])
        .select()
        .single()

      if (supabaseError) {
        throw supabaseError
      }

      // Add to local state
      const newLoteria = {
        ...data,
        dias_activos: Object.keys(loteria.dias).filter((day) => loteria.dias[day]),
      }
      setLoterias((prev) => [...prev, newLoteria])

      return { success: true, data: newLoteria }
    } catch (err) {
      console.error("Error creating loteria:", err)
      return {
        success: false,
        error: err instanceof Error ? err.message : "Error desconocido",
      }
    }
  }

  const deleteLoteria = async (id: string) => {
    try {
      const { error: supabaseError } = await supabase.from("loteriasbr").delete().eq("id", id)

      if (supabaseError) {
        throw supabaseError
      }

      // Remove from local state
      setLoterias((prev) => prev.filter((loteria) => loteria.id !== id))

      return { success: true }
    } catch (err) {
      console.error("Error deleting loteria:", err)
      return {
        success: false,
        error: err instanceof Error ? err.message : "Error desconocido",
      }
    }
  }

  const refetch = async () => {
    setLoading(true)
    setError(null)

    try {
      const { data, error: supabaseError } = await supabase.rpc("get_loteriasbr_with_active_days")

      if (supabaseError) {
        throw supabaseError
      }

      setLoterias(data || [])
    } catch (err) {
      console.error("Error refetching loterias:", err)
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  return {
    loterias,
    loading,
    error,
    refetch,
    updateLoteria,
    createLoteria,
    deleteLoteria,
  }
}
