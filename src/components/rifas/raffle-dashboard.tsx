import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, DollarSign, TrendingUp, Users, Ticket, Phone, Mail, Hash, User } from "lucide-react"
import { useEstadisticasVentasRifas } from "@/hook/br/rifas/useEstadisticasVentas"
import { FormatCurrencyBR } from "@/utils/Format"
interface Estadisticas {
  ventas_hoy: number
  total_hoy: number
  neto_hoy: number
  ganancias_hoy: number
  total_acumulado: number
  neto_acumulado: number
  ganancias_acumulado: number
}

interface VentaDelDia {
  id: string
  rifa_id: string
  vendedor_id: string
  vendedor_nombre: string
  usuario_nombre: string
  usuario_telefono: string
  usuario_email: string
  numeros_comprados: number[]
  cantidad_tickets: number
  valor_total: number
  metodo_pago: string
  estado_pago: string
  fecha_venta: string
  created_at: string
  venta_total: number
  venta_neta: number
  ganancias_vendedor: number
  numero_ticket: string | null
  nombre_rifa: string | null
  foto_url: string | null
}

interface RangoConsulta {
  inicio: string
  fin: string
}

interface RaffleData {
  estadisticas: Estadisticas
  ventas_del_dia: VentaDelDia[]
  fecha_consulta: string
  vendedor_filtrado: string
  rango_consulta: RangoConsulta
}



export function RaffleDashboard() {

    const {data, estadisticas, ventasDelDia, error } = useEstadisticasVentasRifas();

    const Ventashoy = estadisticas?.ventas_hoy || 0;
    const TotalHoy = estadisticas?.total_hoy || 0;
    const NetoHoy = estadisticas?.neto_hoy || 0;
    const GananciasHoy = estadisticas?.ganancias_hoy || 0;
    const TotalAcumulado = estadisticas?.total_acumulado || 0;
    const NetoAcumulado = estadisticas?.neto_acumulado || 0;
    const GananciasAcumulado = estadisticas?.ganancias_acumulado || 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(amount)
  }



  return (
    <div className="space-y-6">
      {/* Header */}
    

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas Hoy</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Ventashoy}</div>
            <p className="text-xs text-muted-foreground">tickets vendidos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hoy</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{FormatCurrencyBR(TotalHoy)}</div>
            <p className="text-xs text-muted-foreground">ingresos brutos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Neto Hoy</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{FormatCurrencyBR(NetoHoy)}</div>
            <p className="text-xs text-muted-foreground">ingresos netos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ganancias hoy vendedor</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{FormatCurrencyBR(GananciasHoy)}</div>
            <p className="text-xs text-muted-foreground">comisiones vendedor</p>
          </CardContent>
        </Card>
      </div>

      {/* Estadísticas Acumuladas */}
      <Card>
        <CardHeader>
          <CardTitle>Estadísticas Acumuladas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{FormatCurrencyBR(TotalAcumulado)}</div>
              <p className="text-sm text-muted-foreground">Total Acumulado</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{FormatCurrencyBR(NetoAcumulado)}</div>
              <p className="text-sm text-muted-foreground">Neto Acumulado</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {FormatCurrencyBR(GananciasAcumulado)}
              </div>
              <p className="text-sm text-muted-foreground">Ganancias Acumuladas</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ventas del Día */}
      <Card>
        <CardHeader>
          <CardTitle>Ventas del Día ({ventasDelDia.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ventasDelDia.map((venta, index) => (
              <div key={venta.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">#{index + 1}</Badge>
                    <h3 className="font-semibold">{venta.usuario_nombre}</h3>
                    {venta.numero_ticket && <Badge variant="secondary">{venta.numero_ticket}</Badge>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={venta.estado_pago === "pagado" ? "default" : "destructive"}>
                      {venta.estado_pago}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{venta.fecha_venta}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{venta.usuario_telefono}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{venta.usuario_email}</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                         vendedor: {venta.vendedor_nombre}
                        </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      <span>Números: {venta.numeros_comprados.join(", ")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Ticket className="h-4 w-4 text-muted-foreground" />
                      <span>{venta.cantidad_tickets} tickets</span>
                    </div>
                   
                  </div>
                  

                  <div className="space-y-1">
                    <div className="font-medium">Total: {formatCurrency(venta.valor_total)}</div>
                    <div className="text-muted-foreground">Neto: {formatCurrency(venta.venta_neta)}</div>
                    <div className="text-green-600">Ganancia: {formatCurrency(venta.ganancias_vendedor)}</div>
                  </div>
                </div>

                {venta.nombre_rifa && (
                  <div className="pt-2 border-t">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Rifa:</span>
                      <span className="text-sm">{venta.nombre_rifa}</span>
                      {venta.foto_url && <Badge variant="outline">Con foto</Badge>}
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t text-xs text-muted-foreground">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <span>Método de pago: {venta.metodo_pago}</span>
                    <span>ID: {venta.id.slice(0, 8)}...</span>
                  </div>
                </div>
              
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

  
    </div>
  )
}
