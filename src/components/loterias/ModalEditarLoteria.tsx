"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import { Input } from "../ui/input"
import { Card, CardContent } from "../ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

interface Props {
  onSave: () => void
  loteria: any
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

const diasSemana = ["DOMINGO", "LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SÁBADO"]

export function ModalEditarLoteria({ loteria, onSave, isOpen, onOpenChange }: Props) {
  const [name, setName] = useState("")
  const [logo, setLogo] = useState("")
  const [days, setDays] = useState([] as any)

  useEffect(() => {
    if (loteria && isOpen) {
      setName(loteria.name || "")
      setLogo(loteria.logo || "")
      setDays(loteria.days || [])
    }
  }, [loteria, isOpen])

  // Estado para el formulario de agregar nuevo día
  const [nuevoDia, setNuevoDia] = useState("")
  const [nuevaApertura, setNuevaApertura] = useState("00:00")
  const [nuevoCierre, setNuevoCierre] = useState("23:59")

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

    // Resetear el formulario
    setNuevoDia("")
    setNuevaApertura("00:00")
    setNuevoCierre("23:59")
  }

  const handleEliminarDia = (index: any) => {
    const nuevosDias = [...days]
    nuevosDias.splice(index, 1)
    setDays(nuevosDias)
  }

  const handleActualizarHorario = (index: any, campo: any, valor: any) => {
    const nuevosDias = [...days] as any
    nuevosDias[index][campo] = valor
    setDays(nuevosDias)
  }

  async function guardar() {
    try {
      const { data, error } = await supabase.from("loterias").select("*")

      if (error) throw error

      const loteriaActualizada = {
        ...loteria,
        name,
        logo,
        days: days,
      }

      const loteriasActualizadas = data[0].data.loterias.map((l: any) =>
        l.name === loteria.name ? loteriaActualizada : l,
      )

      const { error: updateError } = await supabase
        .from("loterias")
        .update({ data: { loterias: loteriasActualizadas } })
        .eq("id", data[0].id)

      if (updateError) throw updateError

      onOpenChange(false)
      onSave()
    } catch (error) {
      console.error("Error al actualizar la lotería:", error)
      toast.error("Error al actualizar la lotería")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] max-h-[90vh] flex flex-col overflow-y-scroll">
        <DialogHeader>
          <DialogTitle className="text-center">Editar Lotería</DialogTitle>
        </DialogHeader>
        <Input name="Nombre" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
        <Input name="URL del Logo" placeholder="Url del logo" value={logo} onChange={(e) => setLogo(e.target.value)} />

        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Días y Horarios</h3>

          {days.length > 0 ? (
            <div className="space-y-3 mb-4 ">
              {days.map((day: any, index: any) => (
                <Card key={index} className="border border-gray-200">
                  <CardContent className="p-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <span color="primary" className="mb-2 sm:mb-0">
                        {day.dia}
                      </span>
                      <div className="flex flex-1 flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                        <Input
                          type="time"
                          name="Apertura"
                          size={18}
                          value={day.apertura}
                          onChange={(e) => handleActualizarHorario(index, "apertura", e.target.value)}
                          className="w-full sm:w-32"
                        />
                        <Input
                          type="time"
                          name="Cierre"
                          size={18}
                          value={day.cierre}
                          onChange={(e) => handleActualizarHorario(index, "cierre", e.target.value)}
                          className="w-full sm:w-32"
                        />
                        <Button color="danger" onClick={() => handleEliminarDia(index)} className="mt-2 sm:mt-0">
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic mb-4">No hay días configurados</p>
          )}

          <div className="border-t pt-4">
            <h4 className="text-md font-medium mb-2">Agregar nuevo día</h4>
            <div className="flex flex-col sm:flex-row gap-2 items-center">
              <Select value={nuevoDia || ""} onValueChange={(value) => setNuevoDia(value)}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Selecciona un día" />
                </SelectTrigger>
                <SelectContent>
                  {diasSemana.map((dia: string) => (
                    <SelectItem key={dia} value={dia}>
                      {dia}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="time"
                name="Apertura"
                value={nuevaApertura}
                onChange={(e) => setNuevaApertura(e.target.value)}
                className="flex-1"
              />
              <Input
                type="time"
                name="Cierre"
                value={nuevoCierre}
                onChange={(e) => setNuevoCierre(e.target.value)}
                className="flex-1"
              />
              <Button color="primary" onClick={handleAgregarDia} className="">
                Agregar
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <section className="w-full flex items-center justify-center gap-x-2">
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={guardar} className="cursor-pointer">
              Guardar Cambios
            </Button>
          </section>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
