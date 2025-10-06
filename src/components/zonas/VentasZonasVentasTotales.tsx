import { DollarSign } from "lucide-react";
import { FormatCurrencyCO } from "@/utils/Format";
import ModalVentasByFecha from "./ModalVentasByFecha";
import DataVentasTotales from "@/lib/ventasTotales/DataVentasTotales";
import ModalWin from "./ModalWin";
import ModalWinBr from "./ModalWinBr";

import { useAuth } from "@/context/AuthContext";
import { FormatCurrencyBR } from "@/utils/Format";
import { useState } from "react";
import ModalVentasTotales from "./ModalVentasTotales";
import ModalapuestasTotales from "./ModalApuestasTotales";
import ModalGanadoresTotales from "./ModalGanadoresTotales";

interface Props {
    desde: string;
    hasta: string;
    zona: string;
}
export default function VentasZonasVentasTotales({desde, hasta, zona} : Props) {
    const { selectedCountry } = useAuth();
    const {  itemsVentasHoyTotal, ventas, premio, apuestas, itemVentasBr,
        itemVentaCo, itemVentaRifas , ganadores} = DataVentasTotales({desde, hasta, zona});

     const [isModalOpen, setIsModalOpen] = useState(false);
     const [isModalGanadores, setIsModalGanadores] = useState(false);


    return (
        <div className="bg-white rounded-xl shadow-sm p-2 md:p-6 border border-gray-200">
            <p className="text-center pb-2 text-xs md:text-base">Datos de ventas del {desde} al {hasta} en {zona}</p>
           

        <article className="py-2">
            <p className="font-bold text-center py-2">Ventas Brasil</p>
           <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            {itemVentasBr.map((item: any) => (
             <div
             key={item.id}
             className="bg-white rounded-xl shadow-sm p-2  border border-gray-200 flex justify-center md:justify-between items-center">
               <section>
                 <p className="text-sm text-black font-semibold mb-1 text-center md:text-left">{item.title}</p>
                 <p className="font-bold text-gray-900 truncate text-sm md:text-base text-center md:text-left">{FormatCurrencyBR(item.value)}</p>
               </section>
             </div> 
            ))}
             
            </section>
            </article>

             <article>
            <p className="font-bold text-center py-2">Ventas colombia</p>
           <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            {itemVentaCo.map((item: any) => (
             <div 
              key={item.id}
             className="bg-white rounded-xl shadow-sm p-2  border border-gray-200 flex justify-center md:justify-between items-center">
               <section>
                 <p className="text-sm text-black font-semibold mb-1 text-center md:text-left">{item.title}</p>
                 <p className="font-bold text-gray-900 truncate text-sm md:text-base text-center md:text-left">{FormatCurrencyBR(item.value)}</p>
               </section>
             </div> 
            ))}
             
            </section>
            </article>

             <article className="py-2">
            <p className="font-bold text-center py-2">Ventas rifas</p>
           <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            {itemVentaRifas.map((item: any) => (
             <div
             key={item.id}
             className="bg-white rounded-xl shadow-sm p-2  border border-gray-200 flex justify-center md:justify-between items-center">
               <section className="flex flex-col justify-center items-center">
                 <p className="text-sm text-black font-semibold mb-1 text-center md:text-left">{item.title}</p>
                 <p className="font-bold text-gray-900 truncate text-sm md:text-base text-center md:text-left">{FormatCurrencyBR(item.value)}</p>
               </section>
             </div> 
            ))}
             
            </section>
            </article>


            <p className="text-xl font-bold text-center">Totales de venta</p>

            <section className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                {itemsVentasHoyTotal.map((item: any) => (
                  <section key={item.id}>
                <div  className="bg-white rounded-xl shadow-sm p-2 md:p-6 border border-gray-200 flex justify-center md:justify-between items-center">
                                <section >
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


         <div className="w-full bg-yellow-50 px-4 py-2 mt-2">
            <p className="text-center">Todos los datos estan agrupados <span className="text-yellow-500 ">Para verlos individualmente seleccione ver ventas</span> </p>
         </div>
         
       <section className="w-full flex items-center justify-center gap-x-2 py-2">
  {/* Botón Ver ventas - Muestra si hay apuestas O ventas */}
  {(apuestas.length > 0 || ventas.length > 0) && (
    <button
      onClick={() => setIsModalOpen(true)}
      className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-x-2 justify-center"
    >
      <DollarSign className="w-4 h-4" />
      <span>Ver ventas</span>
    </button>
  )}

  {/* Botón Ver ganadores - Muestra si hay ganadores O premio existe */}
  {((ganadores && ganadores.length > 0) || premio) && (
    <button
      onClick={() => setIsModalGanadores(true)}
      className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-x-2 justify-center"
    >
      <DollarSign className="w-4 h-4" />
      <span>Ver ganadores</span>
    </button>
  )}
</section>

        

                {isModalOpen && (
           <ModalapuestasTotales ventas={ventas} apuestas={apuestas} desde={desde} hasta={hasta} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
                )}

                {isModalGanadores && (
           <ModalGanadoresTotales winner={ganadores} desde={desde} hasta={hasta} zona={zona} isOpen={isModalGanadores} onClose={() => setIsModalGanadores(false)} />
                )}

        </div>
    )}