'use client'
import React from "react"
import { useAuth } from "@/context/AuthContext"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import {  mockDashboardStats, salesChartData, winnersChartData } from "@/lib/mockData"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Trophy, Users, Ticket } from 'lucide-react';
import StatCard from "@/components/StatCard"
import { FormatCurrencyCO } from "@/utils/Format"
import { LotteryPieChart } from "./LotteryPieChart"


export default function DashboardHome({data} : any) {

     const stats = mockDashboardStats;
     const { selectedCountry } = useAuth()
      const chartData = data.winnersChartData.map((item: any)  => ({
      name: item.lottery,
      winners: item.count,
      // Puedes agregar un premio simulado si lo necesitas
      prize: Math.round(item.count * 10000) // Ejemplo: 10,000 por ganador
  }));

    const pieColors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

    return (
        <div className="p-2 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl md:text-3xl font-bold text-gray-900">
            Dashboard Principal
          </h2>
          <p className="text-xs md:text-base text-gray-600 ">
            Resumen general del sistema de loterías
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-4 py-2 rounded-lg">
          <div className="text-2xl">
            {selectedCountry === 'brazil' ? '🇧🇷' : '🇨🇴'}
          </div>
          <div>
            <p className="font-semibold">
              {selectedCountry === 'brazil' ? 'Brasil' : 'Colombia'}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6  ">
        <StatCard
          title="Ventas Totales"
          value={`${FormatCurrencyCO(data.VentasTotale)}`}
          change={data.diferenciaTotal}
          icon={DollarSign}
          color="bg-emerald-500"
          className="text-2xl"
        />
        <StatCard
          title="Venta Neta"
          value={`${FormatCurrencyCO(data.VentaNeta)}`}
          change={data.diferenciaNeta}
          icon={DollarSign}
          color="bg-blue-500"
          className="text-2xl"
        />
        

        <StatCard
          title="Usuarios Activos"
          value={data.cantidadUsuarios}
          icon={Users}
          color="bg-yellow-500"
          className="text-2xl"
        />
        <StatCard
          title="Loterías Activas"
          value={data.cantidadLoterias}
          icon={Ticket}
          color="bg-purple-500"
          className="text-2xl"

        />
      </div>

      <div className="w-full flex flex-col items-center gap-y-2 md:hidden">
        <section className="w-full grid grid-cols-1 gap-y-2">
        <StatCard
          title="Ventas Totales"
          value={`${FormatCurrencyCO(data.VentasTotale)}`}
          change={data.diferenciaTotal}
          icon={DollarSign}
          color="bg-emerald-500"
          className="text-2xl"
        />
        <StatCard
          title="Venta Neta"
          value={`${FormatCurrencyCO(data.VentaNeta)}`}
          change={data.diferenciaNeta}
          icon={DollarSign}
          color="bg-blue-500"
           className="text-2xl"
        />
        </section>
       
        <section className="w-full flex flex-row items-center gap-x-2">
        
        <StatCard
          title="Usuarios Activos"
          value={data.cantidadUsuarios}
         
          icon={Users}
          color="bg-yellow-500"
        />
        <StatCard
          title="Loterías Activas"
          value={data.cantidadLoterias}
         
          icon={Ticket}
          color="bg-purple-500"
        />
        </section>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-lg font-semibold text-gray-900">Ventas Mensuales</h3>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
                <span>Venta bruta</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span>Venta neta</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.ventasChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value : number) => [`$${FormatCurrencyCO(value)}`, '']} />
              <Bar dataKey="brasil" fill="#10B981" radius={4} />
              <Bar dataKey="colombia" fill="#3B82F6" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Winners by Lottery */}
        <div className="bg-white rounded-xl shadow-sm p-2 border border-gray-200">
          <LotteryPieChart data={data.winnersChartData} totalLotteries={data.cantidadLoterias} />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              {
                type: 'sale',
                message: 'Nueva venta de $4.50 en Mega-Sena',
                time: 'Hace 5 minutos',
                color: 'bg-green-100 text-green-800'
              },
              {
                type: 'winner',
                message: 'Nuevo ganador: $15,000 en Lotofácil',
                time: 'Hace 15 minutos',
                color: 'bg-yellow-100 text-yellow-800'
              },
              {
                type: 'user',
                message: 'Nuevo usuario registrado en zona Bogotá',
                time: 'Hace 30 minutos',
                color: 'bg-blue-100 text-blue-800'
              },
              {
                type: 'system',
                message: 'Números bloqueados actualizados',
                time: 'Hace 1 hora',
                color: 'bg-gray-100 text-gray-800'
              }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${activity.color}`}>
                  {activity.type.toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    )
}