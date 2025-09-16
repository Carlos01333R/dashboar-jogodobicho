"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

export interface Rifa {
  id: string
  nombre: string
  fecha: string
  hora: string
  foto_url?: string
  loteria: string
  numeros_seleccionados: number[]
  numero_minimo: number
  numero_maximo: number
  valor_ticket: number
  descripcion?: string
  estado: "activa" | "finalizada" | "cancelada"
  total_tickets: number
  tickets_vendidos: number
  created_at: string
  updated_at: string
  porcentaje_vendedor: number
}

export interface VentaRifa {
  id: string
  rifa_id: string
  vendedor_id?: string
  vendedor_nombre?: string
  usuario_nombre: string
  usuario_telefono?: string
  usuario_email?: string
  numeros_comprados: number[]
  cantidad_tickets: number
  valor_total: number
  venta_total: number
  venta_neta: number
  ganancias_vendedor: number
  porcentaje_vendedor: number
  metodo_pago?: string
  estado_pago: "pendiente" | "pagado" | "cancelado"
  fecha_venta: string
  created_at: string
  rifa?: Rifa
}

export interface GanadorRifa {
  id: string
  rifa_id: string
  venta_id: string
  numero_ganador: number
  premio?: string
  valor_premio?: number
  fecha_sorteo: string
  resultado_loteria_id?: string
  created_at: string
  rifa?: Rifa
  venta?: VentaRifa
}

export interface DashboardStats {
  rifas_activas: number
  total_ventas: number
  ingresos_totales: number
  ganadores_totales: number
}

// Hook para obtener rifas activas
export function useRifasActivas() {
  const [rifas, setRifas] = useState<Rifa[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRifasActivas = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("rifas")
        .select("*")
        .eq("estado", "activa")
        .order("fecha", { ascending: true })

      if (error) throw error
      setRifas(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRifasActivas()
  }, [])

  return { rifas, loading, error, refetch: fetchRifasActivas }
}

// Hook para obtener ventas
export function useVentas() {
  const [ventas, setVentas] = useState<VentaRifa[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchVentas() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from("ventas_rifas")
          .select(`
            *,
            rifa:rifas(*)
          `)
          .order("fecha_venta", { ascending: false })

        if (error) throw error
        setVentas(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido")
      } finally {
        setLoading(false)
      }
    }

    fetchVentas()
  }, [])

  return { ventas, loading, error, refetch: () => window.location.reload() }
}

// Hook para obtener ganadores
export function useGanadores() {
  const [ganadores, setGanadores] = useState<GanadorRifa[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchGanadores() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from("ganadores_rifas")
          .select(`
            *,
            rifa:rifas(*),
            venta:ventas_rifas(*)
          `)
          .order("fecha_sorteo", { ascending: false })

        if (error) throw error
        setGanadores(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido")
      } finally {
        setLoading(false)
      }
    }

    fetchGanadores()
  }, [])

  return { ganadores, loading, error, refetch: () => window.location.reload() }
}

// Hook para obtener estadísticas del dashboard
export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    rifas_activas: 0,
    total_ventas: 0,
    ingresos_totales: 0,
    ganadores_totales: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true)

        // Obtener rifas activas
        const { count: rifasActivas } = await supabase
          .from("rifas")
          .select("*", { count: "exact", head: true })
          .eq("estado", "activa")

        // Obtener total de ventas e ingresos
        const { data: ventasData, error: ventasError } = await supabase
          .from("ventas_rifas")
          .select("valor_total")
          .eq("estado_pago", "pagado")

        if (ventasError) throw ventasError

        const totalVentas = ventasData?.length || 0
        const ingresosTotales = ventasData?.reduce((sum, venta) => sum + Number(venta.valor_total), 0) || 0

        // Obtener total de ganadores
        const { count: ganadoresTotal } = await supabase
          .from("ganadores_rifas")
          .select("*", { count: "exact", head: true })

        setStats({
          rifas_activas: rifasActivas || 0,
          total_ventas: totalVentas,
          ingresos_totales: ingresosTotales,
          ganadores_totales: ganadoresTotal || 0,
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido")
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { stats, loading, error, refetch: () => window.location.reload() }
}

// Hook para obtener ventas por rifa específica
export function useVentasPorRifa(rifaId: string) {
  const [ventas, setVentas] = useState<VentaRifa[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!rifaId) return

    async function fetchVentasPorRifa() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from("ventas_rifas")
          .select("*")
          .eq("rifa_id", rifaId)
          .order("fecha_venta", { ascending: false })

        if (error) throw error
        setVentas(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido")
      } finally {
        setLoading(false)
      }
    }

    fetchVentasPorRifa()
  }, [rifaId])

  return { ventas, loading, error, refetch: () => window.location.reload() }
}
