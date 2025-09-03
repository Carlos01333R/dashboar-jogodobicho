import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { lotteries , animalGroups} from "@/lib/br/lottery-config"
import { supabase } from "@/lib/supabase"
import { ArrowLeft, Calendar, Search, Filter, History } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Result {
  id: string
  loteria: string
  numeros: number[]
  fecha: string
  created_at: string
}
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Trash2} from "lucide-react";

export function ModalHistorialLoterybr() {

      const [results, setResults] = useState<Result[]>([])
  const [filteredResults, setFilteredResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(true)
  const [filterLottery, setFilterLottery] = useState<string>("all")
  const [filterDate, setFilterDate] = useState<string>("")

  useEffect(() => {
    fetchResults()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [results, filterLottery, filterDate])

  const fetchResults = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from("resultados").select("*").order("created_at", { ascending: false })

      if (error) {
        throw error
      }

      setResults(data || [])
    } catch (error) {
      console.error("Error fetching results:", error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...results]

    if (filterLottery !== "all") {
      filtered = filtered.filter((result) => result.loteria === filterLottery)
    }

    if (filterDate) {
      filtered = filtered.filter((result) => result.fecha === filterDate)
    }

    setFilteredResults(filtered)
  }

  const getAnimalForNumber = (num: number) => {
    const lastTwoDigits = num % 100
    for (const group of animalGroups) {
      if (group.numbers.includes(lastTwoDigits)) {
        return group.name
      }
    }
    return "Desconocido"
  }

  const getLotteryName = (lotteryId: string) => {
    const lottery = lotteries.find((l) => l.id === lotteryId)
    return lottery ? lottery.name : lotteryId
  }

  const clearFilters = () => {
    setFilterLottery("all")
    setFilterDate("")
  }

  return (
    <Dialog >
    
        <DialogTrigger asChild>
          <button className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-2 px-3 border border-emerald-500 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-x-2 justify-center" >
         <History className="w-4 h-4" />
        Ver Historial de Resultados
        </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[725px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
           <h1 className="text-2xl md:text-3xl font-bold text-black mb-2 text-center">Historial de Resultados</h1>
           
          </DialogHeader>
          <div className="container mx-auto max-w-6xl">
 

      <section className="py-2 px-4 ">
      <div className="mb-6">
       
      
        <p className="text-sm text-muted-foreground">Consulta todos los resultados ingresados</p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid  md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="filterLottery">Lotería</Label>
              <Select value={filterLottery} onValueChange={setFilterLottery}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las loterías</SelectItem>
                  {lotteries.map((lottery) => (
                    <SelectItem key={lottery.id} value={lottery.id}>
                      {lottery.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="px-2">
              <Label htmlFor="filterDate"> Fecha</Label>
              <Input
                id="filterDate"
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={clearFilters} variant="outline" className="w-full">
                Limpiar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {loading ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p>Cargando resultados...</p>
          </CardContent>
        </Card>
      ) : filteredResults.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">No se encontraron resultados con los filtros aplicados.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-5 w-5 text-blue-500" />
            <h2 className="text-xl font-bold">
              {filteredResults.length} Resultado{filteredResults.length > 1 ? "s" : ""} Encontrado
              {filteredResults.length > 1 ? "s" : ""}
            </h2>
          </div>

          {filteredResults.map((result) => (
            <Card key={result.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-black font-black">{getLotteryName(result.loteria)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{result.fecha}</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {result.numeros.map((numero, index) => (
                    <div key={index} className="border rounded-lg p-3 text-center bg-white">
                      <div className="text-lg font-black text-black mb-1">{numero.toString().padStart(4, "0")}</div>
                      <div className="text-sm text-muted-foreground">{getAnimalForNumber(numero)}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {index === 0 ? "1º" : index === 6 ? "Salteado" : `${index + 1}º`}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-xs text-muted-foreground text-center">
                  Ingresado el: {new Date(result.created_at).toLocaleString("es-ES")}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
   </section>
    </div>
            <DialogFooter>
            <section className="w-full  flex items-center justify-center gap-x-2">
            <DialogClose asChild>
              <button className="py-1.5 px-3 bg-red-500 text-white rounded-lg cursor-pointer">Cancelar</button>
            </DialogClose>
            
            </section>
          </DialogFooter>
        </DialogContent>
          

    </Dialog>
  )
}
