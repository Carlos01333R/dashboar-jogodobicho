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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {Edit} from "lucide-react";
import useZonas from "@/hook/co/useZonas";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner" 
import { useState, useEffect } from "react"

interface Props {
  id: string;
  nombre: string;
  porcentaje_loteria: string;
  porcentaje_cliente: string;
  porcentaje_admin_zona: string;
  cuatroCifras: string;
  tresCifras: string;
  dosCifras: string;
  cuatroCombi: string;
  tresCombi: string;
}

export function ModalUpdateZonas({
  id,
  nombre,
  porcentaje_loteria,
  porcentaje_cliente,
  porcentaje_admin_zona,
  cuatroCifras,
  tresCifras,
  dosCifras,
  cuatroCombi,
  tresCombi,
  
}: Props) {
  const { zonas } = useZonas();
  const [Nombre, setNombre] = useState(nombre || "");
  const [Porcentaje_loteria, setPorcentaje_loteria] = useState(porcentaje_loteria || "");
  const [Porcentaje_cliente, setPorcentaje_cliente] = useState(porcentaje_cliente || "");
  const [Porcentaje_admin_zona, setPorcentaje_admin_zona] = useState(porcentaje_admin_zona || "");
  const [CuatroCifras, setCuatroCifras] = useState(cuatroCifras || "");
  const [TresCifras, setTresCifras] = useState(tresCifras || "");
  const [DosCifras, setDosCifras] = useState(dosCifras || "");
  const [CuatroCombi, setCuatroCombi] = useState(cuatroCombi || "");
  const [TresCombi, setTresCombi] = useState(tresCombi || "");



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      Nombre.length === 0
      || Porcentaje_loteria.length === 0
      || Porcentaje_cliente.length === 0
      || Porcentaje_admin_zona.length === 0
      || CuatroCifras.length === 0
      || TresCifras.length === 0
      || DosCifras.length === 0
      || CuatroCombi.length === 0
      || TresCombi.length === 0 
    ) {
      toast.error("Complete todos los campos");
      return;
    }
   

    const { data, error } = await supabase
      .from("zonas")
      .update({
        nombre: Nombre,
        porcentaje_loteria: Porcentaje_loteria,
        porcentaje_cliente: Porcentaje_cliente,
        porcentaje_admin_zona: Porcentaje_admin_zona,
        "4cifras": CuatroCifras,
        "3cifras": TresCifras,
        "2cifras": DosCifras,
        "4combi": CuatroCombi,
        "3combi": TresCombi,
      })
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error actualizando datos:", error.message);
      toast.error("Error al actualizar la zona");
    } else {
      toast.success("zona actualizado correctamente");
      window.location.reload();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1 cursor-pointer">
          <Edit className="w-4 h-4" />
          <span>Editar</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[500px] ">
        <DialogHeader>
          <DialogTitle>Editar zona {nombre}</DialogTitle>
          <DialogDescription>
            <span>Actualiza la información de la zona.</span>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 grid-col-1 md:grid-cols-3">
            <div className="flex flex-col gap-y-2 text-black ">
              <Label htmlFor="nombre">Nombre</Label>  
              <Input 
                name="nombre" 
                placeholder="Nombre Completo" 
                required 
                value={Nombre} 
                onChange={(e) => setNombre(e.target.value)} 
              />
            </div>
            <div className="flex flex-col gap-y-2 text-black ">
              <Label htmlFor="porcentaje_loteria">% loteria</Label>
              <Input 
                name="porcentaje_loteria" 
                placeholder="Porcentaje loteria" 
                required  
                type="number" 
                value={Porcentaje_loteria} 
                onChange={(e) => setPorcentaje_loteria(e.target.value)} 
              />
          </div>
          <div className="flex flex-col gap-y-2 text-black ">
            <Label htmlFor="porcentaje_cliente">% cliente</Label>
            <Input 
              name="porcentaje_cliente" 
              placeholder="Porcentaje cliente" 
              type="number" 
              required 
              value={Porcentaje_cliente} 
              onChange={(e) => setPorcentaje_cliente(e.target.value)} 
            />
          </div>
          <div className="flex flex-col gap-y-2 text-black ">
            <Label htmlFor="porcentaje_admin_zona">% admin zona</Label>
            <Input 
              name="porcentaje_admin_zona" 
              placeholder="Porcentaje admin zona" 
              type="number" 
              required 
              value={Porcentaje_admin_zona}
              onChange={(e) => setPorcentaje_admin_zona(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-y-2 text-black ">
            <Label htmlFor="cuatroCifras">Cuatro cifras</Label>
            <Input 
              name="cuatroCifras" 
              placeholder="Cuatro cifras" 
              type="number" 
              required 
              value={CuatroCifras} 
              onChange={(e) => setCuatroCifras(e.target.value)} 
            />
          </div>
          <div className="flex flex-col gap-y-2 text-black ">
            <Label htmlFor="tresCifras">Tres cifras</Label>
            <Input 
              name="tresCifras" 
              placeholder="Tres cifras" 
              type="number" 
              required 
              value={TresCifras} 
              onChange={(e) => setTresCifras(e.target.value)} 
            />
          </div>
          <div className="flex flex-col gap-y-2 text-black ">
            <Label htmlFor="dosCifras">Dos cifras</Label>
            <Input 
              name="dosCifras" 
              placeholder="Dos cifras" 
              type="number" 
              required 
              value={DosCifras} 
              onChange={(e) => setDosCifras(e.target.value)}
              
            />
          </div>
          <div className="flex flex-col gap-y-2 text-black ">
            <Label htmlFor="cuatroCombi">Cuatro combi</Label>
            <Input 
              name="cuatroCombi" 
              placeholder="Cuatro combi" 
              type="number" 
              required 
              value={CuatroCombi} 
              onChange={(e) => setCuatroCombi(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-y-2 text-black ">
            <Label htmlFor="tresCombi">Tres combi</Label>
            <Input 
              name="tresCombi" 
              placeholder="Tres combi" 
              type="number" 
              required 
              value={TresCombi} 
              onChange={(e) => setTresCombi(e.target.value)}
            />
            </div>
         </div>
          
          
          <DialogFooter>
            <section className="w-full py-4 flex items-center justify-end gap-x-2">
              <DialogClose asChild>
                <button 
                  type="button"
                  className="py-1.5 px-3 bg-red-500 text-white rounded-lg"
                >
                  Cancelar
                </button>
              </DialogClose>
              <Button type="submit" className="cursor-pointer">
                Guardar Cambios
              </Button>
            </section>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}