"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { lotteries, getBrazilDate } from "@/lib/br/lottery-config"
import { supabase } from "@/lib/supabase"
import { Save, ArrowLeft, Loader2, AlertCircle, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { ModalHistorialLoterybr } from "@/components/loterias/ModalResulLoterybr"
import { useLoterias } from "@/hook/br/use-loterias"

export default function ResultsManager() {
  const [selectedLottery, setSelectedLottery] = useState<string>("")
  const [results, setResults] = useState<string[]>(["", "", "", "", ""])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { loterias, loading, error, refetch} = useLoterias()


  const handleResultChange = (index: number, value: string) => {
    const newResults = [...results]
    newResults[index] = value
    setResults(newResults)
  }

  const handleSubmitResults = async () => {
    if (!selectedLottery) {
       toast.error("Selecciona una lotería");
      return
    }

    const validResults = results.filter((r) => r.trim() !== "").map((r) => Number.parseInt(r.padStart(4, "0")))

    if (validResults.length !== 5) {
   
        toast.error("Debes ingresar exactamente 5 números");
     
      return
    }

    setIsSubmitting(true)

    try {
      const { error } = await supabase.from("resultados").insert({
        loteria: selectedLottery,
        numeros: validResults,
        fecha: getBrazilDate(),
      })

      if (error) {
        throw error
      }
      toast.success("¡Resultados guardados!");
    

      // Reset form
      setSelectedLottery("")
      setResults(["", "", "", "", "", "", ""])
    } catch (error) {
      console.error("Error saving results:", error)
  
        toast.error("Hubo un problema al guardar los resultados. Intenta nuevamente.");
      
      
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
       
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Carregando loterias...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
       
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <p className="text-destructive mb-4">Erro ao carregar horários: {error}</p>
          <Button onClick={refetch} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Tentar novamente
          </Button>
        </div>
      </div>
    )
  }
  return (
    <div className="w-full px-2">
    <section className="py-4 md:px-4 ">

      <div className="mb-3 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-black mb-2">Ingresar Resultados</h1>
        <p className="text-sm text-muted-foreground">Ingresa los resultados oficiales de las loterías de RJ</p>
      </div>

      {/* Navigation */}
      <div className="flex flex-row justify-end gap-2 mb-4">
        <ModalHistorialLoterybr />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Save className="h-5 w-5" />
            Resultados del Sorteo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Lottery Selection */}
        <div>
  <label htmlFor="lottery" className="block font-medium">
    Seleccionar Lotería
  </label>
  <select
    id="lottery"
    value={selectedLottery}
    onChange={(e) => setSelectedLottery(e.target.value)}
    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
  >
    <option value="">Selecciona una lotería</option>
    {loterias.map((lottery) => (
      <option key={lottery.id} value={lottery.id}>
        {lottery.name}-({lottery.id}) — {lottery.sorteo_time}
      </option>
    ))}
  </select>
</div>

          {/* Results Input */}
          <div>
            <Label className="mb-4 text-gray-500 text-xs">Resultados (5 números de 4 dígitos)</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
              {results.map((result, index) => (
                <div key={index}>
                  <Label htmlFor={`result-${index}`} className="text-sm">
                    {index === 0 ? "1º Premio" : index === 6 ? "Salteado" : `${index + 1}º Premio`}
                  </Label>
                  <Input
                    id={`result-${index}`}
                    type="number"
                    min="0"
                    max="9999"
                    placeholder="0000"
                    value={result}
                    onChange={(e) => handleResultChange(index, e.target.value)}
                    className="mt-1"
                    disabled={isSubmitting}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <Button onClick={handleSubmitResults} disabled={isSubmitting} className="w-full bg-emerald-600">
            {isSubmitting ? "Guardando..." : "Guardar Resultados"}
          </Button>
        </CardContent>
      </Card>
    </section>

    </div>
  )
}
