"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Ticket, Calendar, DollarSign } from "lucide-react"
import { supabase } from "@/lib/supabase"
import type { VentaRifa } from "@/types/ventas-rifas"

interface TicketDisplayProps {
  data: VentaRifa
}

export function TicketDisplay({ data }: TicketDisplayProps) {
  const getImageUrl = (fotoUrl: string | null) => {
    if (!fotoUrl) return null
    if (fotoUrl.startsWith("http")) return fotoUrl

    const { data: urlData } = supabase.storage.from("rifas-images").getPublicUrl(fotoUrl)
    return urlData.publicUrl
  }

  const imageUrl = getImageUrl(data.foto_url)

  return (
    <Card className="max-w-2xl mx-auto overflow-hidden">
      <CardContent className="p-0 m-0">
        {/* Header with image and title */}
        <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Ticket className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">TICKET DE SORTEO</h1>
                <p className="text-blue-100">{data.nombre_rifa || "Rifa"}</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-white text-blue-600 font-mono text-lg px-4 py-2">
              {data.numero_ticket}
            </Badge>
          </div>
        </div>

        {/* Image section */}
        {imageUrl && (
          <div className="relative bg-gray-100">
            <img
              src={imageUrl || "/placeholder.svg"}
              alt={data.nombre_rifa || "Imagen de la rifa"}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Main content */}
        <div className="p-6 space-y-6">
          {/* Customer and purchase info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Información del Cliente</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-gray-600">Nombre:</span>
                  <p className="font-medium">{data.usuario_nombre}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Teléfono:</span>
                  <p className="font-medium">{data.usuario_telefono}</p>
                </div>
                {data.usuario_email && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Email:</span>
                    <p className="font-medium">{data.usuario_email}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Detalles de Compra</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-gray-600">Cantidad de Tickets:</span>
                  <p className="font-bold text-xl">{data.cantidad_tickets}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Valor Total:</span>
                  <p className="font-bold text-xl text-green-600">${data.valor_total}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Estado:</span>
                  <Badge variant={data.estado_pago === "pagado" ? "default" : "secondary"} className="ml-2">
                    {data.estado_pago}
                  </Badge>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Método de Pago:</span>
                  <p className="font-medium">{data.metodo_pago}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Numbers section */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg border-b pb-2">Números Comprados</h3>
            <div className="flex flex-wrap gap-2">
              {data.numeros_comprados.map((numero, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="font-mono text-lg px-3 py-1 bg-yellow-50 border-yellow-300"
                >
                  {numero}
                </Badge>
              ))}
            </div>
          </div>

          {/* Raffle and date info */}
          <div className="grid md:grid-cols-2 gap-6 pt-4 border-t">
            <div className="space-y-2">
              {data.loteria && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-600">Lotería:</span>
                  <p className="font-medium">{data.loteria}</p>
                </div>
              )}
              {data.fecha && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-600">Fecha del Sorteo:</span>
                  <p className="font-medium">{new Date(data.fecha).toLocaleDateString()}</p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Vendedor:</span>
                <p className="font-medium">{data.vendedor_nombre}</p>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Fecha de Venta:</span>
                <p className="font-medium">{new Date(data.fecha_venta).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t">
          <p className="text-center text-sm text-gray-600">¡Conserva este ticket hasta el día del sorteo!</p>
        </div>
      </CardContent>
    </Card>
  )
}
