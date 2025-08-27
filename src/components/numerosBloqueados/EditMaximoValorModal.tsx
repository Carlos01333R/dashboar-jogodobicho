"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

interface EditMaximoValorModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  id: string
  currentValue: number
  title: string
  tableType: "maximo_valor" | "tres_cifras" | "dos_cifras"
}

export function EditMaximoValorModal({
  isOpen,
  onOpenChange,
  id,
  currentValue,
  title,
  tableType,
}: EditMaximoValorModalProps) {
  const [valormaximo, setValormaximo] = useState(currentValue.toString())

  const getTableName = (type: string) => {
    switch (type) {
      case "maximo_valor":
        return "maximo_valor"
      case "tres_cifras":
        return "maximo_valor_tres_cifras"
      case "dos_cifras":
        return "maximo_valor_dos_cifras"
      default:
        return "maximo_valor"
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!valormaximo) {
      toast.error("Complete all fields")
      return
    }

    const tableName = getTableName(tableType)

    const { data, error } = await supabase
      .from(tableName)
      .update({
        valor: Number.parseFloat(valormaximo),
      })
      .eq("id", id)
      .select()

    if (error) {
      console.error("Error updating data:", error.message)
      toast.error("Error updating data")
    } else {
      toast.success("Maximo Valor Editado Correctamente")
      onOpenChange(false)
      window.location.reload()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar {title} {currentValue}</DialogTitle>
          <DialogDescription>Actualiza el valor máximo para este tipo de número.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="valor" className="text-right">
                Valor
              </Label>
              <Input
                id="valor"
                type="text"
                value={valormaximo}
                onChange={(e) => setValormaximo(e.target.value)}
                className="col-span-3"
                placeholder="Ingrese el nuevo valor"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit">Guardar cambios</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
