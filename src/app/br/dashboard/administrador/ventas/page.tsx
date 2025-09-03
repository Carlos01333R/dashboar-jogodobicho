'use client'
import React, { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { Download, DollarSign, Ticket, Users } from 'lucide-react';
import { useVentasPorRango } from "@/hook/co/VentasHoy";
import { FormatCurrencyBR } from "@/utils/Format";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/DateRangePicker";
import { formatDateToMMDDYYYYBR } from "@/utils/date-utils";
import { useApuestasPorFecha } from "@/hook/br/useVentasHoy";
import CardVentasBr from "@/components/CardVentasBr";



export default function VentasBr() {

    const { user, isLoading } = useAuth()
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normaliza la hora

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: today,
    to: today
  });
    
  const desde = formatDateToMMDDYYYYBR(dateRange?.from)
  const hasta = formatDateToMMDDYYYYBR(dateRange?.to)
  const { data, refetch, error, stats, apuestas } = useApuestasPorFecha({fechaDesde: desde ,fechaHasta: hasta});


  const totalSales = stats?.total_apuestas
  const totalAmount = stats?.monto_total
  const Vendedores = stats?.usuarios_unicos

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
          <p className="flex gap-x-1 items-center"><span className="font-bold">Desde:</span> {formatDateToMMDDYYYYBR(dateRange.from)}</p>
        )}
        {dateRange?.to && (
          <p className="flex gap-x-1 items-center"><span className="font-bold">Hasta: </span> {formatDateToMMDDYYYYBR(dateRange.to)}</p>
        )}
        </article>
       
      </div>
      </section>
      </div>


      {/* Stats Cards */}
      <div className="hidden md:grid grid-cols-1 md:grid-cols-4 gap-6  ">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Ventas</p>
              <p className="text-2xl font-bold text-gray-900">{totalSales}</p>
            </div>
            <div className="p-3 rounded-lg bg-emerald-500">
              <Ticket className="w-6 h-6 text-white" />
            </div>
          </div>
          
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Monto Bruto</p>
              <p className="text-2xl font-bold text-gray-900">{FormatCurrencyBR(totalAmount)}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
         
        </div>

       

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Vendedores</p>
              <p className="text-2xl font-bold text-gray-900">{Vendedores}</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-500">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
         
        </div>
      </div>

      <section className="w-full flex md:hidden flex-col items-center gap-y-2 ">
        <div className="w-full grid grid-cols-2 gap-x-2">
          
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="hidden md:flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Ventas</p>
              <p className="text-2xl font-bold text-gray-900">{totalSales}</p>
            </div>
            <div className="p-3 rounded-lg bg-emerald-500">
              <Ticket className="w-6 h-6 text-white" />
            </div>
          </div>
           <div className="md:hidden flex flex-col ">
          
            <section className="flex items-center justify-between">
               <p className="text-sm text-gray-600 mb-1">Total Ventas</p>
            <div className="p-3 rounded-lg bg-emerald-500">
              <Ticket className="w-6 h-6 text-white" />
            </div>
            </section>
              <section>
             
              <p className="text-2xl font-bold text-gray-900">{totalSales}</p>
            </section>
            
          </div>
          
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="hidden md:flex items-center justify-between  ">
            <div>
              <p className="text-sm text-gray-600 mb-1">Vendedores</p>
              <p className="text-2xl font-bold text-gray-900">{Vendedores}</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-500">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
           <div className="md:hidden flex flex-col ">
  
            <section className="flex items-center justify-between gap-x-2">
                <p className="text-sm text-gray-600 mb-1">Vendedores</p>
                 <div className="p-3 rounded-lg bg-purple-500">
              <Users className="w-6 h-6 text-white" />
            </div>
            </section>
             <section>
              <p className="text-2xl font-bold text-gray-900">{Vendedores}</p>
            </section>
           
          </div>
         
        </div>
        </div>
         <div className="w-full bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Monto bruto</p>
              <p className="text-2xl font-bold text-gray-900">{FormatCurrencyBR(totalAmount)}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
         
        </div>
      </section>

    <CardVentasBr Ventas={apuestas} />
  
    

      
    </div>
    )
}