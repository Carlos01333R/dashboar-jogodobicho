"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Upload, Plus, Loader2, AlertCircle, RefreshCw } from "lucide-react"
import { useLoterias } from "@/hook/br/use-loterias"
import { toast } from "sonner";
import { supabase } from "@/lib/supabase"

interface CrearRifaFormProps {
  onSuccess?: () => void
}

export function CrearRifaForm({ onSuccess }: CrearRifaFormProps) {
   const { loterias, loading: loteriasLoading, refetch, error } = useLoterias()
  const [loading, setLoading] = useState(false)
  const [numeroInput, setNumeroInput] = useState("")

  const [formData, setFormData] = useState({
    nombre: "",
    fecha: "",
    hora: "",
    loteria: "",
    numero_minimo: 1,
    numero_maximo: 9999,
    valor_ticket: "",
    descripcion: "",
    foto_url: "",
    porcentaje_vendedor: 0,
  })

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

   const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
    
      const fileExt = file.name.split(".").pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `rifas/${fileName}`

      const { data, error } = await supabase.storage
        .from("rifas-images")
        .upload(filePath, file)

        if (error) throw error

        // 🔑 Obtener la URL pública
        const { data: publicUrlData } = supabase.storage
        .from("rifas-images")
        .getPublicUrl(filePath)

        handleInputChange("foto_url", publicUrlData.publicUrl)

        toast.success("Imagen cargada", {
        description: "La imagen se ha cargado correctamente",
        })

    } catch (error) {
      console.error("Error uploading image:", error)
     
      toast.error("Error cargando imagen", {
        description: "No se pudo cargar la imagen. Intente nuevamente.",
      })
    }
  }

  // Función para ajustar la fecha a la zona horaria de Brasil (UTC-3)
const ajustarFechaBrasil = (fecha: string, hora: string): { fechaAjustada: string, horaAjustada: string } => {
  if (!fecha || !hora) return { fechaAjustada: fecha, horaAjustada: hora };
  
  // Crear objeto Date con la fecha y hora seleccionadas
  const fechaHoraLocal = new Date(`${fecha}T${hora}:00`);
  
  // Ajustar para la zona horaria de Brasil (UTC-3)
  const offsetBrasil = -3; // UTC-3 para Brasil
  const utc = fechaHoraLocal.getTime() + (fechaHoraLocal.getTimezoneOffset() * 60000);
  const fechaHoraBrasil = new Date(utc + (3600000 * offsetBrasil));
  
  // Extraer fecha y hora por separado
  const ano = fechaHoraBrasil.getFullYear();
  const mes = String(fechaHoraBrasil.getMonth() + 1).padStart(2, '0');
  const dia = String(fechaHoraBrasil.getDate()).padStart(2, '0');
  const horas = String(fechaHoraBrasil.getHours()).padStart(2, '0');
  const minutos = String(fechaHoraBrasil.getMinutes()).padStart(2, '0');
  
  return {
    fechaAjustada: `${ano}-${mes}-${dia}`,
    horaAjustada: `${horas}:${minutos}`
  };
};


  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)

  try {
    // Ajustar antes de enviar
    const { fechaAjustada, horaAjustada } = ajustarFechaBrasil(formData.fecha, formData.hora);

    const rifaData = {
      nombre: formData.nombre,
      fecha: fechaAjustada,      // 👈 usar la fecha ajustada
      hora: horaAjustada,        // 👈 usar la hora ajustada
      loteria: formData.loteria,
      numero_minimo: formData.numero_minimo,
      numero_maximo: formData.numero_maximo,
      valor_ticket: Number.parseFloat(formData.valor_ticket),
      descripcion: formData.descripcion,
      foto_url: formData.foto_url,
      tickets_vendidos: 0,
      estado: "activa",
      porcentaje_vendedor: formData.porcentaje_vendedor,
    };

    const { data, error } = await supabase.from("rifas").insert([rifaData]).select()

    if (error) throw error

    toast.success("Rifa creada", {
      description: "La rifa se ha creado exitosamente",
    });

    // Reset formulario
    setFormData({
      nombre: "",
      fecha: "",
      hora: "",
      loteria: "",
      numero_minimo: 1,
      numero_maximo: 9999,
      valor_ticket: "",
      descripcion: "",
      foto_url: "",
      porcentaje_vendedor: 0,
    });

    onSuccess?.()
  } catch (error) {
    console.error("Error creando rifa:", error)
    toast.error("Error", {
      description: "No se pudo crear la rifa. Intente nuevamente.",
    });
  } finally {
    setLoading(false)
  }
}

  if (loteriasLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
      
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Cargando loterias..</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
      
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <p className="text-destructive mb-4">Error al cargar las loterias: {error}</p>
          <Button onClick={refetch} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Tentar nuevamente
          </Button>
        </div>
      </div>
    )
  }
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Crear Nueva Rifa</CardTitle>
        <CardDescription>Complete la información para crear una nueva rifa</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre de la Rifa</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => handleInputChange("nombre", e.target.value)}
                placeholder="Ej: Rifa del Día de la Madre"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor_ticket">Valor del Ticket ($)</Label>
              <Input
                id="valor_ticket"
                type="number"
                step="0.01"
                min="0"
                value={formData.valor_ticket}
                onChange={(e) => handleInputChange("valor_ticket", e.target.value)}
                placeholder="1000"
                required
              />
            </div>
          </div>

          {/* Fecha y hora */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fecha">Fecha del Sorteo</Label>
              <Input
                id="fecha"
                type="date"
                value={formData.fecha}
                onChange={(e) => handleInputChange("fecha", e.target.value)}
                required
              />
            </div>

         
            <div className="space-y-2">
              <Label htmlFor="hora">Hora del Sorteo</Label>
              <Input
                id="hora"
                type="time"
                value={formData.hora}
                onChange={(e) => handleInputChange("hora", e.target.value)}
                required
              />
            </div>
          </div>
       

          {/* Lotería */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
<div className="space-y-2">
  <Label htmlFor="loteria">Lotería</Label>
  <select
    id="loteria"
    value={formData.loteria}
    onChange={(e) => handleInputChange("loteria", e.target.value)}
    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    required
  >
    <option value="">Seleccione una lotería</option>
    {loterias.map((loteria: any) => (
      <option key={loteria.id} value={loteria.id}>
        {loteria.name} ({loteria.id})
      </option>
    ))}
  </select>
</div>
          <div className="space-y-2">
            <Label htmlFor="porcentaje_vendedor">Porcentaje Vendedor</Label>
            <Input
              id="porcentaje_vendedor"
              type="number"
              min="0"
              max="100"
              value={formData.porcentaje_vendedor}
              onChange={(e) => handleInputChange("porcentaje_vendedor", Number.parseInt(e.target.value))}
              required 
              />
          </div>
              </section>

          {/* Rango de números */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numero_minimo">Número Mínimo</Label>
              <Input
                id="numero_minimo"
                type="number"
                min="3"
                value={formData.numero_minimo}
                onChange={(e) => handleInputChange("numero_minimo", Number.parseInt(e.target.value))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numero_maximo">Número Máximo</Label>
              <Input
                id="numero_maximo"
                type="number"
                min="1"
                value={formData.numero_maximo}
                onChange={(e) => handleInputChange("numero_maximo", Number.parseInt(e.target.value))}
                required
              />
            </div>
          </div>

     

          {/* Imagen */}
          <div className="space-y-2">
            <Label htmlFor="foto">Imagen de la Rifa</Label>
            <div className="flex items-center gap-4">
              <Input id="foto" type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              <Button type="button" variant="outline" onClick={() => document.getElementById("foto")?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                Subir Imagen
              </Button>
            {formData.foto_url && (
                <img
                    src={formData.foto_url}
                    alt="Preview"
                    className="h-16 w-16 object-cover rounded"
                />
                )}

            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción (Opcional)</Label>
            <Textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => handleInputChange("descripcion", e.target.value)}
              placeholder="Descripción adicional de la rifa..."
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creando Rifa..." : "Crear Rifa"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
