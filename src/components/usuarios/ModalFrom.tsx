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
import {Plus} from "lucide-react";
import useZonas from "@/hook/co/useZonas";

interface Props {
  onSubmit: (e: React.FormEvent) => void,
  title: string,
}
export function ModalFrom({ onSubmit, title }: Props) {
    const { zonas } = useZonas();
  return (
    <Dialog >
      <form>
        <DialogTrigger asChild>
         <button className="flex items-center gap-x-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg  space-x-2 transition-colors cursor-pointer">
            <Plus className="w-4 h-4" />
            <p> <span className="hidden md:block">Nuevo</span> {title}</p>
         </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] md:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Crea un nuevo {title}</DialogTitle>
            <DialogDescription>
              <span>Crea un nuevo usuario para tu empresa.</span>
            </DialogDescription>
          </DialogHeader>
             <form className="text-white " onSubmit={onSubmit}>
          <div className="grid gap-4 grid-col-1 md:grid-cols-2">
            <div className="flex flex-col gap-y-2 text-black">
              <Label htmlFor="full_name">Nombre</Label>
              <Input  name="nombre" placeholder="Nombre Completo" required />
            </div>
            <div className="flex flex-col gap-y-2 text-black">
              <Label htmlFor="email">Email</Label>
              <Input name="email" placeholder="Email" required />
            </div>
             <div className="flex flex-col gap-y-2 text-black">
              <Label htmlFor="password">Contraseña</Label>
              <Input  name="password" type="password" placeholder="Contraseña" required />
            </div>
            <div className="flex flex-col gap-y-2 text-black">
              <Label htmlFor="confirm_password">Confirma tu contraseña</Label>
              <Input name="confirm_password" type="password" placeholder="Confirma tu contraseña" required />
             
            </div>

    
            <div className="flex flex-col gap-y-2 text-black">
              <Label htmlFor="telefono">telefono</Label>
              <Input  name="telefono" placeholder="telefono" required />
            </div>
            <div className="flex flex-col gap-y-2 text-black">
            <Label htmlFor="telefono">sector</Label>
             <Select name="sector" required>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Seleccione un sector" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                <SelectLabel>Sector</SelectLabel>
                {zonas.map((sector: any) => (
                  <SelectItem value={sector.nombre} key={sector.id} > 
                    {sector.nombre}
                  </SelectItem>
                ))}
                </SelectGroup>
            </SelectContent>
            </Select>
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
