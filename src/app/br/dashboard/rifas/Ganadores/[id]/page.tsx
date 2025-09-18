"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import {
  ArrowLeft,
  Trophy,
  AlertCircle,
  Calendar,
  Phone,
  Mail,
  Ticket,
  Save,
  User,
  DollarSign,
  CreditCard,
} from "lucide-react"
import { useGanadoresRifa } from "@/hook/br/rifas/use-ganadores-rifa"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import {  useState } from "react"
import { FormatCurrencyBR } from "@/utils/Format"

export default function GanadoresRifas() {
  const params = useParams<{ id: string }>()
  const { data, loading, error, saving, saveGanador } = useGanadoresRifa(params.id)
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleSaveGanador = async () => {
    try {
      await saveGanador()
      setSaveMessage({ type: "success", text: "Ganador guardado exitosamente" })
      setTimeout(() => setSaveMessage(null), 3000)
    } catch (err) {
      setSaveMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Error al guardar ganador",
      })
      setTimeout(() => setSaveMessage(null), 5000)
    }
  }



  if (loading) {
    return (
      <section className="space-y-6">
        <Link
          href={`/br/dashboard/rifas/administrar`}
          className="flex items-center gap-x-2 bg-white rounded-lg p-4 shadow-sm"
        >
          <ArrowLeft className="h-4 w-4 text-gray-600" />
          Volver
        </Link>

        <div className="p-6">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-32 w-full" />
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="space-y-6">
        <Link
          href={`/br/dashboard/rifas/administrar`}
          className="flex items-center gap-x-2 bg-white rounded-lg p-4 shadow-sm"
        >
          <ArrowLeft className="h-4 w-4 text-gray-600" />
          Volver
        </Link>

        <div className="p-6">
          <h1 className="text-xl font-bold mb-4">Error al cargar ganadores</h1>
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  if (!data) {
    return (
      <section className="space-y-6">
        <Link
          href={`/br/dashboard/rifas/administrar`}
          className="flex items-center gap-x-2 bg-white rounded-lg p-4 shadow-sm"
        >
          <ArrowLeft className="h-4 w-4 text-gray-600" />
          Volver
        </Link>

        <div className="p-6">
          <h1 className="text-xl font-bold">No se encontraron datos</h1>
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <Link
        href={`/br/dashboard/rifas/administrar`}
        className="flex items-center gap-x-2 bg-white rounded-lg p-4 shadow-sm hover:bg-gray-50 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 text-gray-600" />
        Volver
      </Link>

      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Trophy className="h-6 w-6 text-yellow-500" />
          <h1 className="text-2xl font-bold">Ganadores de la rifa: {data.rifa_nombre}</h1>
        </div>

        {saveMessage && (
          <Card
            className={`border-2 ${saveMessage.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
          >
            <CardContent className="p-4">
              <div
                className={`flex items-center gap-2 ${saveMessage.type === "success" ? "text-green-700" : "text-red-700"}`}
              >
                <AlertCircle className="h-5 w-5" />
                <span>{saveMessage.text}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Información de la rifa */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Información de la Rifa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-sm text-gray-500">Fecha:</span>
                <p className="font-medium">{data.rifa_fecha}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Lotería:</span>
                <p className="font-medium">{data.rifa_loteria}</p>
              </div>
              <div className="flex flex-row items-center gap-x-2">
                <span className="text-sm text-gray-500">Total ganadores:</span>
                <Badge variant={data.hay_ganadores ? "default" : "secondary"}>{data.total_ganadores}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resultados de la lotería */}
        {data.resultado_numeros ? (
          <Card>
            <CardHeader>
              <CardTitle>Números de la Lotería</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {data.resultado_numeros.map((numero, index) => (
                  <Badge
                    key={index}
                    variant={numero === data.numero_ganador ? "default" : "outline"}
                    className={numero === data.numero_ganador ? "bg-green-500 hover:bg-green-600" : ""}
                  >
                    {numero}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 text-orange-700">
                <AlertCircle className="h-6 w-6" />
                <div>
                  <h3 className="font-semibold">Sin resultado de lotería</h3>
                  <p className="text-sm">{data.mensaje}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Estado de ganadores */}
        {data.hay_ganadores ? (
          <div className="space-y-4">
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <Trophy className="h-5 w-5" />
                    ¡Tenemos Ganador!
                  </CardTitle>
                  <Button onClick={handleSaveGanador} disabled={saving} className="bg-green-600 hover:bg-green-700">
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Guardando..." : "Guardar Ganador"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-500">Nombre:</span>
                      <p className="font-semibold text-lg">{data.ganador_nombre}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">Teléfono:</span>
                      <p className="font-medium">{data.ganador_telefono}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">Email:</span>
                      <p className="font-medium">{data.ganador_email}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-500">Número ganador:</span>
                      <p className="font-bold text-2xl text-green-600">{data.numero_ganador}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Ticket className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">Ticket:</span>
                      <p className="font-medium">{data.numero_ticket}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Fecha de venta:</span>
                      <p className="font-medium">{new Date(data.fecha_venta!).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Información Detallada del Ganador
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.vendedor_nombre && (
                    <div>
                      <span className="text-sm text-gray-500">Vendedor:</span>
                      <p className="font-medium">{data.vendedor_nombre}</p>
                    </div>
                  )}
                  {data.cantidad_tickets && (
                    <div>
                      <span className="text-sm text-gray-500">Tickets comprados:</span>
                      <p className="font-medium">{data.cantidad_tickets}</p>
                    </div>
                  )}
                  {data.valor_total && (
                    <div className="flex items-center gap-2">
                    
                      <div>
                        <span className="text-sm text-gray-500">Valor total:</span>
                        <p className="font-medium">{FormatCurrencyBR(Number(data.valor_total))}</p>
                      </div>
                    </div>
                  )}
                  {data.metodo_pago && (
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-gray-500" />
                      <div >
                        <span className="text-sm text-gray-500">Método de pago:</span>
                        <p className="font-medium">{data.metodo_pago}</p>
                      </div>
                    </div>
                  )}
                  {data.estado_pago && (
                    <div className="flex flex-row items-center gap-x-2">
                      <span className="text-sm text-gray-500">Estado de pago:</span>
                      <Badge variant={data.estado_pago === "pagado" ? "default" : "secondary"}>
                        {data.estado_pago}
                      </Badge>
                    </div>
                  )}
                  {data.numeros_comprados && (
                    <div className="md:col-span-2 lg:col-span-3">
                      <span className="text-sm text-gray-500">Números comprados:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {data.numeros_comprados.map((numero, index) => (
                          <Badge
                            key={index}
                            variant={numero.toString() === data.numero_ganador ? "default" : "outline"}
                            className={numero.toString() === data.numero_ganador ? "bg-green-500" : ""}
                          >
                            {numero}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : data.resultado_numeros ? (
          <Card className="border-gray-200 bg-gray-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 text-gray-700">
                <AlertCircle className="h-6 w-6" />
                <div>
                  <h3 className="font-semibold">Sin ganadores</h3>
                  <p className="text-sm">{data.mensaje}</p>
                  {data.numero_ganador && (
                    <p className="text-sm mt-1">
                      Número ganador: <span className="font-bold">{data.numero_ganador}</span>
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </section>
  )
}
