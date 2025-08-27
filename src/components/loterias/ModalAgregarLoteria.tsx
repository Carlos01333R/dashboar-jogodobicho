"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Trash2, Plus } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

const diasSemana = ["DOMINGO", "LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SÁBADO"]

interface Props {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSave: () => void
}

export default function AgregarLoteriaModal({ isOpen, onOpenChange, onSave }: Props) {
  const [nombre, setNombre] = useState("")
  const [logo, setLogo] = useState("")
  const [days, setDays] = useState<any[]>([])

  // Estado para el formulario de agregar nuevo día
  const [nuevoDia, setNuevoDia] = useState("")
  const [nuevaApertura, setNuevaApertura] = useState("00:00")
  const [nuevoCierre, setNuevoCierre] = useState("23:59")

  const resetForm = () => {
    setNombre("")
    setLogo("")
    setDays([])
    setNuevoDia("")
    setNuevaApertura("00:00")
    setNuevoCierre("23:59")
  }

  const handleAgregarDia = () => {
    if (!nuevoDia) {
      toast.error("Por favor, selecciona un día")
      return
    }

    // Verificar si el día ya existe
    const diaExistente = days.find((day: any) => day.dia === nuevoDia)
    if (diaExistente) {
      toast.error("Este día ya está agregado")
      return
    }

    setDays([
      ...days,
      {
        dia: nuevoDia,
        apertura: nuevaApertura,
        cierre: nuevoCierre,
      },
    ])

    // Resetear el formulario de día
    setNuevoDia("")
    setNuevaApertura("00:00")
    setNuevoCierre("23:59")
  }

  const handleEliminarDia = (index: number) => {
    const nuevosDias = [...days]
    nuevosDias.splice(index, 1)
    setDays(nuevosDias)
  }

  const handleSubmit = async () => {
    if (!nombre || days.length === 0) {
      toast.error("Por favor, completa todos los campos y agrega al menos un día")
      return
    }

    const nuevaLoteria = {
      name: nombre,
      logo: logo || "/placeholder.svg",
      days: days,
    }

    try {
      const { data, error } = await supabase.from("loterias").select("*")

      if (error) throw error

      const loteriasActualizadas = [...data[0].data.loterias, nuevaLoteria]

      const { error: updateError } = await supabase
        .from("loterias")
        .update({ data: { loterias: loteriasActualizadas } })
        .eq("id", data[0].id)

      if (updateError) throw updateError

      toast.success("Lotería agregada con éxito")
      resetForm()
      onSave()
      onOpenChange(false)
    } catch (error) {
      console.error("Error al agregar la lotería:", error)
      toast.error("Error al agregar la lotería")
    }
  }

  const handleClose = () => {
    resetForm()
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Agregar Nueva Lotería</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 p-1">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Nombre de la Lotería</label>
              <Input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ingrese el nombre de la lotería"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">URL del Logo (opcional)</label>
              <Input
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                placeholder="https://ejemplo.com/logo.png"
              />
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Días y Horarios</h3>

              {days.length > 0 ? (
                <div className="space-y-3 mb-4">
                  {days.map((day: any, index: number) => (
                    <Card key={index} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="w-full flex flex-col sm:flex-row items-center sm:items-center justify-between gap-3 ">

                          <Badge variant="secondary" className="mb-2 sm:mb-0">
                            {day.dia}
                          </Badge>

                          <div className="flex flex-1 flex-col sm:flex-row items-center gap-2 w-full sm:w-auto justify-end">
                            <div className="flex flex-col gap-1">
                              <label className="text-xs text-gray-500">Apertura</label>
                              <Input type="time" value={day.apertura} readOnly className="w-full sm:w-32" />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="text-xs text-gray-500">Cierre</label>
                              <Input type="time" value={day.cierre} readOnly className="w-full sm:w-32" />
                            </div>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleEliminarDia(index)}
                              className="mt-2 sm:mt-0"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>


                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic mb-4 text-center py-4 border border-dashed border-gray-300 rounded-lg">
                  No hay días configurados
                </p>
              )}

              <div className="border-t pt-4">
                <h4 className="text-md font-medium mb-3">Agregar nuevo día</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-3 items-center ">
                  <div>
                    <label className="text-xs text-gray-500">Dia</label>
                     <Select value={nuevoDia} onValueChange={setNuevoDia}>
                     
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un día" />
                    </SelectTrigger>
                    <SelectContent>
                      {diasSemana.map((dia) => (
                        <SelectItem key={dia} value={dia}>
                          {dia}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  </div>
                 

                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500">Apertura</label>
                    <Input type="time" value={nuevaApertura} onChange={(e) => setNuevaApertura(e.target.value)} />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500">Cierre</label>
                    <Input type="time" value={nuevoCierre} onChange={(e) => setNuevoCierre(e.target.value)} />
                  </div>

                  <Button onClick={handleAgregarDia} className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus size={16} className="" />
                    Agregar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} className="bg-emerald-600 hover:bg-emerald-700">
            Guardar Lotería
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
