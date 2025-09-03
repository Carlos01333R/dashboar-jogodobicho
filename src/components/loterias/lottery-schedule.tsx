"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Loader2, AlertCircle, RefreshCw, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useLoteriasbr } from "@/hook/br/use-loterias"
export function LotterySchedule() {
  const { loterias, loading, error, refetch, updateLoteria } = useLoteriasbr()
  const [editingLoteria, setEditingLoteria] = useState<string | null>(null)
  const [newTime, setNewTime] = useState("")
  const [updating, setUpdating] = useState(false)

  const handleUpdateTime = async (loteriaId: string) => {
    if (!newTime || !editingLoteria) return

    setUpdating(true)
    const result = await updateLoteria(loteriaId, newTime)

    if (result.success) {
      setEditingLoteria(null)
      setNewTime("")
    } else {
      alert(`Error al actualizar: ${result.error}`)
    }
    setUpdating(false)
  }

  const openEditModal = (loteria: any) => {
    setEditingLoteria(loteria.id)
    setNewTime(loteria.sorteo_time)
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
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Horários das Loterias</h1>
        <p className="text-muted-foreground">Confira os horários dos sorteios de hoje</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loterias.map((loteria) => (
          <Card key={loteria.id} className="hover:shadow-lg transition-shadow duration-200 border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-lg">
                <span className="text-primary font-semibold">{loteria.name}</span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-emerald-500">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">{loteria.sorteo_time}</span>
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
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Editar Horário - {loteria.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="time">Novo Horário</Label>
                          <Input
                            id="time"
                            type="time"
                            value={newTime}
                            onChange={(e) => setNewTime(e.target.value)}
                            className="w-full"
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setEditingLoteria(null)} disabled={updating}>
                            Cancelar
                          </Button>
                          <Button onClick={() => handleUpdateTime(loteria.id)} disabled={updating || !newTime}>
                            {updating ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Atualizando...
                              </>
                            ) : (
                              "Salvar"
                            )}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground leading-relaxed">{loteria.full_name}</p>
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
