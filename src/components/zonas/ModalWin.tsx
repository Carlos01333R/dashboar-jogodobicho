import { Clock, DollarSign, Trophy, User } from "lucide-react";
import { useState } from "react";
import useObtenerDetallesWin from "@/hook/co/ventasZonas/useObternerDetallesWin";
import { FormatCurrencyCO } from "@/utils/Format";

interface Props {
  zona: string;
  desde: string;
  hasta: string;
}

export default function ModalWin({ zona, desde, hasta }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { data, loading, error } = useObtenerDetallesWin(desde, hasta, zona);

  return (
    <div className="flex z-40 items-center justify-center">
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-x-2 justify-center"
      >
        <DollarSign className="w-4 h-4" />
        <span>Ver premios</span>
      </button>

      {/* Fondo oscuro */}
      {isOpen && (
        <div
          className="fixed z-40 inset-0 flex justify-center items-center backdrop-blur-sm bg-opacity-50 transition-opacity"
          onClick={() => setIsOpen(false)}
        >
          {/* Contenido del modal */}
          <div
            className="bg-white rounded-2xl shadow-xl p-6  z-30 sm:max-w-[725px] max-h-[90vh] absolute flex-col overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-center">Premios del día {desde} a {hasta}</p>

            {loading && <p className="text-center py-4">Cargando...</p>}
            
            {error && <p className="text-center py-4 text-red-500">Error: {error}</p>}

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
                onClick={() => setIsOpen(false)}
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