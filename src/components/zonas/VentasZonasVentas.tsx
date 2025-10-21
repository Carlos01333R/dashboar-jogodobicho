import { DollarSign } from "lucide-react";
import { FormatCurrencyCO } from "@/utils/Format";
import ModalVentasByFecha from "./ModalVentasByFecha";
import DataVentasByFecha from "@/lib/VentasZonas/DataVentasByFecha";
import DataVentasByFechaBr from "@/lib/br/VentasZonas/DataVentasByFecha";
import DataVentasTotales from "@/lib/ventasTotales/DataVentasTotales";
import ModalWin from "./ModalWin";
import ModalWinBr from "./ModalWinBr";

import { useAuth } from "@/context/AuthContext";
import { FormatCurrencyBR } from "@/utils/Format";
import { useState } from "react";

interface Props {
    desde: string;
    hasta: string;
    zona: string;
}
export default function VentasZonasVentas({desde, hasta, zona} : Props) {
    const { selectedCountry } = useAuth();
    const { itemsVentasHoy, ventas, premio } = DataVentasByFecha({desde, hasta, zona});
    const { itemsVentasHoybr, apuestas, totalPremio, ganadores } = DataVentasByFechaBr({desde, hasta, zona});
    const [isOpen, setIsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);




    return (
        <div className="bg-white rounded-xl shadow-sm p-2 md:p-6 border border-gray-200">
            <p className="text-center pb-2 text-xs md:text-base ">Datos de ventas del {desde} al {hasta} en {zona}</p>
            {selectedCountry === 'brazil' ? (
              <>
            <section className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {itemsVentasHoybr.map((item: any) => (
                  <section key={item.id}>
                <div  className="bg-white rounded-xl shadow-sm p-2 md:p-6 border border-gray-200 flex justify-center md:justify-between items-center">
                                <section>
                                  <p className="text-sm text-black font-semibold mb-1 text-center md:text-left">{item.title}</p>
                                  <p className={`font-bold text-gray-900 truncate text-sm md:text-base text-center md:text-left ${item.value < 0 ? 'text-red-600' : ''}`}>{FormatCurrencyBR(item.value)}</p>
                                  <p className="text-gray-500 text-xs py-2 hidden md:block">{desde} - {hasta}</p>
                                </section>
                                <section className=" hidden md:block ">
                                   <div className={`p-2 rounded-lg ${item.color}`}>
                                   <DollarSign className="w-4 h-4 text-white" />
                                    </div>
                                </section>         
                                </div>                 
                            </section>
                ))}  
            </section>
              <section className="w-full flex justify-center items-center gap-x-2 py-4 md:py-2">
                                {apuestas?.length > 0 && (
                                    <button
                              onClick={() => setIsOpen(true)}
                            className=" bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-x-2 justify-center">
                                <DollarSign className="w-4 h-4" />
                                <span>Ver ventas hoy</span>
                              </button>

                                )}               
                                {ganadores &&  ganadores.length > 0 && (
                               
                              <button
                                onClick={() => setIsOpen(true)}
                              className=" bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-x-2 justify-center">
                                  <DollarSign className="w-4 h-4" />
                                  <span>Ver Premios brazil</span>
                                </button>
                                )}
                            </section>
            </>
            ) : (
               <section className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {itemsVentasHoy.map((item: any) => (
                
                <div key={item.id} className="bg-white rounded-xl shadow-sm p-2 md:p-6 border border-gray-200 flex justify-center md:justify-between items-center">
                                <section>
                                  <p className="text-sm text-black font-semibold mb-1">{item.title}</p>
                                  <p className="font-bold text-gray-900 truncate">{FormatCurrencyCO(item.value)}</p>
                                  <p className="text-gray-500 text-xs py-2">{desde} - {hasta}</p>
                                </section>
                                <section className=" hidden md:block ">
                                   <div className={`p-2 rounded-lg ${item.color}`}>
                                   <DollarSign className="w-4 h-4 text-white" />
                                    </div>
                                </section>

                          
              </div>
                      
                ))}
                   <section className="w-full flex flex-1 items-center justify-center gap-x-2 py-4 md:py-2">
                                {ventas?.length > 0 && (
                                     <button
                                  onClick={() => setIsModalOpen(true)}
                                className=" bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-x-2 justify-center">
                                    <DollarSign className="w-4 h-4" />
                                    <span>Ver ventas</span>
                                  </button>

                                )}
                                

                                {premio !== 0 && (
                                  <ModalWin desde={desde} hasta={hasta} zona={zona} />
                                )}
                            </section>

                
            </section>
            )
            }

          {isOpen && selectedCountry === 'brazil' ? (
             <ModalVentasByFecha desde={desde} hasta={hasta} ventas={apuestas} isOpen={isOpen} onClose={() => setIsOpen(false)} />
          ):(
            <ModalVentasByFecha desde={desde} hasta={hasta} ventas={ventas} isOpen={isOpen} onClose={() => setIsOpen(false)} />
          )}

          {isModalOpen && (
         <ModalWinBr desde={desde} hasta={hasta} winner={ganadores} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
          )}
        </div>
    )}