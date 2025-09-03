"use client"

import type React from "react"
import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { Trophy, Calendar, Filter, Download, Search, TrendingUp, MapPin, User, Ticket } from "lucide-react"
import { useGanadoresSummary } from "@/hook/br/use-ganadores-summary"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDateToMMDDYYYYBR, formatDateToMMDDYYYYBrasil } from "@/utils/date-utils"


const GanadoresHistory: React.FC = () => {
  const [zona, setZona] = useState<string>("")
  const [fechaInicio, setFechaInicio] = useState<string>("")
  const [fechaFin, setFechaFin] = useState<string>("")
  const [loteriaFilter, setLoteriaFilter] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState<string>("")

  const {
    data: summary,
    loading,
    error,
  } = useGanadoresSummary({
    zona: zona || undefined,
    fecha_inicio: formatDateToMMDDYYYYBR(fechaInicio) || undefined,
    fecha_fin: formatDateToMMDDYYYYBR(fechaFin) || undefined,
   
  })

  const filteredWinners =
    summary?.ganadores?.filter(
      (winner) =>
        (loteriaFilter === "all" ||
          winner.loterias.some((loteria) => loteria.toLowerCase().includes(loteriaFilter.toLowerCase()))) &&
        (searchTerm === "" ||
          winner.numero_ticket.toLowerCase().includes(searchTerm.toLowerCase()) ||
          winner.nombre.toLowerCase().includes(searchTerm.toLowerCase())),
    ) || []

  const uniqueLotteries = Array.from(new Set(summary?.ganadores?.flatMap((winner) => winner.loterias) || []))

  const monthNames: Record<string, string> = {
    "01": "Ene",
    "02": "Feb",
    "03": "Mar",
    "04": "Abr",
    "05": "May",
    "06": "Jun",
    "07": "Jul",
    "08": "Ago",
    "09": "Sep",
    "10": "Oct",
    "11": "Nov",
    "12": "Dic",
  }

  const premiosMap = (summary?.estadisticas_mensuales.premios_por_mes || []).reduce<Record<string, number>>(
    (acc, item) => {
      acc[item.mes] = item.premios || 0
      return acc
    },
    {},
  )

  const chartData =
    summary?.estadisticas_mensuales.ganadores_por_mes?.map((item) => {
      const [year, month] = item.mes.split("-")
      return {
        month: monthNames[month] || month,
        ganadores: item.ganadores || 0,
        premios: premiosMap[item.mes] || 0,
      }
    }) || []

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        <p className="font-bold text-xl ml-4">Cargando datos...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6">
            <p className="font-bold text-xl text-red-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-2 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base md:text-3xl font-bold text-gray-900">Historial de Ganadores</h2>
          <p className="text-gray-600 mt-1 text-xs">Registro completo de premios otorgados</p>
        </div>
        <Button className="bg-emerald-500 hover:bg-emerald-600">
          <Download className="w-4 h-4 mr-2" />
          Exportar <span className="hidden md:block">Historial</span>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Zona
              </label>
              <Input value={zona} onChange={(e) => setZona(e.target.value)} placeholder="Filtrar por zona..." />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Fecha Inicio
              </label>
              <Input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Fecha Fin
              </label>
              <Input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="w-4 h-4 inline mr-2" />
                Lotería
              </label>
              <Select value={loteriaFilter} onValueChange={setLoteriaFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las loterías" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las loterías</SelectItem>
                  {uniqueLotteries.map((loteria) => (
                    <SelectItem key={loteria} value={loteria}>
                      {loteria}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="w-4 h-4 inline mr-2" />
                Buscar
              </label>
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nombre o ticket..."
              />
            </div>
          </div>
        </CardContent>
      </Card>


      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Ganadores</p>
                <p className="text-2xl font-bold text-gray-900">{summary?.resumen.total_ganadores || 0}</p>
              </div>
              <div className="p-3 rounded-lg bg-emerald-500">
                <Trophy className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="pr-3">
                <p className="text-sm text-gray-600 mb-1">Total Premios</p>
                <p className="text-xl font-bold text-gray-900 truncate">
                  ${(summary?.resumen.total_premios || 0).toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-500">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="pr-3">
                <p className="text-sm text-gray-600 mb-1">Premio Promedio</p>
                <p className="text-xl font-bold text-gray-900 truncate">
                  ${(summary?.resumen.premio_promedio || 0).toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-500">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="md:grid grid-cols-1 lg:grid-cols-2 gap-6 hidden">
        <Card>
          <CardHeader>
            <CardTitle>Tendencia de Ganadores</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [value, "Ganadores"]} />
                <Line type="monotone" dataKey="ganadores" stroke="#10B981" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribución de Premios</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Premios"]} />
                <Bar dataKey="premios" fill="#3B82F6" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Winners List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredWinners.map((winner) => (
          <Card key={winner.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-full bg-green-100">
                    <Trophy className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{winner.nombre}</h3>
                    <p className="text-sm text-gray-500">Ticket #{winner.numero_ticket}</p>
                  </div>
                </div>
                <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                  Premiado
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Premio:</span>
                  <span className="text-lg font-bold text-emerald-600">${winner.premio_total.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Loterías:</span>
                  <span className="text-sm font-medium text-gray-900">{winner.loterias.join(", ")}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Modalidades:</span>
                  <span className="text-sm font-medium text-gray-900">{winner.modalidades.join(", ")}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    Zona:
                  </span>
                  <span className="text-sm font-medium text-gray-900">{winner.zona}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Fecha Sorteo:
                  </span>
                  <span className="text-sm font-medium text-gray-900">{winner.fecha_sorteo}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    Contacto:
                  </span>
                  <span className="text-sm font-medium text-gray-900">{winner.telefono}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center">
                    <Ticket className="w-4 h-4 mr-1" />
                    Apuestas:
                  </span>
                  <span className="text-sm font-medium text-gray-900">{winner.cantidad_apuestas}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default GanadoresHistory
