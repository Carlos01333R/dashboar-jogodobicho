// src/components/zonas/ModalDeleteZonas.tsx
'use client'
import { supabase } from "@/lib/supabase";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  name: string;
  id: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalDeletezonas({ name, id, isOpen, onClose }: Props) {

  const handleDelete = async () => {
    const { error } = await supabase.from("zonas").delete().eq("id", id).select();
  
    if (error) {
      console.error("Error deleting data:", error.message);
      toast.error("Error eliminando la zona");
    } else {
      toast.success("Zona eliminada correctamente");
      window.location.reload();
    }
  };
 
  if (!isOpen) return null; 

  return (
    <div className="flex z-50 items-center justify-center ">
      {/* Fondo oscuro */}
      {isOpen && (
        <div
          className="fixed z-40 inset-0 flex justify-center items-center backdrop-blur-sm bg-opacity-50 bg-black transition-opacity"
          onClick={() => onClose()}
        >
          {/* Contenido del modal */}
          <div
            className="bg-white rounded-2xl shadow-xl p-6 relative z-30 sm:max-w-[725px] max-h-[90vh] absolute flex-col overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="py-4 font-bold text-center">Eliminar zona</p>
            <section className="w-full flex-col items-center justify-center gap-x-2">
              <h2 className="font-raleway-black text-2xl text-center ">
                ¿Estás seguro de que quieres eliminar la zona <span className="font-bold text-red-600">{name}</span>?
              </h2>
              <p className="text-center text-xs">ID: {id}</p>
            </section>
            <div className="flex justify-between mt-6">
              <button
                onClick={() => onClose()}
                className="px-4 py-2 bg-red-500 text-white rounded-lg cursor-pointer"
              >
                Cerrar
              </button>
              <button 
                className="cursor-pointer px-3 py-2 bg-emerald-500 text-emerald-50 rounded-lg" 
                onClick={handleDelete}
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}