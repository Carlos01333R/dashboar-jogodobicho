"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PenTool, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import { Input } from "../ui/input"
import { Card, CardContent } from "../ui/card"
import { PencilIcon } from "lucide-react";

interface Props {
  onSave: () => void
  loteria: any
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function ModalEditarResultado({ loteria, onSave, isOpen, onOpenChange }: Props) {
 const [idLotery, setIdUser] = useState("");
    const [Nombre, setNombre] = useState("");
    const [Resultado, setResultado] = useState("");
    const [fecha, setFecha] = useState("");

    // Efecto para actualizar los estados cuando cambia la prop 'loteria'
    useEffect(() => {
        if (loteria) {
            setIdUser(loteria.id);
            setNombre(loteria.lottery);
            setResultado(loteria.result);
            setFecha(loteria.date);
        }
    }, [loteria]); // Se ejecuta cuando 'loteria' cambia

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!Nombre || !Resultado || !fecha) {
            toast.error("Complete todos los campos");
            return;
        }

        try {
            const { error } = await supabase
                .from("resultados_loteria")
                .update({
                    lottery: Nombre,
                    result: Resultado,
                    date: fecha,
                })
                .eq("id", idLotery);

            if (error) {
                throw error;
            }

            toast.success("Resultado actualizado correctamente");
            onSave(); // Llama a la función onSave del padre
            onOpenChange(false); // Cierra el modal
        } catch (error: any) {
            console.error("Error updating data:", error.message);
            toast.error("Error al actualizar los datos");
        }
    };


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
       
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="text-center">Editar Lotería <span className="text-center text-emerald-700 font-bold">{Nombre}</span></DialogTitle>
        </DialogHeader>
  
      
          <form className="text-white" onSubmit={handleSubmit}>
                <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    name="resultado"
                    placeholder="Resultado de la lotería"
                    type="text"
                    className="text-black"
                    value={Resultado}
                    onChange={(e) => setResultado(e.target.value)}
                  />
                  <Input
                    name="fecha"
                    placeholder="Fecha de la lotería"
                    type="date"
                    className="text-black"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                  />
                </section>

                <div className="w-full flex justify-center items-center mt-3">
                  <Button
                    type="submit"
                    className="bg-emerald-500 text-white hover:bg-emerald-600 flex items-center gap-2"
                    
                  >
                    Editar Resultado
                    <PencilIcon />
                  </Button>
                </div>
              </form>
        <DialogFooter>
          <section className="w-full flex items-center justify-center gap-x-2">
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
         
          </section>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
