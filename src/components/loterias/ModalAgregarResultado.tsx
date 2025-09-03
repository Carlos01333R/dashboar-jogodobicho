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
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import loteriasData from "@/data/loterias.json"

import {PencilIcon, Plus} from "lucide-react";
import { useState } from "react"
export function ModalFromResultado() {
 
    const [selectedSector, setSelectedSector] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const resultado = formData.get("resultado");
    const fecha = formData.get("fecha");

    if (selectedSector == "" || resultado === "" || fecha === "") {
      toast.error("Complete all fields");
      return;
    }

    const { data, error } = await supabase
      .from("resultados_loteria")
      .insert([
        {
          lottery: selectedSector,
          result: resultado,
          date: fecha,
        },
      ])
      .select();

    if (error) {
      console.error("Error inserting data:", error.message);
    } else {
    
      toast.success("Resultado Agregado Correctamente");
      e.target.reset();
      window.location.reload();
    }
  };
  return (
    <Dialog >
      <form>
        <DialogTrigger asChild>
         <button className="flex items-center gap-x-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg  space-x-2 transition-colors cursor-pointer">
            <Plus className="w-4 h-4" />
            <p> <span className="hidden md:block">Nuevo resultado</span></p>
         </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] md:max-w-[500px]">
          <DialogHeader>
           <p className="text-center font-bold">Ingrese el numero de la lotería y el resultado</p>
           
          </DialogHeader>
           
        <section>
            <form className="text-white " onSubmit={handleSubmit}>
                  <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <select
                      name="loteria"
                      className="text-black focus:border-primary rounded-xl text-sm "
                      value={selectedSector} // Usé loteriaState aquí
                      onChange={(e) => {
                        setSelectedSector(e.target.value);
                      }}
                    >
                      <option value="" disabled>
                        Seleccione una lotería
                      </option>
                      {Array.isArray(loteriasData.loterias) &&
                        loteriasData.loterias.map((loteria, index) => (
                          <option key={index} value={loteria.name}>
                            {loteria.name}
                          </option>
                        ))}
                    </select>

              <Input
                className="text-black focus:border-primary"
                name="resultado"
                placeholder="Resultado de la lotería"
                type="text" // Cambiado a text para mejor control
                inputMode="numeric" // Muestra teclado numérico en móviles
                pattern="[0-9]{0,4}" // Solo permite 0-4 dígitos
                maxLength={4} // Máximo 4 caracteres
               
/>

                    <Input
                      className="text-black focus:border-primary "
                    
                      name="fecha" // Correcto
                      placeholder="Fecha de la lotería"
                      type="date"
                    />
                  </section>

                  <div className="w-full flex justify-center items-center mt-3 ">
                    <Button
                      type="submit"
                      className="bg-emerald-500 text-white hover:bg-emerald-600 flex items-center gap-2"
                    >
                      Agregar Resultado
                      <PencilIcon />
                    </Button>
                  </div>
                </form>
        </section>
        </DialogContent>
      </form>
    </Dialog>
  )
}
