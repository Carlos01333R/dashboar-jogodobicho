"use client"

import { Button } from "@/components/ui/button"
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
import useMaximoValor from "@/hook/co/MaximoValor/useMaximoValor"
import useMaximoValorTresCifras from "@/hook/co/MaximoValor/useMaximoValorTres"
import useMaximoValorDosCifras from "@/hook/co/MaximoValor/useMaximoValorDos"
import { FormatCurrencyCO } from "@/utils/Format"
import { useState } from "react"
import { EditMaximoValorModal } from "./EditMaximoValorModal"

export function ModalMaximoValor() {
  const { maximoValor, ids } = useMaximoValor()
  const { maximoValorTresCifras, idsTres } = useMaximoValorTresCifras()
  const { maximoValorDosCifras, idsDos } = useMaximoValorDosCifras()

  const [editModal, setEditModal] = useState<{
    isOpen: boolean
    id: string
    currentValue: number
    title: string
    tableType: "maximo_valor" | "tres_cifras" | "dos_cifras"
  }>({
    isOpen: false,
    id: "",
    currentValue: 0,
    title: "",
    tableType: "maximo_valor",
  })

  const openEditModal = (
    id: string,
    value: number | null,
    title: string,
    tableType: "maximo_valor" | "tres_cifras" | "dos_cifras",
  ) => {
    setEditModal({
      isOpen: true,
      id,
      currentValue: value || 0,
      title,
      tableType,
    })
  }

  const items = [
    {
      id: ids,
      title: "Maximo Valor 4 cifras",
      value: maximoValor || 0,
      tableType: "maximo_valor" as const,
    },
    {
      id: idsTres,
      title: "Maximo Valor 3 cifras",
      value: maximoValorTresCifras,
      tableType: "tres_cifras" as const,
    },
    {
      id: idsDos,
      title: "Maximo Valor 2 cifras",
      value: maximoValorDosCifras,
      tableType: "dos_cifras" as const,
    },
  ]

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <button className="bg-zinc-700 hover:bg-zinc-800 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors cursor-pointer">
            <p>Agregar valores máximos</p>
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[625px] ">
          <DialogHeader>
            <DialogTitle className="flex-1 text-center">Limitar el valor máximo </DialogTitle>
            <DialogDescription className="flex-1 text-center">
              <span>Poner un valor máximo para los números bloqueados</span>
            </DialogDescription>
          </DialogHeader>
          <section>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <div className="flex  flex-col items-center justify-center">
                    <div className="flex flex-col justify-center items-center">
                      <p className="text-sm text-gray-600 text-center ">{item.title}</p>
                      <p className="text-sm md:text-xl font-bold text-gray-900">{FormatCurrencyCO(item.value)}</p>
                    </div>
                    <button
                      className="w-full bg-blue-100 hover:bg-blue-150 text-black px-4 py-2 rounded-lg flex items-center justify-center transition-colors cursor-pointer mt-2"
                      onClick={() => openEditModal(item.id, item.value, item.title, item.tableType)}
                    >
                      <p className="text-center font-bold">Editar</p>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <DialogFooter>
            <section className="w-full  flex items-center justify-center gap-x-2">
              <DialogClose asChild>
                <button className="py-1.5 px-3 bg-red-500 text-white rounded-lg cursor-pointer">Cancelar</button>
              </DialogClose>
            
            </section>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <EditMaximoValorModal
        isOpen={editModal.isOpen}
        onOpenChange={(open) => setEditModal((prev) => ({ ...prev, isOpen: open }))}
        id={editModal.id}
        currentValue={editModal.currentValue}
        title={editModal.title}
        tableType={editModal.tableType}
      />
    </>
  )
}
