'use client'
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Trophy, Calendar, Filter, Download, Search, TrendingUp, MapPin, Clock, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useWinSummary } from '@/hook/co/useInfoWin';
import { FormatCurrencyCO } from '@/utils/Format';
import { ModalDetailHistory } from '@/components/ganadores/ModalDetalHistoty';
import { useLoterias } from '@/hook/co/Loterias';


interface Winner {
  lottery: string;
  boleto: string;
  result: string;
  match2: boolean;
  match3: boolean;
  match4: boolean;
  premio: number;
  combi: string;
  nombre: string;
  celular: string;
  fecha: string;
  hora: string;
  fecha_hora: string;
  numero_venta: string;
  zona: string;
  email: string;
  venta: string;
  boletos: string[];
}

const WinnersHistory: React.FC = () => {
  const { selectedCountry } = useAuth();
  const [dateFilter, setDateFilter] = useState('month');
  const [lotteryFilter, setLotteryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { summary, loading, error } = useWinSummary();
  const { data } = useLoterias();
  const Ganadores = summary?.data
  const totalWinnersMes = summary?.total_ganadores_por_mes;
  const totalPrizesMes = summary?.total_premios_por_mes;
  const nombresLoterias = data?.loterias.map(loteria => loteria.name);

  

  const filteredWinners = Ganadores?.filter(winner => 
    (lotteryFilter === 'all' || winner.lottery.toLowerCase().includes(lotteryFilter.toLowerCase())) &&
    (searchTerm === '' || 
     winner.numero_venta.toLowerCase().includes(searchTerm.toLowerCase()))
  );


  const totalWinners = summary?.total_ganadores || 0;
  const totalPrizes = summary?.total_premios || 0;
  const avgPrize = summary?.premio_promedio || 0;


  
// Función auxiliar para convertir "YYYY-MM" a abreviatura de mes en español
const monthNames: Record<string, string> = {
  "01": "Ene",
  "02": "Feb",
  "03": "Mar",
  "04": "Abr",
  "05": "May",
  "06": "Jun",
  "07": "Jul",
  "08": "Ago",
  "09": "Sep",
  "10": "Oct",
  "11": "Nov",
  "12": "Dic"
};


const premiosMap = (totalPrizesMes || []).reduce<Record<string, number>>((acc, item) => {
  acc[item.mes] = item.premios;
  return acc;
}, {});

// Combinar ganadores y premios
const winnersChartData = totalWinnersMes?.map(item => {
  const [year, month] = item.mes.split("-");
  return {
    month: monthNames[month],
    ganadores: item.ganadores,
    premios: premiosMap[item.mes] || 0
  };
});

  


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        <p className="font-bold text-xl ml-4">Cargando datos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="font-bold text-xl text-red-600">{error}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="p-2 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base md:text-3xl font-bold text-gray-900">Historial de Ganadores</h2>
          <p className="text-gray-600 mt-1">
            Registro completo de premios otorgados
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <Download className="w-4 h-4" />
            <span>Exportar Historial</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="w-4 h-4 inline mr-2" />
              Lotería
            </label>
            <select
              value={lotteryFilter}
              onChange={(e) => setLotteryFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">Todas las loterías</option>
             
                 {nombresLoterias?.map((loteria: string) => (
                  <option value={loteria} key={loteria}>{loteria}</option>
                ))}
               
            </select>
        
          </div>

        
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Search className="w-4 h-4 inline mr-2" />
              Buscar
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nombre o ticket..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-col-1  md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Ganadores</p>
              <p className="text-2xl font-bold text-gray-900">{totalWinners}</p>
            </div>
            <div className="p-3 rounded-lg bg-emerald-500">
              <Trophy className="w-6 h-6 text-white" />
            </div>
          </div>
         
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className='pr-3'>
              <p className="text-sm text-gray-600 mb-1">Total Premios</p>
              <p className="text-xl font-bold text-gray-900 truncate">{FormatCurrencyCO(totalPrizes)}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
       
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className='pr-3'>
              <p className="text-sm text-gray-600 mb-1">Premio Promedio</p>
              <p className="text-xl font-bold text-gray-900 truncate">{FormatCurrencyCO(avgPrize)}</p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-500">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        
        </div>

      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Winners Trend */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Tendencia de Ganadores</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={winnersChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [value, 'Ganadores']} />
              <Line type="monotone" dataKey="ganadores" stroke="#10B981" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Prizes Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Distribución de Premios</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={winnersChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
               <Tooltip formatter={(value : any) => `${value} `} />
                <Bar dataKey="premios" fill="#3B82F6" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
       {Ganadores && filteredWinners?.map((winner : any ) =>
       
       (
          <div key={winner.numero_venta} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-full bg-green-100`}>
                  <Trophy className={`w-6 h-6 text-gren-500`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{winner.nombre}</h3>
                  <p className="text-sm text-gray-500">Ticket #{winner.numero_venta}</p>
                </div>
              </div>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800 `}>
                Premiado
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Premio:</span>
                <span className="text-lg font-bold text-emerald-600">${winner.premio.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Lotería:</span>
                <span className="text-sm font-medium text-gray-900">{winner.lottery}</span>
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
                  <Clock className="w-4 h-4 mr-1" />
                  fecha y Hora:
                </span>
                <span className="text-sm font-medium text-gray-900">{winner.fecha} - {winner.hora}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  Contacto:
                </span>
                <span className="text-sm font-medium text-gray-900">{winner.celular}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex space-x-3">
              
                <ModalDetailHistory lottery={winner.lottery} boleto={winner.boleto} boletos2={winner.boleto} result={winner.result} match2={winner.match2 === 'true'} match3={winner.match3 === 'true'} match4={winner.match4 === 'true'} premio={winner.premio} combi={winner.combi} nombre={winner.nombre} celular={winner.celular} fecha={winner.fecha} hora={winner.hora} fecha_hora={winner.fecha_hora} numero_venta={winner.numero_venta} zona={winner.zona} email={winner.email} venta={winner.venta} boletos={winner.boletos} />
              </div>
            </div>
          </div>
        ))}
        </div>

    </div>
  );
};

export default WinnersHistory;