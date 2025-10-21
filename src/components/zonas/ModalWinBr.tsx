import { Calendar, DollarSign, MapPin, Ticket, Trophy, User } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "../ui/card";

interface Props {
winner: any;
desde: string;
hasta: string;
  isOpen: boolean;
  onClose: () => void;

}

export default function ModalWinBr({winner, desde, hasta, isOpen, onClose} : Props) {

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

            <p className="text-center ">premios del dia {desde} a {hasta}</p>
              <section className="grid  md:grid-cols-2 gap-x-3 md:gap-x-5 md:p-3 gap-y-2 md:gap-y-2">
            {winner.map((winner: any) => (
             <Card key={winner.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-full bg-green-100">
                    <Trophy className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{winner.nombre}</h3>
                    <p className="text-sm text-gray-500">Ticket #{winner.numero_ticket}</p>
                  </div>
                </div>
                <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                  Premiado
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Premio:</span>
                  <span className="text-lg font-bold text-emerald-600">${winner.premio_total.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Loterías:</span>
                  <span className="text-sm font-medium text-gray-900">{winner.loterias.join(", ")}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Modalidades:</span>
                  <span className="text-sm font-medium text-gray-900">{winner.modalidades.join(", ")}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    Zona:
                  </span>
                  <span className="text-sm font-medium text-gray-900">{winner.zona}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Fecha Sorteo:
                  </span>
                  <span className="text-sm font-medium text-gray-900">{winner.fecha_sorteo}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    Contacto:
                  </span>
                  <span className="text-sm font-medium text-gray-900">{winner.telefono}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center">
                    <Ticket className="w-4 h-4 mr-1" />
                    Apuestas:
                  </span>
                  <span className="text-sm font-medium text-gray-900">{winner.cantidad_apuestas}</span>
                </div>

                 <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-800 flex font-bold items-center">
                    <User className="w-4 h-4 mr-1" />
                    usuario:
                  </span>
                  <span className="text-sm font-medium text-gray-900">{winner.usuario}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          ))}
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
