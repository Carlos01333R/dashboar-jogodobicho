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
import { Edit } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner" 
import { useState } from "react"

interface Props {
  id: string;
  numeroState: number;
  razon: string;
  title: string;
  onSubmit: (form: {
    id: string;
    Numero: number;
    RazonNumero: string;
  }) => void | Promise<void>;
}

export function ModalUpdateNumerosBloqueados({
  id,
  numeroState,
  razon,
  onSubmit,
  title,
}: Props) {
  const [Numero, setNumero] = useState(numeroState);
  const [RazonNumero, setRazonNumero] = useState(razon);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica
    if (!Numero || !RazonNumero) {
      toast.error("Complete todos los campos");
      return;
    }
    
    await onSubmit({
      id,
      Numero,
      RazonNumero,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1">
          <Edit className="w-4 h-4" />
          <span>Editar</span>
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] md:max-w-[500px] ">
        <DialogHeader>
          <DialogTitle>Editar {title}</DialogTitle>
          <DialogDescription>
            <span>Actualiza la información del {title}.</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 grid-col-1 md:grid-cols-2">
            <div className="flex flex-col gap-y-2 text-black">
              <Label htmlFor="numero">Número</Label>
              <Input 
                id="numero"
                type="number" 
                value={Numero} 
                onChange={(e) => setNumero(Number(e.target.value))} 
              />
            </div>

            <div className="flex flex-col gap-y-2 text-black">
              <Label htmlFor="razon">Razón</Label>
              <Input 
                id="razon"
                value={RazonNumero} 
                onChange={(e) => setRazonNumero(e.target.value)} 
              />
            </div>
          </div>

          <DialogFooter>
            <section className="w-full py-4 flex items-center justify-end gap-x-2">
              <DialogClose asChild>
                <button type="button" className="py-1.5 px-3 bg-red-500 text-white rounded-lg">
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
  );
}
