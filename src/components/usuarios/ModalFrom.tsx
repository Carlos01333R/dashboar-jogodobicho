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
import { Plus } from "lucide-react"
import useZonas from "@/hook/co/useZonas"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

interface Props {
  onSubmit: (e: React.FormEvent) => void,
  title: string,
}

export function ModalFrom({ onSubmit, title }: Props) {
  const { zonas } = useZonas()
   const [open, setOpen] = useState(false)
    const pathname = usePathname()

     useEffect(() => {
    setOpen(false)
  }, [pathname])

  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-x-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg space-x-2 transition-colors cursor-pointer">
          <Plus className="w-4 h-4" />
          <p><span className="hidden md:block">Nuevo</span> {title}</p>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Crea un nuevo {title}</DialogTitle>
          <DialogDescription>
            <span>Crea un nuevo usuario para tu empresa.</span>
          </DialogDescription>
        </DialogHeader>
        <form className="text-white" onSubmit={onSubmit}>
          <div className="grid gap-4 grid-col-1 md:grid-cols-2">
            <div className="flex flex-col gap-y-2 text-black">
              <Label htmlFor="full_name">Nombre</Label>
              <Input name="nombre" placeholder="Nombre Completo" required />
            </div>
            <div className="flex flex-col gap-y-2 text-black">
              <Label htmlFor="email">Email</Label>
              <Input name="email" placeholder="Email" required />
            </div>
            <div className="flex flex-col gap-y-2 text-black">
              <Label htmlFor="password">Contraseña</Label>
              <Input name="password" type="text" placeholder="Contraseña" required />
            </div>
            <div className="flex flex-col gap-y-2 text-black">
              <Label htmlFor="confirm_password">Confirma tu contraseña</Label>
              <Input name="confirm_password" type="text" placeholder="Confirma tu contraseña" required />
            </div>
            <div className="flex flex-col gap-y-2 text-black">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input name="telefono" placeholder="Teléfono" required />
            </div>
          <div className="flex flex-col gap-y-2 text-black">
          <label htmlFor="sector" className="text-sm font-medium">
            Sector
          </label>
          <select
            id="sector"
            name="sector"
            required
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
          >
            <option value="">Seleccione un sector</option>
            {zonas.map((sector: any) => (
              <option value={sector.nombre} key={sector.id}>
                {sector.nombre}
              </option>
            ))}
          </select>
        </div>

          </div>
          <DialogFooter>
            <section className="w-full py-4 flex items-center justify-end gap-x-2">
              <DialogClose asChild>
                <Button type="button" variant="destructive">
                  Cancelar
                </Button>
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