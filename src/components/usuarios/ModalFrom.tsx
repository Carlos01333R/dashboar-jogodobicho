import { useEffect } from "react";
import useZonas from "@/hook/co/useZonas"
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface Props {
  onSubmit: (e: React.FormEvent) => void;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalFrom({ onSubmit, title, isOpen, onClose }: Props) {
  const { zonas } = useZonas();
  const pathname = usePathname();

  useEffect(() => {
    onClose();
  }, [pathname]);

  if (!isOpen) return null; // 👈 solo se muestra si isOpen = true

  return (
    <div
      className="fixed z-40 inset-0 flex justify-center items-center backdrop-blur-sm bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-6 relative z-30 sm:max-w-[725px] max-h-[90vh] flex-col overflow-y-scroll"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-center text-xl font-bold py-4">{title}</p>

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
              <Input
                name="confirm_password"
                type="text"
                placeholder="Confirma tu contraseña"
                required
              />
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

          <section className="w-full py-4 flex items-center justify-end gap-x-2 ">
            <Button onClick={onClose} type="button" variant="destructive">
              Cancelar
            </Button>

            <Button type="submit" className="cursor-pointer">
              Guardar Cambios
            </Button>
          </section>
        </form>
      </div>
    </div>
  );
}
