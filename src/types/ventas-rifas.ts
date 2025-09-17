export interface VentaRifa {
  id: string
  rifa_id: string
  vendedor_id: string
  vendedor_nombre: string
  usuario_nombre: string
  usuario_telefono: string
  usuario_email: string
  numeros_comprados: string[]
  cantidad_tickets: number
  valor_total: string
  metodo_pago: string
  estado_pago: string
  fecha_venta: string
  created_at: string
  venta_total: string
  venta_neta: string
  ganancias_vendedor: string
  numero_ticket: string | null
  nombre_rifa: string | null
  foto_url: string | null
  loteria: string | null
  fecha: string | null
}
