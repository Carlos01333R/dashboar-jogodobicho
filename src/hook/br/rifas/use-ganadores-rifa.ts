"use client"

import { useState, useEffect, useRef } from "react"
import { supabase } from "@/lib/supabase"
import { th } from "date-fns/locale"

export interface GanadorRifa {
  hay_ganadores: boolean
  total_ganadores: number
  ganador_id: string | null
  ganador_nombre: string | null
  ganador_telefono: string | null
  ganador_email: string | null
  numero_ganador: string | null
  numero_ticket: string | null
  fecha_venta: string | null
  rifa_nombre: string
  rifa_fecha: string
  rifa_loteria: string
  resultado_numeros: string[] | null
  mensaje: string
  vendedor_id?: string | null
  vendedor_nombre?: string | null
  cantidad_tickets?: number | null
  valor_total?: string | null
  metodo_pago?: string | null
  estado_pago?: string | null
  venta_total?: string | null
  venta_neta?: string | null
  ganancias_vendedor?: string | null
  foto_url?: string | null
  numeros_comprados?: number[] | null
  created_at?: string | null
  rifa_id?: string | null
  venta_id?: string | null
}

export function useGanadoresRifa(rifaId: string) {
  const [data, setData] = useState<GanadorRifa | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const savedVentaIds = useRef<Set<string>>(new Set())

  const fetchGanadores = async () => {
    if (!rifaId) return

    try {
      setLoading(true)
      setError(null)

    

      const { data: result, error: supabaseError } = await supabase.rpc("verificar_todos_ganadores_rifa2", {
        p_rifa_id: rifaId,
      })

      if (supabaseError) {
        throw supabaseError
      }

      // La función devuelve un array, tomamos el primer elemento
      if (result && result.length > 0) {
        setData(result[0])
      } else {
        setData(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  // En el hook, modifica la función saveGanador:
const saveGanador = async () => {
  if (!data || !data.hay_ganadores || !data.venta_id) {
    throw new Error("No hay datos de ganador para guardar")
  }

  // Verificar si ya se guardó en esta sesión
  if (savedVentaIds.current.has(data.venta_id)) {
    return { success: true, alreadySaved: true }
  }

  try {
    setSaving(true)
   
    // Check if record already exists with same venta_id
    const { data: existingRecord, error: checkError } = await supabase
      .from("ganadores_rifas")
      .select("id")
      .eq("venta_id", data.venta_id)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      throw checkError
    }

    if (existingRecord) {
      savedVentaIds.current.add(data.venta_id)
      return { success: true, alreadySaved: true }
    }

    // Insert new record
    const { error: insertError } = await supabase.from("ganadores_rifas").insert({
      rifa_id: data.rifa_id,
      numero_ganador: Number.parseInt(data.numero_ganador || "0"),
      fecha_venta: data.fecha_venta?.split("T")[0],
      rifa_loteria: data.rifa_loteria,
      foto_url: data.foto_url,
      rifa_nombre: data.rifa_nombre,
      ganador_nombre: data.ganador_nombre,
      ganador_telefono: data.ganador_telefono,
      ganador_email: data.ganador_email,
      ganador_id: data.ganador_id,
      numero_ticket: data.numero_ticket,
      numeros_ganador: data.numero_ganador,
      vendedor_nombre: data.vendedor_nombre,
      numeros_comprados: data.cantidad_tickets,
      venta_id: data.venta_id,
    })

    if (insertError) {
      throw insertError
    }

    savedVentaIds.current.add(data.venta_id)
    return { success: true, alreadySaved: false }
  } catch (err) {
    throw err
  } finally {
    setSaving(false)
  }
}

  useEffect(() => {
    fetchGanadores()
  }, [rifaId])

  useEffect(() => {
    const autoSaveWinner = async () => {
      if (data && data.hay_ganadores && data.venta_id && !savedVentaIds.current.has(data.venta_id) && !saving) {
        try {
          await saveGanador()
          throw ("[v0] Winner auto-saved successfully")
        } catch (error) {
          throw ("[v0] Error auto-saving winner")
        }
      }
    }

    autoSaveWinner()
  }, [data, saving])

  return { data, loading, error, saving, refetch: fetchGanadores, saveGanador }
}
