"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { lotteries, getBrazilDate } from "@/lib/br/lottery-config"
import { supabase } from "@/lib/supabase"
import { Save, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"
import { ModalHistorialLoterybr } from "@/components/loterias/ModalResulLoterybr"

export default function ResultsManager() {
  const [selectedLottery, setSelectedLottery] = useState<string>("")
  const [results, setResults] = useState<string[]>(["", "", "", "", ""])
  const [isSubmitting, setIsSubmitting] = useState(false)

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
            <Label htmlFor="lottery">Seleccionar Lotería</Label>
            <Select value={selectedLottery} onValueChange={setSelectedLottery}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecciona una lotería" />
              </SelectTrigger>
              <SelectContent>
                {lotteries.map((lottery) => (
                  <SelectItem key={lottery.id} value={lottery.id}>
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium">{lottery.name}</span>
                      <span className="text-sm text-muted-foreground ml-2">{lottery.time}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
