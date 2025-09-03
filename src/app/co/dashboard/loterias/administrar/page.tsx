"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Plus, Edit, Trash2, Loader2 } from "lucide-react"
import { ModalEditarLoteria } from "@/components/loterias/ModalEditarLoteria"

import { useLoteriasAdministrador } from "@/hook/co/useLoterias"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import AgregarLoteriaModal from "@/components/loterias/ModalAgregarLoteria"

export default function TablaLoterias() {
  const { loterias, isLoading, error, reloadLoterias } = useLoteriasAdministrador()
  const [loteriaEditando, setLoteriaEditando] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAgregarModalOpen, setIsAgregarModalOpen] = useState(false)
  const [filterLoterias, setFilterLoterias] = useState("")

  const handleSave = async () => {
    setLoteriaEditando(null)
    setIsModalOpen(false)
    toast.success("Lotería actualizada con éxito")
    await reloadLoterias()
  }

  const handleEditarLoteria = (loteria: any) => {
    setLoteriaEditando(loteria)
    setIsModalOpen(true)
  }

  const handleAgregarLoteria = async () => {
    await reloadLoterias()
  }

  const handleEliminarLoteria = async (loteriaName: string) => {
    try {
      const { data, error } = await supabase.from("loterias").select("*")

      if (error) throw error

      const loteriasActualizadas = data[0].data.loterias.filter((loteria: any) => loteria.name !== loteriaName)

      const { error: updateError } = await supabase
        .from("loterias")
        .update({ data: { loterias: loteriasActualizadas } })
        .eq("id", data[0].id)

      if (updateError) throw updateError

      toast.success("Lotería eliminada con éxito")
      await reloadLoterias()
    } catch (error) {
      console.error("Error al eliminar la lotería:", error)
      toast.error("Error al eliminar la lotería")
    }
  }

  const filtrarLoterias = loterias.filter((loteria: any) =>
    loteria.name.toLowerCase().includes(filterLoterias.toLowerCase()),
  )

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-emerald-500" />
        <p className="font-medium text-lg text-gray-600">Cargando loterías...</p>
      </div>
    )
  }

  if (error) {
    return (
      <section className="w-full flex flex-col px-3 py-2 justify-center items-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md">
          <p className="text-center text-red-700 font-medium">{error}</p>
        </div>
      </section>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <section className="w-full px-6 py-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Filtrar por nombre..."
            value={filterLoterias}
            onChange={(e) => setFilterLoterias(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          onClick={() => setIsAgregarModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Agregar Lotería
        </Button>
      </section>

      <section className="w-full overflow-x-auto px-2">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="font-semibold text-gray-700 py-4">NOMBRE</TableHead>
              <TableHead className="font-semibold text-gray-700 py-4">LOGO</TableHead>
              <TableHead className="font-semibold text-gray-700 py-4 text-right">ACCIONES</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtrarLoterias.length > 0 ? (
              filtrarLoterias.map((loteria: any, index: number) => (
                <TableRow key={index} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                  <TableCell className="font-medium py-4">
                    <div className="flex items-center">
                      <span className="bg-emerald-100 text-emerald-800 rounded-full w-8 h-8 flex items-center justify-center mr-3 font-bold">
                        {index + 1}
                      </span>
                      {loteria.name}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <Avatar className="border-2 border-gray-200">
                      <AvatarImage src={loteria.logo || "/placeholder.svg"} alt={loteria.name} />
                      <AvatarFallback className="bg-gray-100 text-gray-600 font-medium">
                        {loteria.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditarLoteria(loteria)}
                        className="flex items-center gap-1"
                      >
                        <Edit className="h-4 w-4" />
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleEliminarLoteria(loteria.name)}
                        className="flex items-center gap-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        Eliminar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                  {filterLoterias ? "No se encontraron loterías con ese nombre" : "No hay loterías disponibles"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </section>

      {filtrarLoterias.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-sm text-gray-500">
          Mostrando {filtrarLoterias.length} de {loterias.length} loterías
        </div>
      )}

      {loteriaEditando && (
        <ModalEditarLoteria
          loteria={loteriaEditando}
          onSave={handleSave}
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
        />
      )}

      
        <AgregarLoteriaModal
        isOpen={isAgregarModalOpen}
        onOpenChange={setIsAgregarModalOpen}
        onSave={handleAgregarLoteria}
      />
    
    </div>
  )
}
