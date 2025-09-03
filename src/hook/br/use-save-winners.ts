"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import type { GanadorAgrupado } from "./useWinner"

export function useSaveWinners() {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const saveWinners = async (ganadoresAgrupados: GanadorAgrupado[]) => {
    if (!ganadoresAgrupados || ganadoresAgrupados.length === 0) {
      return { success: true, message: "No hay ganadores para guardar" }
    }

    setSaving(true)
    setError(null)

    try {
      // Obtener tickets existentes
      const existingTickets = await supabase
        .from("ganadores_agrupados")
        .select("numero_ticket")
        .in(
          "numero_ticket",
          ganadoresAgrupados.map((g) => g.numero_ticket),
        )

      const existingTicketNumbers = new Set(existingTickets.data?.map((t) => t.numero_ticket) || [])

      // Filtrar ganadores que no existen
      const newWinners = ganadoresAgrupados.filter((ganador) => !existingTicketNumbers.has(ganador.numero_ticket))

      if (newWinners.length === 0) {
        return {
          success: true,
          message: "Todos los ganadores ya están guardados",
          inserted: 0,
          skipped: ganadoresAgrupados.length,
        }
      }

      // Preparar datos para insertar
      const winnersToInsert = newWinners.map((ganador) => ({
        numero_ticket: ganador.numero_ticket,
        nombre: ganador.nombre,
        usuario: ganador.usuario,
        telefono: ganador.telefono,
        zona: ganador.zona,
        fecha_apuesta: ganador.fecha_apuesta,
        fecha_sorteo: ganador.fecha_sorteo,
        premio_total: ganador.premio_total,
        cantidad_apuestas: ganador.cantidad_apuestas,
        modalidades: ganador.modalidades,
        loterias: ganador.loterías,
        numeros_apostados: ganador.numeros_apostados,
        grupos_apostados: ganador.grupos_apostados,
        todos_grupos_apostados: ganador.todos_grupos_apostados,
        apuestas_detalle: ganador.apuestas_detalle,
      }))

      // Insertar nuevos ganadores
      const { error: insertError } = await supabase.from("ganadores_agrupados").insert(winnersToInsert)

      if (insertError) {
        throw insertError
      }

      return {
        success: true,
        message: `Se guardaron ${newWinners.length} ganadores nuevos`,
        inserted: newWinners.length,
        skipped: ganadoresAgrupados.length - newWinners.length,
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido"
      setError(errorMessage)
      return {
        success: false,
        message: `Error al guardar ganadores: ${errorMessage}`,
        inserted: 0,
        skipped: 0,
      }
    } finally {
      setSaving(false)
    }
  }

  return {
    saveWinners,
    saving,
    error,
  }
}
