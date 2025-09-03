"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
export interface Ganador {
  apuesta_id: string
  usuario: string
  nombre: string
  telefono: string
  loteria: string
  modalidad: string
  numero_apostado: string | null
  grupo_apostado: string | null
  grupos_apostados: string[] | null
  monto_individual: number
  multiplicador_individual: number
  premio: number
  numeros_ganadores: number[]
  fecha_sorteo: string
  numero_ticket: string
  fecha_apuesta: string
  zona: string
}

export interface GanadorAgrupado {
  numero_ticket: string
  usuario: string
  nombre: string
  telefono: string
  loterías: string[]
  modalidades: string[]
  numeros_apostados: (string | null)[]
  grupos_apostados: (string | null)[]
  todos_grupos_apostados: string[]
  premio_total: number
  cantidad_apuestas: number
  fecha_sorteo: string
  fecha_apuesta: string
  apuestas_detalle: Ganador[]
  zona: string
}

export interface Totales {
  total_ganadores: number
  total_premios: number
  premio_promedio: number
}

export interface WinnersResponse {
  ganadores: Ganador[]
  totales: Totales
}

export interface GroupedWinnersResponse {
  ganadores_agrupados: GanadorAgrupado[]
  ganadores_originales: Ganador[]
  totales: Totales
}

interface UseWinnersOptions {
  fecha_filtro?: string
  loteria_filtro?: string
  modalidad_filtro?: string
  ultimas_48_horas?: boolean
}

function groupWinnersByTicket(ganadores: Ganador[]): GanadorAgrupado[] {
  const grouped = ganadores.reduce(
    (acc, ganador) => {
      const ticket = ganador.numero_ticket

      if (!acc[ticket]) {
        acc[ticket] = {
          numero_ticket: ticket,
          usuario: ganador.usuario,
          nombre: ganador.nombre,
          telefono: ganador.telefono,
          loterías: [],
          modalidades: [],
          numeros_apostados: [],
          grupos_apostados: [],
          todos_grupos_apostados: [],
          premio_total: 0,
          cantidad_apuestas: 0,
          fecha_sorteo: ganador.fecha_sorteo,
          fecha_apuesta: ganador.fecha_apuesta,
          apuestas_detalle: [],
          zona: ganador.zona,
        }
      }

      const group = acc[ticket]

      // Add unique values to arrays
      if (!group.loterías.includes(ganador.loteria)) {
        group.loterías.push(ganador.loteria)
      }

      if (!group.modalidades.includes(ganador.modalidad)) {
        group.modalidades.push(ganador.modalidad)
      }

      if (ganador.numero_apostado && !group.numeros_apostados.includes(ganador.numero_apostado)) {
        group.numeros_apostados.push(ganador.numero_apostado)
      }

      if (ganador.grupo_apostado && !group.grupos_apostados.includes(ganador.grupo_apostado)) {
        group.grupos_apostados.push(ganador.grupo_apostado)
      }

      // Add all grupos_apostados if they exist
      if (ganador.grupos_apostados) {
        ganador.grupos_apostados.forEach((grupo) => {
          if (!group.todos_grupos_apostados.includes(grupo)) {
            group.todos_grupos_apostados.push(grupo)
          }
        })
      }

      // Sum prizes and count bets
      group.premio_total += ganador.premio
      group.cantidad_apuestas += 1
      group.apuestas_detalle.push(ganador)

      return acc
    },
    {} as Record<string, GanadorAgrupado>,
  )

  return Object.values(grouped)
}

export function useWinners(options: UseWinnersOptions = {}) {
  const [data, setData] = useState<GroupedWinnersResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchWinners = async () => {
    setLoading(true)
    setError(null)

    try {
      

      const { data: result, error: supabaseError } = await supabase.rpc("buscar_ganadores_48horas", {
        fecha_filtro: options.fecha_filtro || null,
        loteria_filtro: options.loteria_filtro || null,
        modalidad_filtro: options.modalidad_filtro || null,
        ultimas_48_horas: options.ultimas_48_horas || false,
      })

      if (supabaseError) {
        throw new Error(supabaseError.message)
      }

      const originalResponse = result as WinnersResponse

      const ganadores_agrupados = groupWinnersByTicket(originalResponse.ganadores)

      const groupedResponse: GroupedWinnersResponse = {
        ganadores_agrupados,
        ganadores_originales: originalResponse.ganadores,
        totales: {
          ...originalResponse.totales,
          total_ganadores: ganadores_agrupados.length, // Update count to reflect grouped winners
        },
      }

      setData(groupedResponse)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWinners()
  }, [options.fecha_filtro, options.loteria_filtro, options.modalidad_filtro, options.ultimas_48_horas])

  return {
    data,
    loading,
    error,
    refetch: fetchWinners,
  }
}
