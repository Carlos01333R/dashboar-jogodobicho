"use client"

import { useEffect, useRef, useState } from "react"
import { useWinners, type GanadorAgrupado } from "@/hook/br/useWinner"
import { useSaveWinners } from "@/hook/br/use-save-winners"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, Trophy, DollarSign, Users, Ticket, Calendar, Save, CheckCircle } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import useZonas from '@/hook/co/useZonas';
import { FormatCurrencyBR } from '@/utils/Format';

interface WinnersListProps {
  fecha_filtro?: string
  loteria_filtro?: string
  modalidad_filtro?: string
  ultimas_48_horas?: boolean
}

export function WinnersList({
  fecha_filtro,
  loteria_filtro,
  modalidad_filtro,
  ultimas_48_horas = true,
}: WinnersListProps) {
  const { data, loading, error, refetch } = useWinners({
    fecha_filtro,
    loteria_filtro,
    modalidad_filtro,
    ultimas_48_horas,
  })

  const { saveWinners, saving, error: saveError } = useSaveWinners()
    const [numero_ticket, setNumTicket] = useState('');
    const [filterZona, setFilterZona] = useState('all');
  const [hasSaved, setHasSaved] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle")
  const lastDataRef = useRef<string>("")
    const { zonas } = useZonas();
    const GanadoresAgrupados = data?.ganadores_agrupados;

  useEffect(() => {
    if (data?.ganadores_agrupados && data.ganadores_agrupados.length > 0) {
      const dataHash = JSON.stringify(data.ganadores_agrupados.map((g) => g.numero_ticket).sort())

      if (dataHash !== lastDataRef.current && !hasSaved) {
        console.log("[v0] Auto-saving winners to database...")
        setSaveStatus("saving")
        setHasSaved(true)
        lastDataRef.current = dataHash

        saveWinners(data.ganadores_agrupados)
          .then((result) => {
            console.log("[v0] Save result:", result)
            setSaveStatus("success")
            setTimeout(() => setSaveStatus("idle"), 3000)
          })
          .catch((error) => {
            console.error("[v0] Save error:", error)
            setSaveStatus("error")
            setHasSaved(false) // Allow retry on error
          })
      }
    }
  }, [data?.ganadores_agrupados, saveWinners, hasSaved])

  useEffect(() => {
    setHasSaved(false)
    setSaveStatus("idle")
    lastDataRef.current = ""
  }, [fecha_filtro, loteria_filtro, modalidad_filtro, ultimas_48_horas])

  const getModalidadColor = (modalidad: string) => {
    const colors = {
      millar: "bg-blue-100 text-blue-800",
      centena: "bg-green-100 text-green-800",
      decena: "bg-yellow-100 text-yellow-800",
      grupo: "bg-purple-100 text-purple-800",
      duque: "bg-orange-100 text-orange-800",
      terno: "bg-red-100 text-red-800",
    }
    return colors[modalidad as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const FilterGanadores = GanadoresAgrupados?.filter((ganador: any) => 
    (numero_ticket === '' || ganador.numero_ticket.toLowerCase().includes(numero_ticket.toLowerCase())) &&
    (filterZona === 'all' || ganador.zona === filterZona)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Cargando ganadores...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="p-6">
          <div className="text-red-600 text-center">
            <p>Error al cargar los ganadores: {error}</p>
            <Button onClick={refetch} variant="outline" className="mt-4 bg-transparent">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reintentar
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data || !data.ganadores_agrupados.length) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No se encontraron ganadores con los filtros aplicados</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6 ">
      {saveStatus !== "idle" && (
        <Card
          className={`border-l-4 hidden ${saveStatus === "error" ? "border-red-500 bg-red-50" : saveStatus === "success" ? "border-green-500 bg-green-50" : "border-blue-500 bg-blue-50"}`}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              {saveStatus === "saving" ? (
                <>
                  <Save className="h-4 w-4 animate-pulse text-blue-600" />
                  <span className="text-sm text-blue-700">Guardando ganadores en la base de datos...</span>
                </>
              ) : saveStatus === "error" ? (
                <>
                  <RefreshCw className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-red-700">Error al guardar: {saveError}</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-700">Ganadores guardados correctamente</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar por #Ticket 
            </label>
            <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="Ingrese el número de ticket" onChange={(e) => setNumTicket(e.target.value)} />
        </div>
         

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zona
            </label>
             <Select name="sector" required onValueChange={(value) => setFilterZona(value)}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Seleccione un sector" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                <SelectLabel>Sector</SelectLabel>
                {zonas.map((sector: any) => (
                  <SelectItem value={sector.nombre} key={sector.id} > 
                    {sector.nombre}
                  </SelectItem>
                ))}
                <SelectItem value="all">Todas las zonas</SelectItem>
                </SelectGroup>
            </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      {/* Resumen de totales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
       

         <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Ganadores</p>
                      <p className="text-2xl font-bold text-gray-900">{data.totales.total_ganadores}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-emerald-500">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
         <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Premios</p>
                      <p className="text-2xl font-bold text-gray-900">{FormatCurrencyBR(data.totales.total_premios)}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-blue-500">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>


         <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Premio Promedio</p>
                      <p className="text-2xl font-bold text-gray-900">{FormatCurrencyBR(data.totales.premio_promedio)}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-yellow-500">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
      </div>

      {/* Lista de ganadores agrupados */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold hidden md:block">Lista de Ganadores ultimas 48 horas</h3>
          <p className="text-sm font-semibold  md:hidden text-gray-500">Ganadores ultimas 48 horas</p>
          <Button onClick={refetch} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {FilterGanadores?.map((ganador: GanadorAgrupado, index: number) => (
            <Card key={`${ganador.numero_ticket}-${index}`} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{ganador.nombre}</CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    {ganador.modalidades.map((modalidad, idx) => (
                      <Badge key={idx} className={getModalidadColor(modalidad)}>
                        {modalidad.toUpperCase()}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p>
                      <span className="font-medium">Usuario:</span> {ganador.usuario}
                    </p>
                    <p>
                      <span className="font-medium">Teléfono:</span> {ganador.telefono}
                    </p>
                    <p className="flex items-center gap-1">
                      <Ticket className="h-4 w-4" />
                      <span className="font-medium">Ticket:</span> {ganador.numero_ticket}
                    </p>
                    <p>
                      <span className="font-medium">Loterías:</span> {ganador.loterías.join(", ")}
                    </p>
                  </div>
                  <div>
                    <p className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">Fecha Apuesta:</span> {ganador.fecha_apuesta}
                    </p>
                    <p>
                      <span className="font-medium">Fecha Sorteo:</span> {ganador.fecha_sorteo}
                    </p>
                    {ganador.cantidad_apuestas > 1 && (
                      <p>
                        <span className="font-medium">Cantidad Apuestas:</span> {ganador.cantidad_apuestas}
                      </p>
                    )}
                  </div>
                </div>

                <div className="border-t pt-3 space-y-2">
                  {ganador.numeros_apostados.length > 0 && (
                    <p className="text-sm">
                      <span className="font-medium">Números Apostados:</span>{" "}
                      {ganador.numeros_apostados.filter((n) => n).join(", ")}
                    </p>
                  )}
                  {ganador.grupos_apostados.length > 0 && (
                    <p className="text-sm">
                      <span className="font-medium">Grupos Apostados:</span>{" "}
                      {ganador.grupos_apostados.filter((g) => g).join(", ")}
                    </p>
                  )}
                  {ganador.todos_grupos_apostados.length > 0 && (
                    <p className="text-sm">
                      <span className="font-medium">Todos los Grupos:</span> {ganador.todos_grupos_apostados.join(", ")}
                    </p>
                  )}
                </div>

                <div className="border-t pt-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      <p>
                        {ganador.cantidad_apuestas > 1
                          ? `Premio consolidado de ${ganador.cantidad_apuestas} apuestas`
                          : "Premio de apuesta única"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-green-600">{FormatCurrencyBR(ganador.premio_total)}</p>
                      <p className="text-xs text-muted-foreground">Premio Total</p>
                    </div>
                  </div>
                </div>

                {ganador.cantidad_apuestas > 1 && (
                  <details className="text-xs text-muted-foreground border-t pt-2">
                    <summary className="cursor-pointer font-medium hover:text-foreground">
                      Ver detalles de apuestas individuales ({ganador.cantidad_apuestas})
                    </summary>
                    <div className="mt-2 space-y-2 pl-4">
                      {ganador.apuestas_detalle.map((apuesta, idx) => (
                        <div key={idx} className="border-l-2 border-gray-200 pl-2">
                          <p>
                            <span className="font-medium">Modalidad:</span> {apuesta.modalidad}
                          </p>
                          <p>
                            <span className="font-medium">Lotería:</span> {apuesta.loteria}
                          </p>
                          <p>
                            <span className="font-medium">Monto:</span> {FormatCurrencyBR(apuesta.monto_individual)} x
                            {apuesta.multiplicador_individual}
                          </p>
                          <p>
                            <span className="font-medium">Premio:</span> {FormatCurrencyBR(apuesta.premio)}
                          </p>
                          {apuesta.numero_apostado && (
                            <p>
                              <span className="font-medium">Número:</span> {apuesta.numero_apostado}
                            </p>
                          )}
                          {apuesta.numeros_ganadores && (
                            <p>
                              <span className="font-medium">Números ganadores:</span>{" "}
                              {apuesta.numeros_ganadores.join(", ")}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </details>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
