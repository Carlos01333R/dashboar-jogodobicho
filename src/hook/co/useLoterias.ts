"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

export function useLoteriasAdministrador() {
  const [loterias, setLoterias] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLoterias = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase.from("loterias").select("*").single()

      if (error) throw error

      setLoterias(data?.data?.loterias || [])
      setError(null)
    } catch (err: any) {
      setError(err.message)
      setLoterias([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLoterias()
  }, [])

  const reloadLoterias = async () => {
    await fetchLoterias()
  }

  return {
    loterias,
    isLoading,
    error,
    reloadLoterias,
  }
}
