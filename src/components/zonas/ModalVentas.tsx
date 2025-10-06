import { useState } from "react";
import DataVentas from "@/lib/VentasZonas/DataVentas"
import DataVentasBr from "@/lib/br/VentasZonas/DataVentas"
import { DateRangePicker } from "../DateRangePicker"
import { DateRange } from "react-day-picker"
import { useAuth } from "@/context/AuthContext";
import { DollarSign } from "lucide-react";
import { FormatCurrencyBR, FormatCurrencyCO } from "@/utils/Format";
import VentasZonasVentas from "./VentasZonasVentas";
import { formatDateToDMY, formatDateToMMDDYYYYBrasil } from "@/utils/date-utils";


interface Props {
  zona: string
}


export default function ModalVentasZonas({zona}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const {selectedCountry} = useAuth()
  
    const { itemsVentasHoy, itemsVentasGenerales, FechaActualColombia, loading, loadingPremio, loadingRewards, error, errorPremio, errorRewards } = DataVentas({zona})
    
    const { itemsVentasGeneralesbr, FechaActualColombiabr, loadingbr,  errorbr,  data } = DataVentasBr({zona})
  
  
    const today = new Date();
     today.setHours(0, 0, 0, 0); // Normaliza la hora
    
      const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: today,
        to: today
      });
        

  return (
    <div className="flex z-40 items-center justify-center ">

       <button
        onClick={() => setIsOpen(true)}
       className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-x-2 justify-center">
          <DollarSign className="w-4 h-4" />
          <span>Ver ventas</span>
        </button>

      {/* Fondo oscuro */}
      {isOpen && (
        <div
          className="fixed z-40 inset-0 flex justify-center items-center backdrop-blur-sm bg-opacity-50  transition-opacity"
          onClick={() => setIsOpen(false)}
        >
          {/* Contenido del modal */}
          <div
            className="bg-white rounded-2xl shadow-xl p-6 relative z-30 sm:max-w-[725px] max-h-[90vh] apsolute  flex-col overflow-y-scroll"
            onClick={(e) => e.stopPropagation()} // Evita cerrar si se hace click dentro
          >
            <h2 className="text-xl font-semibold mb-4">Ventas zona {zona}</h2>
               {selectedCountry === 'brazil' ? (
                     <section>
                       {isOpen && (loadingbr || loadingPremio || loadingRewards) && (
                         <div className="flex justify-center items-center py-8">
                           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                           <p className="ml-4">Cargando datos...</p>
                         </div>
                       )}
             
                       {isOpen && !loadingbr && (
                         <section className="py-2 ">
                       
                         <p className="py-2 font-semibold">Datos de ventas Totales</p>
                           <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                         {itemsVentasGeneralesbr.map((item: any) => (
                           <div key={item.id} className="bg-white rounded-xl shadow-sm p-2 md:p-6 border border-gray-200 flex justify-center md:justify-between items-center">
                             <section>
                               <p className="text-sm text-black font-semibold mb-1 text-center md:text-left">{item.title}</p>
                               <p className={`font-bold text-gray-900 truncate text-sm md:text-base ${item.value < 0 ? 'text-red-600' : ''}`}>{FormatCurrencyBR(item.value)}</p>
                             </section>
                             <section className="hidden md:block ">
                                <div className={`p-2 rounded-lg ${item.color}`}>
                                <DollarSign className="w-4 h-4 text-white" />
                                 </div>
                             </section>
                           </div>
                         ))}
                         </div>
             
                         {/*
                          
                        <p className="py-3 font-semibold hidden">Datos de ventas hoy</p>
                         <div className="hidden grid-cols-2 md:grid-cols-3 gap-4 ">
                           {itemsVentasHoy.map((item: any) => (
                            <div key={item.id} className="bg-white rounded-xl shadow-sm p-2 md:p-6 border border-gray-200 flex justify-center md:justify-between items-center">
                             <section>
                               <p className="text-sm text-black font-semibold mb-1">{item.title}</p>
                               <p className="font-bold text-gray-900 truncate">{FormatCurrencyCO(item.value)}</p>
                               <p className="text-gray-500 text-xs">{FechaActualColombia}</p>
                             </section>
                             <section className=" hidden md:block ">
                                <div className={`p-2 rounded-lg ${item.color}`}>
                                <DollarSign className="w-4 h-4 text-white" />
                                 </div>
                             </section>
                             </div>
             
                             ))}
                         </div>
                         
                         */}
                        
                         </section>
                       )}
             
                       <section>
                         <div className="w-full flex justify-center items-center py-3">
                          <DateRangePicker
                           dateRange={dateRange}
                           onDateRangeChange={setDateRange}
                         />
                         </div>
                        
             
                       {dateRange?.from && dateRange?.to && (
                         selectedCountry === 'brazil' ? (
                         <VentasZonasVentas desde={formatDateToMMDDYYYYBrasil(dateRange.from)} hasta={formatDateToMMDDYYYYBrasil(dateRange.to)} zona={zona} />
                         ) : (
                         <VentasZonasVentas desde={formatDateToDMY(dateRange.from)} hasta={formatDateToDMY(dateRange.to)} zona={zona} />
                         )
                       )}
                       </section>
                       {(error || errorPremio || errorRewards) && (
                         <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                           <p className="text-red-600">{error || errorPremio || errorRewards}</p>
                         </div>
                       )}
                     </section>
                     ) : (
                         <section>
                       {isOpen && (loading || loadingPremio || loadingRewards) && (
                         <div className="flex justify-center items-center py-8">
                           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                           <p className="ml-4">Cargando datos...</p>
                         </div>
                       )}
             
                       {isOpen && !loading && (
                         <section className="py-2 ">
                       
                         <p className="py-2 font-semibold">Datos de ventas Totales</p>
                           <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                         {itemsVentasGenerales.map((item: any) => (
                           <div key={item.id} className="bg-white rounded-xl shadow-sm p-2 md:p-6 border border-gray-200 flex justify-center md:justify-between items-center">
                             <section>
                               <p className="text-sm text-black font-semibold mb-1 text-center md:text-left">{item.title}</p>
                               <p className={`font-bold text-gray-900 truncate text-sm md:text-base ${item.value < 0 ? 'text-red-600' : ''}`}>{FormatCurrencyCO(item.value)}</p>
                             </section>
                             <section className="hidden md:block ">
                                <div className={`p-2 rounded-lg ${item.color}`}>
                                <DollarSign className="w-4 h-4 text-white" />
                                 </div>
                             </section>
                           </div>
                         ))}
                         </div>
             
                         {/*
                          
                        <p className="py-3 font-semibold hidden">Datos de ventas hoy</p>
                         <div className="hidden grid-cols-2 md:grid-cols-3 gap-4 ">
                           {itemsVentasHoy.map((item: any) => (
                            <div key={item.id} className="bg-white rounded-xl shadow-sm p-2 md:p-6 border border-gray-200 flex justify-center md:justify-between items-center">
                             <section>
                               <p className="text-sm text-black font-semibold mb-1">{item.title}</p>
                               <p className="font-bold text-gray-900 truncate">{FormatCurrencyCO(item.value)}</p>
                               <p className="text-gray-500 text-xs">{FechaActualColombia}</p>
                             </section>
                             <section className=" hidden md:block ">
                                <div className={`p-2 rounded-lg ${item.color}`}>
                                <DollarSign className="w-4 h-4 text-white" />
                                 </div>
                             </section>
                             </div>
             
                             ))}
                         </div>
                         
                         */}
                        
                         </section>
                       )}
             
                       <section>
                         <div className="w-full flex justify-center items-center py-3">
                          <DateRangePicker
                           dateRange={dateRange}
                           onDateRangeChange={setDateRange}
                         />
                         </div>
                        
             
                       {dateRange?.from && dateRange?.to && (
                         <VentasZonasVentas desde={formatDateToDMY(dateRange.from)} hasta={formatDateToDMY(dateRange.to)} zona={zona} />
                       )}
                       </section>
                       {(error || errorPremio || errorRewards) && (
                         <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                           <p className="text-red-600">{error || errorPremio || errorRewards}</p>
                         </div>
                       )}
                     </section>
                     )}
             

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
