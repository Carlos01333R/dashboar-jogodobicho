import { useState } from "react";
import { DateRangePicker } from "../DateRangePicker"
import { DateRange } from "react-day-picker"
import { useAuth } from "@/context/AuthContext";
import { DollarSign } from "lucide-react";
import VentasZonasVentasTotales from "./VentasZonasVentasTotales";
import { formatDateToMMDDYYYYBrasil } from "@/utils/date-utils";


interface Props {
  zona: string
}


export default function ModalVentasZonasTotales({zona}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const {selectedCountry} = useAuth()
  
  
  
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
          <span>Ver ventas totales</span>
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
            <h2 className="text-xl font-semibold mb-4 text-center">Ventas totales zona {zona}</h2>
            <p className="text-xs text-center ">Datos totales de CO/BR/RIFAS</p>
            
                     <section>
              
                       <section>
                         <div className="w-full flex justify-center items-center py-3">
                          <DateRangePicker
                           dateRange={dateRange}
                           onDateRangeChange={setDateRange}
                         />
                         </div>
                        
                       {dateRange?.from && dateRange?.to && (
                         <VentasZonasVentasTotales desde={formatDateToMMDDYYYYBrasil(dateRange.from)} hasta={formatDateToMMDDYYYYBrasil(dateRange.to)} zona={zona} />
                       )}
                       </section>
                      
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
