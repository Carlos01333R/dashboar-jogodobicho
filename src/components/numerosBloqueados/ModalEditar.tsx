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
  email: string;
  telefono: string;
  sector: string;
  password: string;
  estado: string;
  title: string;
  onSubmit: (form: {
    id: string;
    Nombre: string;
    Email: string;
    Telefono: string;
    Sector: string;
    Password: string;
    Estado: string;
  }) => void | Promise<void>;
}

export function ModalUpdate({
  id,
  nombre,
  email,
  telefono,
  sector,
  password,
  estado,
  onSubmit,
  title,
}: Props) {
  const { zonas } = useZonas();
  const [Nombre, setNombre] = useState(nombre);
  const [Email, setEmail] = useState(email);
  const [Telefono, setTelefono] = useState(telefono);
  const [Sector, setSector] = useState(sector);
  const [Password, setPassword] = useState(password);
  const [Estado, setEstado] = useState(estado === "true" ? "TRUE" : "FALSE");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      id,
      Nombre,
      Email,
      Telefono,
      Sector,
      Password,
      Estado,
    });
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
          <DialogTitle>Editar {title}</DialogTitle>
          <DialogDescription>
            <span>Actualiza la información del {title}.</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          {/* Inputs */}
          <div className="grid gap-4 grid-col-1 md:grid-cols-2">
            <div className="flex flex-col gap-y-2 text-black">
              <Label htmlFor="full_name">Nombre</Label>
              <Input value={Nombre} onChange={(e) => setNombre(e.target.value)} />
            </div>

            <div className="flex flex-col gap-y-2 text-black">
              <Label htmlFor="email">Email</Label>
              <Input value={Email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="flex flex-col gap-y-2 text-black">
              <Label htmlFor="password">Contraseña</Label>
              <Input type="password" value={Password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <div className="flex flex-col gap-y-2 text-black">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input value={Telefono} onChange={(e) => setTelefono(e.target.value)} />
            </div>

            <div className="flex flex-col gap-y-2 text-black">
              <Label htmlFor="sector">Sector</Label>
              <Select value={Sector} onValueChange={setSector}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione un sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Sector</SelectLabel>
                    {zonas.map((z: any) => (
                      <SelectItem value={z.nombre} key={z.id}>
                        {z.nombre}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-y-2 text-black">
              <Label htmlFor="estado">Estado</Label>
              <Select value={Estado} onValueChange={setEstado}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione un estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Estado</SelectLabel>
                    <SelectItem value="TRUE">Activo</SelectItem>
                    <SelectItem value="FALSE">Inactivo</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
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
