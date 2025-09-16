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
    const cuatroCifras1a5 = formData.get("cuatroCifras1a5");
    const tresCifras1a5 = formData.get("tresCifras1a5");
    const dosCifras1a5 = formData.get("dosCifras1a5");

    if (
      nombre === "" ||
      porcentaje_loteria === "" ||
      porcentaje_cliente === "" ||
      porcentaje_admin_zona === "" ||
      cuatroCifras === "" ||
      tresCifras === "" ||
      dosCifras === ""  
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
          "4combi": cuatroCombi,
          "3combi": tresCombi,
          pais: selectedCountry,
          "4cifras1a5": cuatroCifras1a5,
          "3cifras1a5": tresCifras1a5,
          "2cifras1a5": dosCifras1a5,
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
      <DialogContent className="sm:max-w-[425px] md:max-w-[500px]">
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
              <Label htmlFor="cuatroCifras">
                {isBrasil ? 'millar' : ' Cuatro cifras'}
              </Label>
              <Input name="cuatroCifras" placeholder="Cuatro cifras" type="number"  />
            </div>
            <div className="flex flex-col gap-y-2 text-black">
              <Label htmlFor="tresCifras">
                {isBrasil ? 'Centena' : ' Tres cifras'}
              </Label>
              <Input name="tresCifras" placeholder="Tres cifras" type="number"  />
            </div>

            <div className="flex flex-col gap-y-2 text-black">
              <Label htmlFor="dosCifras">
                {isBrasil ? 'Decena' : ' Dos cifras'}
              </Label>
              <Input name="dosCifras" placeholder="Dos cifras" type="number"  />
            </div>

            {isBrasil && (
              <>
                <div className="flex flex-col gap-y-2 text-black">
                  <Label htmlFor="cuatroCifras1a5">
                  millar1a5
                  </Label>
                  <Input name="cuatroCifras1a5" placeholder="Cuatro cifras" type="number"  />
                </div>
                <div className="flex flex-col gap-y-2 text-black">
                  <Label htmlFor="tresCifras1a5">
                   Centena1a5
                  </Label>
                  <Input name="tresCifras1a5" placeholder="Tres cifras" type="number"  />
                </div>
                <div className="flex flex-col gap-y-2 text-black">
                  <Label htmlFor="dosCifras1a5">
                    Decena1a5
                  </Label>
                  <Input name="dosCifras1a5" placeholder="Dos cifras" type="number"  />
                </div>
              </>
            )}


            {!isBrasil && (
              <>
                <div className="flex flex-col gap-y-2 text-black">
                  <Label htmlFor="cuatroCombi">Cuatro combi</Label>
                  <Input name="cuatroCombi" placeholder="Cuatro combi" type="number"  />
                </div>
                <div className="flex flex-col gap-y-2 text-black">
                  <Label htmlFor="tresCombi">Tres combi</Label>
                  <Input name="tresCombi" placeholder="Tres combi" type="number"  />
                </div>
              </>
            )}
          </div>
          
          <div className="md:hidden grid gap-4">
            <div className="flex flex-col gap-y-2 text-black">
              <Label htmlFor="nombre_mobile">Nombre</Label>
              <Input name="nombre" placeholder="Nombre Completo"  />
            </div>

            <div className="flex flex-col gap-y-2 text-black">
              <Label htmlFor="porcentaje_loteria_mobile">% Casa</Label>
              <Input name="porcentaje_loteria" placeholder="Porcentaje loteria"  type="number" />
            </div>
            <div className="flex flex-col gap-y-2 text-black">
              <Label htmlFor="porcentaje_cliente_mobile">% Vendedor</Label>
              <Input name="porcentaje_cliente" placeholder="Porcentaje cliente" type="number"  />
            </div>
            <div className="flex flex-col gap-y-2 text-black">
              <Label htmlFor="porcentaje_admin_zona_mobile">% admin zona</Label>
              <Input name="porcentaje_admin_zona" placeholder="Porcentaje admin zona" type="number"  />
            </div>
            <div className="flex flex-col gap-y-2 text-black">
              <Label htmlFor="cuatroCifras_mobile">
                {isBrasil ? 'Premio 1a5' : ' Cuatro cifras'}
              </Label>
              <Input name="cuatroCifras" placeholder="Cuatro cifras" type="number"  />
            </div>
            <div className="flex flex-col gap-y-2 text-black">
              <Label htmlFor="tresCifras_mobile">
                {isBrasil ? 'Centena' : ' Tres cifras'}
              </Label>
              <Input name="tresCifras" placeholder="Tres cifras" type="number"  />
            </div>
            <div className="flex flex-col gap-y-2 text-black">
              <Label htmlFor="dosCifras_mobile">
                {isBrasil ? 'decena' : ' Dos cifras'}
              </Label>
              <Input name="dosCifras" placeholder="Dos cifras" type="number"  />
            </div>

            {isBrasil && (
              <>
                <div className="flex flex-col gap-y-2 text-black">
                  <Label htmlFor="cuatroCifras1a5_mobile">
                    {isBrasil ? 'Premio 1a5' : ' Cuatro cifras'}
                  </Label>
                  <Input name="cuatroCifras1a5" placeholder="Cuatro cifras" type="number"  />
                </div>
                <div className="flex flex-col gap-y-2 text-black">
                  <Label htmlFor="tresCifras1a5_mobile">
                    {isBrasil ? 'Decena' : ' Tres cifras'}
                  </Label>
                  <Input name="tresCifras1a5" placeholder="Tres cifras" type="number"  />
                </div>
                <div className="flex flex-col gap-y-2 text-black">
                  <Label htmlFor="dosCifras1a5_mobile">
                    {isBrasil ? 'Centena' : ' Dos cifras'}
                  </Label>
                  <Input name="dosCifras1a5" placeholder="Dos cifras" type="number"  />
                </div>
              </>
            )}
            {!isBrasil && (
              <>
                <div className="flex flex-col gap-y-2 text-black">
                  <Label htmlFor="cuatroCombi_mobile">Cuatro combi</Label>
                  <Input name="cuatroCombi" placeholder="Cuatro combi" type="number"  />
                </div>
                <div className="flex flex-col gap-y-2 text-black">
                  <Label htmlFor="tresCombi_mobile">Tres combi</Label>
                  <Input name="tresCombi" placeholder="Tres combi" type="number"  />
                </div>
              </>
            )}
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