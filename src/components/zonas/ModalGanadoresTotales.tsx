import { useAuth } from "@/context/AuthContext";
import { Calendar, Clock, DollarSign, MapPin, Ticket, Trophy, User } from "lucide-react";
import { useState } from "react";
import CardVentasBr from "../CardVentasBr";
import CardVentas from "../CardVentas";
import { Card, CardContent } from "../ui/card";
import useObtenerDetallesWin from "@/hook/co/ventasZonas/useObternerDetallesWin";
import { FormatCurrencyCO } from "@/utils/Format";

interface Props {
winner: [] | any;
desde: string;
hasta: string;
zona: string;
isOpen: boolean;
onClose: () => void;
}

export default function ModalApuestasTotales({winner, zona, desde, hasta, isOpen, onClose} : Props) {

 const { data, loading, error } = useObtenerDetallesWin(desde, hasta, zona);

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
            <p className="text-center py-2">Ganadores del dia {desde} a {hasta}</p>

            <p className="text-center py-2 font-bold">Ganadores del brasil</p>
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

           <p className="text-center py-4 font-bold"> Ganadores del colombia</p>
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3">
              {data && data.length > 0 ? (
                data.map((item: any) => (
                  <div key={item.numero_venta} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-3 rounded-full bg-green-100">
                          <Trophy className="w-6 h-6 text-green-500" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{item.nombre}</h3>
                          <p className="text-sm text-gray-500">Ticket #{item.numero_venta}</p>
                        </div>
                      </div>
                      <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                        Premiado
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Premio:</span>
                        <span className="text-lg font-bold text-emerald-600">{FormatCurrencyCO(item.premio)}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Boleto:</span>
                        <span className="text-sm font-medium text-gray-900 flex-wrap">{item.boleto}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Resultado:</span>
                        <span className="text-sm font-medium text-gray-900">{item.result}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          Fecha y Hora:
                        </span>
                        <span className="text-sm font-medium text-gray-900">{item.fecha} - {item.hora}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          Contacto:
                        </span>
                        <span className="text-sm font-medium text-gray-900">{item.celular}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          Vendedor:
                        </span>
                        <span className="text-sm font-medium text-gray-900">{item.email}</span>
                      </div>

                      <div className="w-full flex items-center justify-center">
                        <a
                          href={`https://admin-loterias.vercel.app/ticket?ref_venta=${item.numero_venta}`}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-zinc-900 text-white rounded-lg px-4 py-2 text-sm"
                        >
                          Descargar el ticket
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                !loading && <p className="text-center py-4 col-span-full">No hay premios para mostrar</p>
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
