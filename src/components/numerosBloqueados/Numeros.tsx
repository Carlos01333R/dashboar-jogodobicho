'use client'
import { FormEvent, useState } from 'react';
import { Ban, Plus, Search, Filter, Calendar, User, AlertTriangle, Trash2, Edit, Loader2 } from 'lucide-react';
import { ModalFromNumerosBloqueados } from '@/components/numerosBloqueados/ModalFrom';
import { ModalDelete } from '../usuarios/ModalDelete';
import { ModalUpdateNumerosBloqueados } from '@/components/numerosBloqueados/ModalUpdate';
import { ModalMaximoValor } from './ModalMaximoNumeros';
import { ModalMaximoValorbr } from './ModalMaximobr';
import { useAuth } from '@/context/AuthContext';

interface prop{
    Submit: (e: FormEvent<Element>) => void
    Delete: (from: any) => void
    Update: (from: any) => void
    loading: boolean;
    error: string;
    numerosBloqueados: any;
}

export default function BlockedNumbers({Submit, Delete, Update, loading, error, numerosBloqueados, }: prop){
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const {selectedCountry} = useAuth();
  const isBrasil = selectedCountry === 'brazil';

  const filteredNumbers = numerosBloqueados.filter((blocked : any)  =>
    (statusFilter === 'all' || (statusFilter === 'active' ? blocked.active : !blocked.active)) &&
    (searchTerm === '' || blocked.numero.toString().includes(searchTerm))
  );

  const totalBlocked = numerosBloqueados.length;
  const activeBlocked = numerosBloqueados.filter((b: { active: any; }) => b.active).length;
  const inactiveBlocked = numerosBloqueados.filter((b: { active: any; }) => !b.active).length;

  if(loading) {
    return (
      <div className="flex justify-center items-center h-64 space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-emerald-500" />
        <p className="font-medium text-lg text-gray-600">Cargando números bloqueados...</p>
      </div>
    );
  }

  if(error) {
    return (
      <div className="flex justify-center items-center h-64 space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="font-bold text-xl text-red-600">{error}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="p-2 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-col items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Números Bloqueados</h2>
          <p className="text-gray-600 mt-1">
            Gestión de números restringidos para ventas
          </p>
        </div>
        <div className="flex items-center space-x-3 py-2 md:py-0">
          <ModalFromNumerosBloqueados  onSubmit={Submit} />
          {isBrasil ? (
            <ModalMaximoValorbr />
          ) : (
            <ModalMaximoValor />
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Search className="w-4 h-4 inline mr-2" />
              Buscar Número
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Número o razón..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="all">Todos</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
          </div>

        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Bloqueados</p>
              <p className="text-2xl font-bold text-gray-900">{totalBlocked}</p>
            </div>
            <div className="p-2 md:p-3 rounded-lg bg-red-500">
              <Ban className="w-3 h-3 md:w-6 md:h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Bloqueos Activos</p>
              <p className="text-2xl font-bold text-gray-900">{activeBlocked}</p>
            </div>
            <div className="p-2 md:p-3 rounded-lg bg-yellow-500">
              <AlertTriangle className="w-3 h-3 md:w-6 md:h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Bloqueos Inactivos</p>
              <p className="text-2xl font-bold text-gray-900">{inactiveBlocked}</p>
            </div>
            <div className="p-2 md:p-3 rounded-lg bg-gray-500">
              <Ban className="w-3 h-3 md:w-6 md:h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Blocked Numbers Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredNumbers.map((numero : any) => (
          <div key={numero.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-full ${numero.active ? 'bg-red-100' : 'bg-gray-100'}`}>
                  <Ban className={`w-6 h-6 ${numero.active ? 'text-red-600' : 'text-gray-400'}`} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">#{numero.numero}</h3>
                 
                </div>
              </div>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                numero.active 
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {numero.active ? 'Activo' : 'Inactivo'}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">Razón del bloqueo:</span>
                <p className="text-sm font-medium text-gray-900 mt-1">{numero.razon}</p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  Bloqueado por:
                </span>
                <span className="text-sm font-medium text-gray-900">
                    Administrador
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Fecha:
                </span>
                <span className="text-sm font-medium text-gray-900">{numero.creado}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <ModalUpdateNumerosBloqueados id={numero.id} numeroState={numero.numero} razon={numero.razon} onSubmit={Update} title='Bloquear Numero' />
                <button className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors hidden">
                  {numero.active ? 'Desactivar' : 'Activar'}
                </button>
              <ModalDelete name={numero.numero} id={numero.id} onsubmit={Delete} title='Bloquear Numero' />
              </div>
            </div>
          </div>
        ))}
      </div>

   

      {/* Alert Section */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-6 h-6 text-yellow-600 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">Importante</h3>
            <p className="text-yellow-700 text-sm">
              Los números bloqueados no podrán ser vendidos en las loterías seleccionadas. 
              Esta acción afecta inmediatamente a todos los puntos de venta. 
              Asegúrate de comunicar estos cambios a tu equipo de ventas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};