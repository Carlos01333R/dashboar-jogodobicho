"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, Edit, Loader2, Upload } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { useLoterias } from "@/hook/br/use-loterias"


interface UpdateRifaModalProps {
  rifa: {
    id: string
    nombre: string
    fecha: string
    hora: string
    foto_url?: string | null | undefined
    loteria: string
    numero_minimo: number
    numero_maximo: number
    valor_ticket: number
    descripcion?: string | null
    total_tickets: number
    porcentaje_vendedor: number
  }
  onUpdate: () => void
}

export function UpdateRifaModal({ rifa, onUpdate }: UpdateRifaModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [year, month, day] = rifa.fecha.split("-").map(Number);

  const [formData, setFormData] = useState({
    nombre: rifa.nombre,
    fecha: new Date(year, month - 1, day), 
    hora: rifa.hora,
    loteria: rifa.loteria,
    numero_minimo: rifa.numero_minimo,
    numero_maximo: rifa.numero_maximo,
    valor_ticket: rifa.valor_ticket,
    descripcion: rifa.descripcion || "",
    total_tickets: rifa.total_tickets,
    foto_url: rifa.foto_url,
    porcentaje_vendedor: rifa.porcentaje_vendedor,
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null | undefined>(rifa.foto_url)
  const { loterias } = useLoterias()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === "valor_ticket" || name === "numero_minimo" || name === "numero_maximo" || name === "total_tickets" 
        ? Number(value) 
        : value
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: name === "valor_ticket" || name === "numero_minimo" || name === "numero_maximo" || name === "total_tickets" 
        ? Number(value) 
        : value
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadImage = async () => {
    if (!imageFile) return rifa.foto_url

    try {
      setUploading(true)
      
      // Eliminar imagen anterior si existe
      if (rifa.foto_url && !rifa.foto_url.startsWith("http")) {
        await supabase.storage.from("rifas-images").remove([rifa.foto_url])
      }

      // Subir nueva imagen
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      
      const { error: uploadError, data } = await supabase.storage
        .from("rifas-images")
        .upload(fileName, imageFile)

      if (uploadError) throw uploadError

      return fileName
    } catch (error) {
      console.error("Error uploading image:", error)
      toast.error("Error al subir la imagen")
      return null
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let foto_url = rifa.foto_url
      
      // Subir nueva imagen si se seleccionó una
      if (imageFile) {
        const uploadedImage = await uploadImage()
        if (uploadedImage) {
          foto_url = uploadedImage
        }
      }

      // Actualizar la rifa en la base de datos
      const { error } = await supabase
        .from("rifas")
        .update({
          nombre: formData.nombre,
          fecha: format(formData.fecha, "yyyy-MM-dd"),
          hora: formData.hora,
          loteria: formData.loteria,
          numero_minimo: formData.numero_minimo,
          numero_maximo: formData.numero_maximo,
          valor_ticket: formData.valor_ticket,
          descripcion: formData.descripcion,
          total_tickets: formData.total_tickets,
          foto_url: foto_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", rifa.id)

      if (error) throw error

      toast.success("Rifa actualizada", {
        description: "La rifa ha sido actualizada exitosamente",
      })
      
      setOpen(false)
      onUpdate()
    } catch (error) {
      console.error("Error updating raffle:", error)
      toast.error("Error actualizando rifa", {
        description: "No se pudo actualizar la rifa. Intente nuevamente.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="cursor-pointer">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Rifa: {rifa.nombre}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <section >
            
             <div className="space-y-2">
                <Label htmlFor="nombre">Nombre de la Rifa *</Label>
                <Input
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <section className="grid grid-cols-1 md:grid-cols-2 gap-4 py-3">
                   <div className="space-y-2">
                <Label htmlFor="loteria">Lotería *</Label>
                <Select
                  value={formData.loteria}
                  onValueChange={(value) => handleSelectChange("loteria", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una lotería" />
                  </SelectTrigger>
                  <SelectContent>
                  {loterias.map((loteria: any)  => (
                    <SelectItem key={loteria.id} value={loteria.id}>
                      {loteria.name} ({loteria.id})
                    </SelectItem>
                  ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="valor_ticket">Valor por Ticket</Label>
                <Input
                  id="valor_ticket"
                  name="valor_ticket"
                  type="number"
                  min="100"
                  step="100"
                  value={formData.valor_ticket}
                  onChange={handleInputChange}
                  required
                />
              </div>
              </section>

            <div className="space-y-4">

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="numero_minimo">Número Mínimo *</Label>
                  <Input
                    id="numero_minimo"
                    name="numero_minimo"
                    type="number"
                    min="0"
                    value={formData.numero_minimo}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numero_maximo">Número Máximo *</Label>
                  <Input
                    id="numero_maximo"
                    name="numero_maximo"
                    type="number"
                    min={formData.numero_minimo + 1}
                    value={formData.numero_maximo}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

             

          
            </div>

         <section className="grid grid-cols-1 md:grid-cols-2 gap-4 py-3">
          <div className="space-y-2">
                <Label htmlFor="fecha">Fecha del Sorteo *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.fecha && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.fecha ? (
                        format(formData.fecha, "PPP", { locale: es })
                      ) : (
                        <span>Selecciona una fecha</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.fecha}
                      onSelect={(date) => date && setFormData({...formData, fecha: date})}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="hora">Hora del Sorteo *</Label>
                <Input
                  id="hora"
                  name="hora"
                  type="time"
                  value={formData.hora}
                  onChange={handleInputChange}
                  required
                />
              </div>
         </section>
      
            <div className="space-y-4">
                <Label htmlFor="total_tickets">Porcentage de Vendedor</Label>
                <Input
                  id="total_tickets"
                  name="total_tickets"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.porcentaje_vendedor}
                  onChange={handleInputChange}
                  required
                />
            </div>
            <div className="py-4">
        
              <div className="space-y-2">
                <Label htmlFor="imagen">Imagen de la Rifa</Label>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {imagePreview ? (
                
                       <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-16 w-16 object-cover rounded"
                />
              
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Upload className="h-6 w-6 text-gray-500" />
                      </div>
                    )}
                    <Input
                      id="imagen"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  <span className="text-sm text-black">
                    {uploading ? "Subiendo..." : "Haz clic para cambiar la imagen"}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Describe los premios, condiciones, etc."
                />
              </div>
            </div>


          </section>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Actualizar Rifa
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}