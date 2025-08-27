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
import {Ban} from "lucide-react";

interface Props {
  onSubmit: (e: React.FormEvent) => void,
}
export function ModalFromNumerosBloqueados({ onSubmit }: Props) {
  return (
    <Dialog >
      <form>
        <DialogTrigger asChild>
         <button 
                    
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors cursor-pointer"
                  >
                    <Ban className="w-4 h-4" />
                    <span>Bloquear Número</span>
                  </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] md:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Bloquear Número</DialogTitle>
            <DialogDescription>
              <span>Bloquea un numero para todas las zonas </span>
            </DialogDescription>
          </DialogHeader>
             <form className="text-white " onSubmit={onSubmit}>
          <div className="grid gap-4 grid-col-1 md:grid-cols-2">
            <div className="flex flex-col gap-y-2 text-black">
              <Label htmlFor="numero">Numero</Label>
              <Input  name="Numero" placeholder="Número" required />
            </div>
            <div className="flex flex-col gap-y-2 text-black">
              <Label htmlFor="razon">Razon</Label>
              <Input name="razon" placeholder="Razon del bloqueo" required />
            </div>
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
