import { useAuth } from "@/context/AuthContext";
import { DollarSign } from "lucide-react";
import { useState } from "react";
import CardVentasBr from "../CardVentasBr";
import CardVentas from "../CardVentas";

interface Props {
ventas: [] | any;
apuestas: [] | any;
desde: string;
hasta: string;
isOpen: boolean;
onClose: () => void;
}

export default function ModalapuestasTotales({ventas, apuestas, desde, hasta, isOpen, onClose} : Props) {

  return (
    <div className="flex z-50 items-center justify-center ">
      {/* Fondo oscuro */}
      {isOpen && (
        <div
          className="fixed z-40 inset-0 flex justify-center items-center backdrop-blur-sm bg-opacity-50  transition-opacity"
          onClick={() => onClose()}
        >
          {/* Contenido del modal */}
          <div
            className="bg-white rounded-2xl shadow-xl p-6 relative z-30 sm:max-w-[725px] max-h-[90vh] apsolute  flex-col overflow-y-scroll"
            onClick={(e) => e.stopPropagation()} // Evita cerrar si se hace click dentro
          >
            <p className="text-center py-2">Ventas del dia {desde} a {hasta}</p>
                <section className="space-y-4">
                  
                    {apuestas?.length > 0 && (
                     <article>
                        <p className="text-center font-bold">Apuestas brasil</p>
                        <CardVentasBr Ventas={apuestas} />
                     </article>
                     )}

                     {ventas?.length > 0 && (
                     <article>
                         <p className="text-center font-bold">Apuestas colombia</p>
                        <CardVentas Ventas={ventas} />
                     </article>
                     )}
                    
                   </section>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => onClose()}
                className="px-4 py-2 bg-red-500 text-white rounded-lg cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
