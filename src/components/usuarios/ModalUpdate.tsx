import { useState } from "react";
import useZonas from "@/hook/co/useZonas";
import { DollarSign } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

interface Props {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  sector: string;
  password: string;
  estado: string;
  title: string;
  isOpen: boolean; // 👈 ahora se controla desde afuera
  onClose: () => void; // 👈 cerrar desde afuera
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

export default function ModalUpdate({
  id,
  nombre,
  email,
  telefono,
  sector,
  password,
  estado,
  onSubmit,
  title,
  isOpen,
  onClose
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
    await onSubmit({ id, Nombre, Email, Telefono, Sector, Password, Estado });
    onClose(); // cerrar modal al guardar
  };

  if (!isOpen) return null; // 👈 no renderiza nada si no está abierta

  return (
    <div
      className="fixed z-40 inset-0 flex justify-center items-center backdrop-blur-sm bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-6 relative z-50 sm:max-w-[725px] max-h-[90vh] overflow-y-scroll"
        onClick={(e) => e.stopPropagation()} // evita cerrar al hacer click dentro
      >
        <p className="text-center py-4 font-bold">Editar {title}</p>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-y-2 text-black">
              <Label>Nombre</Label>
              <Input value={Nombre} onChange={(e) => setNombre(e.target.value)} />
            </div>

            <div className="flex flex-col gap-y-2 text-black">
              <Label>Email</Label>
              <Input value={Email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="flex flex-col gap-y-2 text-black">
              <Label>Contraseña</Label>
              <Input type="text" value={Password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <div className="flex flex-col gap-y-2 text-black">
              <Label>Teléfono</Label>
              <Input value={Telefono} onChange={(e) => setTelefono(e.target.value)} />
            </div>

            <div className="flex flex-col gap-y-2 text-black">
              <Label>Sector</Label>
              <select
                value={Sector}
                onChange={(e) => setSector(e.target.value)}
                className="border rounded-md p-2"
              >
                <option value="">Seleccione un sector</option>
                {zonas.map((z: any) => (
                  <option key={z.id} value={z.nombre}>
                    {z.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-y-2 text-black">
              <Label>Estado</Label>
              <select
                value={Estado}
                onChange={(e) => setEstado(e.target.value)}
                className="border rounded-md p-2"
              >
                <option value="">Seleccione un estado</option>
                <option value="TRUE">Activo</option>
                <option value="FALSE">Inactivo</option>
              </select>
            </div>
          </div>

          <section className="w-full py-4 flex items-center justify-end gap-x-2">
            <button
              type="button"
              onClick={onClose}
              className="py-1.5 px-3 bg-red-500 text-white rounded-lg"
            >
              Cancelar
            </button>

            <button type="submit" className="px-4 py-2 bg-emerald-500 text-white rounded-lg">
              Guardar Cambios
            </button>
          </section>
        </form>
      </div>
    </div>
  );
}
