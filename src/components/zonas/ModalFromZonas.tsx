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


export function ModalFromZonas() {

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const nombre = formData.get("nombre");
    const porcentaje_loteria = formData.get("porcentaje_loteria");
    const porcentaje_cliente = formData.get("porcentaje_cliente");
    const porcentaje_admin_zona = formData.get("porcentaje_admin_zona");
    const cuatroCifras = formData.get("cuatroCifras");
    const tresCifras = formData.get("tresCifras");
    const dosCifras = formData.get("dosCifras");
    const cuatroCombi = formData.get("cuatroCombi");
    const tresCombi = formData.get("tresCombi");

    if (
      
      nombre === "" ||
      porcentaje_loteria === "" ||
      porcentaje_cliente === "" ||
      porcentaje_admin_zona === "" ||
      cuatroCifras === "" ||
      tresCifras === "" ||
      dosCifras === "" ||
      cuatroCombi === "" ||
      tresCombi === ""
    ) {
      toast.error("Complete all fields");
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
        },
      ])
      .select();

    if (error) {
      console.error("Error inserting data:", error.message);
    } else {
      toast.success("zona Agregada Correctamente");
      e.target.reset();
      window.location.reload();
    }
  };

  return (
    <Dialog >
      <form>
        <DialogTrigger asChild>
         <button className="w-full flex items-center gap-x-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg  space-x-2 transition-colors cursor-pointer">
            <Plus className="w-4 h-4" />
            <p> <span className="hidden md:block">Nueva</span>zona</p>
         </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] md:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Crea un nuevo usuario</DialogTitle>
            <DialogDescription>
              <span>Crea un nuevo usuario para tu empresa.</span>
            </DialogDescription>
          </DialogHeader>
             <form className="text-white " onSubmit={handleSubmit}>
            <div className="hidden md:grid gap-4 grid-col-1 md:grid-cols-3">
              <div className="flex flex-col gap-y-2 text-black">
                <Label htmlFor="full_name">Nombre</Label>
                <Input  name="nombre" placeholder="Nombre Completo" required />
              </div>

              <div className="flex flex-col gap-y-2 text-black">
                <Label htmlFor="porcentaje_loteria">% loteria</Label>
                <Input name="porcentaje_loteria" placeholder="Porcentaje loteria" required  type="number" />
              </div>
              <div className="flex flex-col gap-y-2 text-black">
                <Label htmlFor="porcentaje_cliente">% cliente</Label>
                <Input name="porcentaje_cliente" placeholder="Porcentaje cliente" type="number" required  />
              </div>
              <div className="flex flex-col gap-y-2 text-black">
                <Label htmlFor="porcentaje_admin_zona">% admin zona</Label>
                <Input name="porcentaje_admin_zona" placeholder="Porcentaje admin zona" type="number" required />
              </div>
              <div className="flex flex-col gap-y-2 text-black">
                <Label htmlFor="cuatroCifras">Cuatro cifras</Label>
                <Input name="cuatroCifras" placeholder="Cuatro cifras" type="number" required />
              </div>
              <div className="flex flex-col gap-y-2 text-black">
                <Label htmlFor="tresCifras">Tres cifras</Label>
                <Input name="tresCifras" placeholder="Tres cifras" type="number" required />
              </div>
              <div className="flex flex-col gap-y-2 text-black">
                <Label htmlFor="dosCifras">Dos cifras</Label>
                <Input name="dosCifras" placeholder="Dos cifras" type="number" required />
              </div>
              <div className="flex flex-col gap-y-2 text-black">
                <Label htmlFor="cuatroCombi">Cuatro combi</Label>
                <Input name="cuatroCombi" placeholder="Cuatro combi" type="number" required />
              </div>
              <div className="flex flex-col gap-y-2 text-black">
                <Label htmlFor="tresCombi">Tres combi</Label>
                <Input name="tresCombi" placeholder="Tres combi" type="number" required />
                </div>

            </div>
            <div className="md:hidden">
             <div className="flex flex-col gap-y-2 text-black py-4">
                <Label htmlFor="full_name">Nombre</Label>
                <Input  name="nombre" placeholder="Nombre Completo" required />
              </div>

              <section className="grid grid-cols-2 gap-4">
               <div className="flex flex-col gap-y-2 text-black">
                <Label htmlFor="porcentaje_loteria">% loteria</Label>
                <Input name="porcentaje_loteria" placeholder="Porcentaje loteria" required  type="number" />
              </div>
              <div className="flex flex-col gap-y-2 text-black">
                <Label htmlFor="porcentaje_cliente">% cliente</Label>
                <Input name="porcentaje_cliente" placeholder="Porcentaje cliente" type="number" required  />
              </div>
              <div className="flex flex-col gap-y-2 text-black">
                <Label htmlFor="porcentaje_admin_zona">% admin zona</Label>
                <Input name="porcentaje_admin_zona" placeholder="Porcentaje admin zona" type="number" required />
              </div>
              <div className="flex flex-col gap-y-2 text-black">
                <Label htmlFor="cuatroCifras">Cuatro cifras</Label>
                <Input name="cuatroCifras" placeholder="Cuatro cifras" type="number" required />
              </div>
              <div className="flex flex-col gap-y-2 text-black">
                <Label htmlFor="tresCifras">Tres cifras</Label>
                <Input name="tresCifras" placeholder="Tres cifras" type="number" required />
              </div>
              <div className="flex flex-col gap-y-2 text-black">
                <Label htmlFor="dosCifras">Dos cifras</Label>
                <Input name="dosCifras" placeholder="Dos cifras" type="number" required />
              </div>
              <div className="flex flex-col gap-y-2 text-black">
                <Label htmlFor="cuatroCombi">Cuatro combi</Label>
                <Input name="cuatroCombi" placeholder="Cuatro combi" type="number" required />
              </div>
              <div className="flex flex-col gap-y-2 text-black">
                <Label htmlFor="tresCombi">Tres combi</Label>
                <Input name="tresCombi" placeholder="Tres combi" type="number" required />
                </div>
              </section>
            </div>
          <DialogFooter>
            <section className="w-full py-4 flex items-center justify-end gap-x-2">
            <DialogClose asChild>
              <button className="py-1.5 px-3 bg-red-500 text-white rounded-lg">Cancelar</button>
            </DialogClose>
            <Button type="submit" className="cursor-pointer">Guardar Cambios</Button>
            </section>
          </DialogFooter>
          </form>
        </DialogContent>
      </form>
    </Dialog>
  )
}
