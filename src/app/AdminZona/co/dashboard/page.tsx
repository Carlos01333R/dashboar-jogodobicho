'use client'
import React, {  useState } from "react"
import { Download } from 'lucide-react';
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/DateRangePicker";
import { formatDateToMDYYYY } from "@/utils/date-utils";
import DataVentasByFecha from "@/lib/VentasZonas/DataVentasByFecha";
import { useAuthAdminZona } from "@/context/AuthContextAdminZona";
import VentasAdminComponents from "@/components/adminzona/Ventas";

export default function Ventas() {
    const { user, isLoading } = useAuthAdminZona()
    const zona = user?.sector || ""
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normaliza la hora

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: today,
    to: today
  });

  const desde = formatDateToMDYYYY(dateRange?.from)
  const hasta = formatDateToMDYYYY(dateRange?.to)

     const { itemsVentasHoy, ventas, error, loading} = DataVentasByFecha({desde, hasta, zona}); 

  

    if (isLoading ) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-yellow-50 flex items-center justify-center p-4">
                <div className="text-gray-600">Cargando...</div>
            </div>
        )
    }
    if (!user) {
        return null
    }

    if(error) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-yellow-50 flex items-center justify-center p-4">
          <div className="text-gray-600">Error: {error}</div>
        </div>
      )
    }
    return (
      <div className="p-2 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
     
        <div className="w-full flex justify-end items-end">
          <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <Download className="w-4 h-4" />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl flex flex-col md:flex-row md:justify-between items-center shadow-sm border border-gray-200 p-6">
        <section className="w-full flex md:block justify-center md:justify-normal items-center md:items-start">
      <DateRangePicker
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />
        </section>
      
      <section>
           
      <div className="text-sm text-muted-foreground py-3 md:py-0">
        <p className="text-xl font-bold text-gray-900 text-center hidden md:block">Fecha seleccionada:</p>
        <article className="flex gap-x-2">
         {dateRange?.from && (
          <p className="flex gap-x-1 items-center"><span className="font-bold">Desde:</span> {formatDateToMDYYYY(dateRange.from)}</p>
        )}
        {dateRange?.to && (
          <p className="flex gap-x-1 items-center"><span className="font-bold">Hasta: </span> {formatDateToMDYYYY(dateRange.to)}</p>
        )}
        </article>
       
      </div>


   
      </section>
      </div>

         <VentasAdminComponents desde={desde} hasta={hasta} zona={zona} itemsVentasHoy={itemsVentasHoy} ventas={ventas} loading={loading} error={error} />


            
    
    </div>
    )
}