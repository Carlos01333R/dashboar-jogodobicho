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

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {Plus} from "lucide-react";
import useZonas from "@/hook/co/useZonas";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner" 
import { useAuth } from "@/context/AuthContext";
import { is } from "date-fns/locale";
import { useState } from "react";


export function ModalFromZonas() {
  const [open, setOpen] = useState(false);
  const { selectedCountry } = useAuth();
    
  const isBrasil = selectedCountry === 'brazil';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const nombre = formData.get("nombre");
    const porcentaje_loteria = formData.get("porcentaje_loteria");
    const porcentaje_cliente = formData.get("porcentaje_cliente");
    const porcentaje_admin_zona = formData.get("porcentaje_admin_zona");
    const cuatroCifras = formData.get("cuatroCifras");
    const tresCifras = formData.get("tresCifras");
    const dosCifras = formData.get("dosCifras");
    const cuatroCombi = formData.get("cuatroCombi");
    const tresCombi = formData.get("tresCombi");
    const milla = formData.get("milla");
    const centena = formData.get("centena");
    const decena = formData.get("decena");
    const millar1a5 = formData.get("millar1a5");
    const centena1a5 = formData.get("centena1a5");
    const decena1a5 = formData.get("decena1a5");

    if (
      nombre === "" ||
      porcentaje_loteria === "" ||
      porcentaje_cliente === "" ||
      porcentaje_admin_zona === "" ||
      cuatroCifras === "" ||
      tresCifras === "" ||
      dosCifras === "" ||
      milla === "" ||
      centena === "" ||
      decena === "" ||
      millar1a5 === "" ||
      centena1a5 === "" ||  
      decena1a5 === ""
    ) {
      toast.error("Complete todos los campos");
      return;
    }

    const { data, error } = await supabase
      .from("zonas")
      .insert([
        {
          nombre: nombre,
          porcentaje_loteria: porcentaje_loteria,
          porcentaje_cliente: porcentaje_cliente,
          porcentaje_admin_zona: porcentaje_admin_zona,
          "4cifras": cuatroCifras,
          "3cifras": tresCifras,
          "2cifras": dosCifras,
          "3combi": tresCombi,
          "4combi": cuatroCombi,
          "milla": milla,
          "centena": centena,
          "decena": decena,
          "millar1a5": millar1a5,
          "centena1a5": centena1a5,
          "decena1a5": decena1a5,
        },
      ])
      .select();

    if (error) {
      console.error("Error inserting data:", error.message);
      toast.error("Error al crear la zona");
    } else {
      toast.success("Zona agregada correctamente");
     setTimeout(() => window.location.reload(), 1000);
      setOpen(false);
      e.currentTarget.reset();
  
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="w-full flex items-center gap-x-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg space-x-2 transition-colors cursor-pointer">
          <Plus className="w-4 h-4" />
          <p><span className="hidden md:block">Nueva</span>zona</p>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[500px] max-h-[90vh] overflow-scroll">
        <DialogHeader>
          <DialogTitle className="">Crear una nueva zona</DialogTitle>
          <DialogDescription>
            <span>Crea una nueva zona para tu empresa.</span>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="hidden md:grid gap-4 grid-col-1 md:grid-cols-3">
            <div className="flex flex-col gap-y-2 text-black">
              <Label htmlFor="nombre">Nombre</Label>
              <Input name="nombre" placeholder="Nombre Completo"  />
            </div>

            <div className="flex flex-col gap-y-2 text-black">
              <Label htmlFor="porcentaje_loteria">% Casa</Label>
              <Input name="porcentaje_loteria" placeholder="Porcentaje loteria"  type="number" />
            </div>
            <div className="flex flex-col gap-y-2 text-black">
              <Label htmlFor="porcentaje_cliente">% Vendedor</Label>
              <Input name="porcentaje_cliente" placeholder="Porcentaje cliente" type="number"  />
            </div>
            <div className="flex flex-col gap-y-2 text-black">
              <Label htmlFor="porcentaje_admin_zona">% admin zona</Label>
              <Input name="porcentaje_admin_zona" placeholder="Porcentaje admin zona" type="number"  />
            </div>
            <div className="flex flex-col gap-y-2 text-black">
              <Label htmlFor="milla">
               millar
              </Label>
              <Input name="milla" placeholder="millar" type="number"  />
            </div>
            <div className="flex flex-col gap-y-2 text-black">
              <Label htmlFor="centena">
               Centena
              </Label>
              <Input name="centena" placeholder="Centena" type="number"  />
            </div>

            <div className="flex flex-col gap-y-2 text-black">
              <Label htmlFor="decena">
               Decena
              </Label>
              <Input name="decena" placeholder="Decena" type="number"  />
            </div>

           
                <div className="flex flex-col gap-y-2 text-black">
                  <Label htmlFor="millar1a5">
                  millar1a5
                  </Label>
                  <Input name="millar1a5" placeholder="millar1a5" type="number"  />
                </div>
                <div className="flex flex-col gap-y-2 text-black">
                  <Label htmlFor="centena1a5">
                   Centena1a5
                  </Label>
                  <Input name="centena1a5" placeholder="Centena1a5" type="number"  />
                </div>
                <div className="flex flex-col gap-y-2 text-black">
                  <Label htmlFor="decena1a5">
                    Decena1a5
                  </Label>
                  <Input name="decena1a5" placeholder="Decena1a5" type="number"  />
                </div>
           
              

          
            
          </div>

          <div className="flex justify-center items-center gap-y-2 text-black py-4">
           <p className="font-bold ">Datos de modalidades de colombia</p>
          </div>
        

          <div className="hidden md:grid gap-4 grid-col-1 md:grid-cols-3">
               <div className="flex flex-col gap-y-2 text-black">
                  <Label htmlFor="cuatroCifras">4 cifras</Label>
                  <Input name="cuatroCifras" placeholder="Cuatro cifras" type="number"  />
                </div>
                <div className="flex flex-col gap-y-2 text-black">
                  <Label htmlFor="tresCifras">3 cifras</Label>
                  <Input name="tresCifras" placeholder="Tres cifras" type="number"  />
                </div>

                <div className="flex flex-col gap-y-2 text-black">  
                  <Label htmlFor="dosCifras">2 cifras</Label>
                  <Input name="dosCifras" placeholder="Dos cifras" type="number"  /> 
                </div>

                <div className="flex flex-col gap-y-2 text-black">
                  <Label htmlFor="cuatroCombi">Cuatro combi</Label>
                  <Input name="cuatroCombi" placeholder="Cuatro combi" type="number"  />
                </div>

                <div className="flex flex-col gap-y-2 text-black">  
                  <Label htmlFor="tresCombi">Tres combi</Label>
                  <Input name="tresCombi" placeholder="Tres combi" type="number"  />
                  </div>
                
                
          </div>

          
          
          <DialogFooter className="mt-4">
            <div className="w-full flex items-center justify-end gap-x-2">
              <DialogClose asChild>
                <Button type="button" variant="destructive">Cancelar</Button>
              </DialogClose>
              <Button type="submit">Guardar Cambios</Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}