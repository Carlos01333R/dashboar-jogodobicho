"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Loader2, AlertCircle, RefreshCw, Edit, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { Loteria, useLoterias } from "@/hook/br/use-loterias"

const DAYS_OF_WEEK = [
  { key: "lunes", label: "Lunes" },
  { key: "martes", label: "Martes" },
  { key: "miercoles", label: "Miércoles" },
  { key: "jueves", label: "Jueves" },
  { key: "viernes", label: "Viernes" },
  { key: "sabado", label: "Sábado" },
  { key: "domingo", label: "Domingo" },
]

export function LotterySchedule() {
  const { loterias, loading, error, refetch, updateLoteria, createLoteria, deleteLoteria } = useLoterias()
  const [editingLoteria, setEditingLoteria] = useState<string | null>(null)
  const [editingDays, setEditingDays] = useState<Record<string, string>>({})
  const [updating, setUpdating] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newLoteria, setNewLoteria] = useState({
    id: "",
    name: "",
    full_name: "",
    sorteo_time: "",
    dias: {} as Record<string, string>,
  })

  const handleUpdateDays = async (loteriaId: string) => {
    if (!editingLoteria) return

    setUpdating(true)
    const result = await updateLoteria(loteriaId, editingDays)

    if (result.success) {
      setEditingLoteria(null)
      setEditingDays({})
    } else {
      alert(`Error al actualizar: ${result.error}`)
    }
    setUpdating(false)
  }

  const openEditModal = (loteria: Loteria) => {
    setEditingLoteria(loteria.id)
    setEditingDays(loteria.dias || {})
  }

  const handleDayTimeChange = (day: string, time: string) => {
    setEditingDays((prev) => ({
      ...prev,
      [day]: time,
    }))
  }

  const toggleDay = (day: string, checked: boolean) => {
    if (checked) {
      setEditingDays((prev) => ({
        ...prev,
        [day]: "09:00",
      }))
    } else {
      setEditingDays((prev) => {
        const newDays = { ...prev }
        delete newDays[day]
        return newDays
      })
    }
  }

  const handleCreateLoteria = async () => {
    if (!newLoteria.id || !newLoteria.name || !newLoteria.full_name) {
      alert("Por favor completa todos los campos requeridos")
      return
    }

    setUpdating(true)
    const result = await createLoteria(newLoteria)

    if (result.success) {
      setShowAddModal(false)
      setNewLoteria({
        id: "",
        name: "",
        full_name: "",
        sorteo_time: "",
        dias: {},
      })
    } else {
      alert(`Error al crear lotería: ${result.error}`)
    }
    setUpdating(false)
  }

  const handleDeleteLoteria = async (id: string, name: string) => {
    if (!confirm(`¿Estás seguro de eliminar la lotería ${name}?`)) return

    const result = await deleteLoteria(id)
    if (!result.success) {
      alert(`Error al eliminar: ${result.error}`)
    }
  }

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Horários das Loterias</h1>
          <p className="text-muted-foreground">Confira os horários dos sorteios de hoje</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Carregando horários...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Horários das Loterias</h1>
          <p className="text-muted-foreground">Confira os horários dos sorteios de hoje</p>
        </div>
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

  if (loterias.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Horários das Loterias</h1>
          <p className="text-muted-foreground">Confira os horários dos sorteios de hoje</p>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhuma loteria encontrada.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Horários das Loterias</h1>
        <p className="text-muted-foreground">Confira os horários dos sorteios</p>
        <div className="mt-4">
          <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Agregar Lotería
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Agregar Nueva Lotería</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="new-id">ID</Label>
                  <Input
                    id="new-id"
                    value={newLoteria.id}
                    onChange={(e) => setNewLoteria((prev) => ({ ...prev, id: e.target.value }))}
                    placeholder="Ej: PPT"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-name">Nombre</Label>
                  <Input
                    id="new-name"
                    value={newLoteria.name}
                    onChange={(e) => setNewLoteria((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Ej: PPT-RJ"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-full-name">Nombre Completo</Label>
                  <Input
                    id="new-full-name"
                    value={newLoteria.full_name}
                    onChange={(e) => setNewLoteria((prev) => ({ ...prev, full_name: e.target.value }))}
                    placeholder="Ej: Primera del Día"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-time">Horario Principal</Label>
                  <Input
                    id="new-time"
                    type="time"
                    value={newLoteria.sorteo_time}
                    onChange={(e) => setNewLoteria((prev) => ({ ...prev, sorteo_time: e.target.value }))}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowAddModal(false)} disabled={updating}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateLoteria} disabled={updating}>
                    {updating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creando...
                      </>
                    ) : (
                      "Crear"
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loterias.map((loteria : any) => (
          <Card key={loteria.id} className="hover:shadow-lg transition-shadow duration-200 border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-lg">
                <span className="text-primary font-semibold">{loteria.name}</span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-emerald-500">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">{loteria.dias_activos?.length || 0} días</span>
                  </div>
                  <Dialog
                    open={editingLoteria === loteria.id}
                    onOpenChange={(open) => !open && setEditingLoteria(null)}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(loteria)}
                        className="h-8 w-8 p-0 hover:bg-primary/10"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Editar Días y Horarios - {loteria.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4 max-h-96 overflow-y-auto">
                        {DAYS_OF_WEEK.map((day) => (
                          <div key={day.key} className="flex items-center space-x-3">
                            <Checkbox
                              id={day.key}
                              checked={!!editingDays[day.key]}
                              onCheckedChange={(checked : any) => toggleDay(day.key, checked as boolean)}
                            />
                            <Label htmlFor={day.key} className="flex-1 text-sm font-medium">
                              {day.label}
                            </Label>
                            {editingDays[day.key] && (
                              <Input
                                type="time"
                                value={editingDays[day.key] || ""}
                                onChange={(e) => handleDayTimeChange(day.key, e.target.value)}
                                className="w-24"
                              />
                            )}
                          </div>
                        ))}
                        <div className="flex justify-end gap-2 pt-4">
                          <Button variant="outline" onClick={() => setEditingLoteria(null)} disabled={updating}>
                            Cancelar
                          </Button>
                          <Button onClick={() => handleUpdateDays(loteria.id)} disabled={updating}>
                            {updating ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Actualizando...
                              </>
                            ) : (
                              "Guardar"
                            )}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteLoteria(loteria.id, loteria.name)}
                    className="h-8 w-8 p-0 hover:bg-destructive/10 text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">{loteria.full_name}</p>
              {loteria.dias_activos && loteria.dias_activos.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Días activos:</p>
                  <div className="flex flex-wrap gap-1">
                    {loteria.dias_activos.map((day : any) => (
                      <span
                        key={day}
                        className="inline-flex items-center px-2 py-1 rounded-md bg-primary/10 text-primary text-xs"
                      >
                        {DAYS_OF_WEEK.find((d) => d.key === day)?.label}: {loteria.dias[day]}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs text-muted-foreground">
          Horários sujeitos a alteração. Consulte sempre as fontes oficiais.
        </p>
      </div>
    </div>
  )
}
