"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRifasActivas } from "@/hook/br/rifas/use-dashboard-data"
import { Calendar, Clock, DollarSign, Users, Edit, Trash2, Eye } from "lucide-react"
import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { UpdateRifaModal } from "./UpdateRifaModal"
import { ModalDelete } from "../usuarios/ModalDelete"

export function RifasActivasList() {
  const { rifas, loading, error, refetch } = useRifasActivas()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (rifaId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta rifa?")) return

    setDeletingId(rifaId)
    try {
      const { error } = await supabase.from("rifas").delete().eq("id", rifaId)

      if (error) throw error

      toast.success("Rifa eliminada",{
        description: "La rifa ha sido eliminada exitosamente",
      })
      refetch()
    } catch (error) {
      
      toast.error("Error eliminando rifa", {
        description: "No se pudo eliminar la rifa. Intente nuevamente.",
      })
    } finally {
      setDeletingId(null)
    }
  }

  const getImageUrl = (fotoUrl: string | null) => {
    if (!fotoUrl) return null
    if (fotoUrl.startsWith("http")) return fotoUrl

    const { data } = supabase.storage.from("rifas-images").getPublicUrl(fotoUrl)

    return data.publicUrl
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rifas Activas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rifas Activas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">Error: {error}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rifas Activas ({rifas.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {rifas.length === 0 ? (
          <p className="text-muted-foreground">No hay rifas activas</p>
        ) : (
          <div className="space-y-4">
            {rifas.map((rifa) => (
              <div key={rifa.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    {rifa.foto_url && (
                      <img
                        src={getImageUrl(rifa.foto_url) || "/placeholder.svg"}
                        alt={rifa.nombre}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold">{rifa.nombre}</h3>
                      <Badge variant="secondary">{rifa.loteria}</Badge>
                    </div>
                  </div>

                  <div className="flex gap-2">
                  
                     <UpdateRifaModal rifa={rifa} onUpdate={refetch} />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(rifa.id)}
                      disabled={deletingId === rifa.id}
                    >
                        
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {rifa.fecha}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {rifa.hora}
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />${rifa.valor_ticket.toLocaleString("es-CO")}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {rifa.tickets_vendidos}/{rifa.total_tickets || "Sin límite"}
                  </div>
                </div>

                {rifa.descripcion && <p className="text-sm text-muted-foreground">{rifa.descripcion}</p>}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
