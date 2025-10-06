import { supabase } from "@/lib/supabase";
import { DollarSign } from "lucide-react";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

interface ModalFromZonasProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalFromZonas({ isOpen, onClose }: ModalFromZonasProps) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const nombre = formData.get("nombre");
    const porcentaje_loteria = formData.get("porcentaje_loteria");
    const porcentaje_cliente = formData.get("porcentaje_cliente");
    const porcentaje_admin_zona = formData.get("porcentaje_admin_zona");
    const cuatroCifras = formData.get("cuatroCifras");
    const tresCifras = formData.get("tresCifras");
    const dosCifras = formData.get("dosCifras");
    const cuatroCombi = formData.get("cuatroCombi");
    const tresCombi = formData.get("tresCombi");
    const milla = formData.get("milla");
    const centena = formData.get("centena");
    const decena = formData.get("decena");
    const millar1a5 = formData.get("millar1a5");
    const centena1a5 = formData.get("centena1a5");
    const decena1a5 = formData.get("decena1a5");

    if (
      nombre === "" ||
      porcentaje_loteria === "" ||
      porcentaje_cliente === "" ||
      porcentaje_admin_zona === "" ||
      cuatroCifras === "" ||
      tresCifras === "" ||
      dosCifras === "" ||
      milla === "" ||
      centena === "" ||
      decena === "" ||
      millar1a5 === "" ||
      centena1a5 === "" ||  
      decena1a5 === ""
    ) {
      toast.error("Complete todos los campos");
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
          "3combi": tresCombi,
          "4combi": cuatroCombi,
          "milla": milla,
          "centena": centena,
          "decena": decena,
          "millar1a5": millar1a5,
          "centena1a5": centena1a5,
          "decena1a5": decena1a5,
        },
      ])
      .select();

    if (error) {
      console.error("Error inserting data:", error.message);
      toast.error("Error al crear la zona");
    } else {
      toast.success("Zona agregada correctamente");
      setTimeout(() => window.location.reload(), 1000);
      onClose();
      e.currentTarget.reset();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed z-40 inset-0 flex justify-center items-center backdrop-blur-sm bg-opacity-50 transition-opacity"
      onClick={onClose}
    >
      {/* Contenido del modal */}
      <div
        className="bg-white rounded-2xl shadow-xl p-6 relative z-30 sm:max-w-[725px] max-h-[90vh] absolute flex-col overflow-y-scroll"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-center py-4 font-bold">Crear una nueva zona</p>
        <form onSubmit={handleSubmit}>
          <div className="hidden md:grid gap-4 grid-col-1 md:grid-cols-3">
            <div className="flex flex-col gap-y-2 text-black">
              <Label htmlFor="nombre">Nombre</Label>
              <Input name="nombre" placeholder="Nombre Completo" />
            </div>

            <div className="flex flex-col gap-y-2 text-black">
              <Label htmlFor="porcentaje_loteria">% Casa</Label>
              <Input name="porcentaje_loteria" placeholder="Porcentaje loteria" type="number" />
            </div>
            <div className="flex flex-col gap-y-2 text-black">
              <Label htmlFor="porcentaje_cliente">% Vendedor</Label>
              <Input name="porcentaje_cliente" placeholder="Porcentaje cliente" type="number" />
            </div>
            <div className="flex flex-col gap-y-2 text-black">
              <Label htmlFor="porcentaje_admin_zona">% admin zona</Label>
              <Input name="porcentaje_admin_zona" placeholder="Porcentaje admin zona" type="number" />
            </div>
            <div className="flex flex-col gap-y-2 text-black">
              <Label htmlFor="milla">millar</Label>
              <Input name="milla" placeholder="millar" type="number" />
            </div>
            <div className="flex flex-col gap-y-2 text-black">
              <Label htmlFor="centena">Centena</Label>
              <Input name="centena" placeholder="Centena" type="number" />
            </div>

            <div className="flex flex-col gap-y-2 text-black">
              <Label htmlFor="decena">Decena</Label>
              <Input name="decena" placeholder="Decena" type="number" />
            </div>

            <div className="flex flex-col gap-y-2 text-black">
              <Label htmlFor="millar1a5">millar1a5</Label>
              <Input name="millar1a5" placeholder="millar1a5" type="number" />
            </div>
            <div className="flex flex-col gap-y-2 text-black">
              <Label htmlFor="centena1a5">Centena1a5</Label>
              <Input name="centena1a5" placeholder="Centena1a5" type="number" />
            </div>
            <div className="flex flex-col gap-y-2 text-black">
              <Label htmlFor="decena1a5">Decena1a5</Label>
              <Input name="decena1a5" placeholder="Decena1a5" type="number" />
            </div>
          </div>

          <div className="flex justify-center items-center gap-y-2 text-black py-4">
            <p className="font-bold">Datos de modalidades de colombia</p>
          </div>

          <div className="hidden md:grid gap-4 grid-col-1 md:grid-cols-3">
            <div className="flex flex-col gap-y-2 text-black">
              <Label htmlFor="cuatroCifras">4 cifras</Label>
              <Input name="cuatroCifras" placeholder="Cuatro cifras" type="number" />
            </div>
            <div className="flex flex-col gap-y-2 text-black">
              <Label htmlFor="tresCifras">3 cifras</Label>
              <Input name="tresCifras" placeholder="Tres cifras" type="number" />
            </div>

            <div className="flex flex-col gap-y-2 text-black">  
              <Label htmlFor="dosCifras">2 cifras</Label>
              <Input name="dosCifras" placeholder="Dos cifras" type="number" /> 
            </div>

            <div className="flex flex-col gap-y-2 text-black">
              <Label htmlFor="cuatroCombi">Cuatro combi</Label>
              <Input name="cuatroCombi" placeholder="Cuatro combi" type="number" />
            </div>

            <div className="flex flex-col gap-y-2 text-black">  
              <Label htmlFor="tresCombi">Tres combi</Label>
              <Input name="tresCombi" placeholder="Tres combi" type="number" />
            </div>
          </div>

          {/* Botón de enviar formulario */}
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg cursor-pointer"
            >
              Crear Zona
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}