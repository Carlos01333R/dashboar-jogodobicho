'use client'
import React, { useState } from 'react';
import { Users as UsersIcon, Search, MapPin, Calendar, User, TicketCheck, DollarSign, BarChart3, Plus, Trash2, Edit } from 'lucide-react';
import useZonas from '@/hook/co/useZonas';
import ModalFromZonas from './ModalFromZonas';
import ModalUpdateZonas from './ModalUpdateZonas';
import { FormatCurrencyCO, FormatCurrencyBR } from '@/utils/Format';
import { useAuth } from '@/context/AuthContext';
import ModalDeleteZonas from './ModalDeletezonas';



export default function ZonasComponent() {
  const [searchTerm, setSearchTerm] = useState('')
  const { zonas, loading , error } = useZonas();
  const { selectedCountry } = useAuth();
  const isBrasil = selectedCountry === 'brazil';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteZonas, setDeleteZonas] = useState<any | null>(null);
  const [updateZonaSelected, setUpdateZonaSelected] = useState<any | null>(null);
  
  
  
  const filteredUsers = zonas.filter((zonas : any ) => 
    (searchTerm === '' || 
     zonas.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
  
  );
  const totalUsers = filteredUsers.length;

  if (loading) {
    return (
      <div className="flex justify-center items-center ">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        <p className="font-bold text-xl ml-4">Cargando zonas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center ">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="font-bold text-xl text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 md:p-6 space-y-6">
      {/* Header */}
      <div className="w-full flex items-center justify-between">
        <div>
          <h2 className="text-base md:text-3xl font-bold text-gray-900">Gestión de Zonas</h2>
          <p className="text-gray-600 mt-1 text-xs">
            Administración de zonas <span className='hidden md:block'>del sistema</span>
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
        onClick={() => setIsModalOpen(true)}
       className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-x-2 justify-center">
        <Plus className="w-4 h-4" />
          <p><span className="hidden md:block">Nueva</span>zona</p>

        </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Search className="w-4 h-4 inline mr-2" />
              Buscar Zona
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nombre..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
             Total zonas
            </label>
            <section className="w-full border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"> 
              <div className="flex items-center justify-between ">
            <div className='flex items-center gap-x-2'>
              <p className="text-sm text-gray-600 ">Total Zonas: </p>
              <p className="text-xl font-bold text-gray-900">{totalUsers}</p>
            </div>
            <div className="p-2 rounded-lg bg-emerald-500">
              <UsersIcon className="w-4 h-4 text-white" />
            </div>
          </div>
            </section>
          </div>
          
        </div>
      </div>


      {/* Users Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        { !loading && filteredUsers.map((zonas : any) => {
         
          return (
            <div key={zonas.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{zonas.nombre}</h3>
                  </div>
                </div>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-emerald-100 text-emerald-800 `}>
                 Zonas
                </span>
              </div>

            <div className="space-y-3">
              <section className='flex justify-between items-center'>
                 <div className="flex items-center justify-between">
                          <section className="text-sm text-gray-600 flex items-center gap-x-2">
                            <p className='flex items-center gap-x-1.5'>
                                <TicketCheck className="w-4 h-4 mr-1" />
                               <span>Casa:</span>
                            </p>
                               <span className="text-sm font-medium text-gray-900">{zonas.porcentaje_loteria}%</span>
                          </section>
                       
                        </div>
        
                        <div className="flex items-center justify-between">
                          <section className="text-sm text-gray-600 flex items-center gap-x-2">
                           <p className='flex items-center gap-x-1.5'>
                               <User className="w-4 h-4 mr-1" />
                             <span>Vendedor:</span>
                           </p>
                           <span className="text-sm font-medium text-gray-900">
                            {zonas.porcentaje_cliente}%
                          </span>
                          </section>
                         
                       </div>
              </section>
                     
                 <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            admin zona:
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {zonas.porcentaje_admin_zona}%
                          </span>
                       </div>

              <section className='flex items-center gap-x-3 justify-center'>
                  <div className="flex flex-col items-center justify-center bg-emerald-100 p-2 rounded-lg shadow-2xl border border-emerald-500">
                          <span className="text-sm text-emerald-800 font-bold ">
                          {isBrasil ? 'millar' : '  4 cifras'}
                          
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                          {isBrasil ? FormatCurrencyBR(zonas["milla"]) : FormatCurrencyCO(zonas["4cifras"])}
                     
                          </span>
                   </div>
                 <div className="flex flex-col items-center justify-center bg-emerald-100 p-2 rounded-lg shadow-2xl border border-emerald-500">
                          <span className="text-sm text-emerald-800 font-bold ">
                          {isBrasil ? 'Centena' : '  3 cifras'}
                         
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {isBrasil ? FormatCurrencyBR(zonas["centena"]) : FormatCurrencyCO(zonas["3cifras"])}
                        
                          </span>
                   </div>

                     <div className="flex flex-col items-center justify-center bg-emerald-100 p-2 rounded-lg shadow-2xl border border-emerald-500">
                          <span className="text-sm text-emerald-800 font-bold ">
                          {isBrasil ? 'Decena' : '  2 cifras'}
                            
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {isBrasil ? FormatCurrencyBR(zonas["decena"]) : FormatCurrencyCO(zonas["2cifras"])}
                       
                          </span>
                   </div>
              </section>

              <section className={`flex justify-center items-center gap-x-3 ${!isBrasil ? 'hidden' : ''}`}>
                  <div className="flex flex-col items-center justify-center bg-emerald-100 p-2 rounded-lg shadow-2xl border border-emerald-500">
                          <span className="text-sm text-emerald-800 font-bold ">
                           millar1a5
                          
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                          {FormatCurrencyBR(zonas["millar1a5"])}
                          </span>
                   </div>
                 <div className="flex flex-col items-center justify-center bg-emerald-100 p-2 rounded-lg shadow-2xl border border-emerald-500">
                          <span className="text-sm text-emerald-800 font-bold ">
                           
                           Centena1a5
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                          {FormatCurrencyBR(zonas["centena1a5"])}
                          </span>
                   </div>

                     <div className="flex flex-col items-center justify-center bg-emerald-100 p-2 rounded-lg shadow-2xl border border-emerald-500">
                          <span className="text-sm text-emerald-800 font-bold ">
                          Decena1a5
                            
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                          {FormatCurrencyBR(zonas["decena1a5"])}
                          </span>
                   </div>
              </section>

                  <section className={`flex justify-center items-center gap-x-3 ${isBrasil ? 'hidden' : ''}`}>
                
                 <div className="flex flex-col  items-center justify-center bg-emerald-100 p-2 rounded-lg shadow-2xl border border-emerald-500">
                          <span className="text-sm text-emerald-800 font-bold ">
                           
                            4 combi
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {FormatCurrencyCO(zonas["4combi"])}
                          </span>
                       </div>
                    
                   <div className="flex flex-col  items-center justify-center bg-emerald-100 p-2 rounded-lg shadow-2xl border border-emerald-500">
                          <span className="text-sm text-emerald-800 font-bold ">
                           
                            3 combi
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {FormatCurrencyCO(zonas["3combi"])}
                          </span>
                       </div>
                 </section>

              </div>
             

            
             <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex space-x-2">
                 
                    <button
                    onClick={() => setUpdateZonaSelected(zonas)}
                  className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1 cursor-pointer">
                    <Edit className="w-4 h-4" />
                    <span>Editar</span>
                </button>
                
                    <button
              onClick={(e) =>{
                e.stopPropagation(); // Esto previene la propagación
                setDeleteZonas(zonas);
              }}
              className="bg-red-50 hover:bg-red-100 text-red-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors cursor-pointer">
                      <Trash2 className="w-4 h-4" />
              </button>
                  
                </div>
              </div>
         
             
            </div>
          );
        })}
      </div>

        <ModalFromZonas 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

         {updateZonaSelected && (
                <ModalUpdateZonas
                  id={updateZonaSelected.id}
                  nombre={updateZonaSelected.nombre}
                  porcentaje_loteria={updateZonaSelected.porcentaje_loteria}
                  porcentaje_cliente={updateZonaSelected.porcentaje_cliente}
                  porcentaje_admin_zona={updateZonaSelected.porcentaje_admin_zona}
                  cuatroCifras={updateZonaSelected["4cifras"]}
                  tresCifras={updateZonaSelected["3cifras"]}
                  dosCifras={updateZonaSelected["2cifras"]}
                  cuatroCombi={updateZonaSelected["4combi"]}
                  tresCombi={updateZonaSelected["3combi"]}
                  pais={selectedCountry}
                  milla={updateZonaSelected["milla"]}
                  centena={updateZonaSelected["centena"]}
                  decena={updateZonaSelected["decena"]}
                  millar1a5={updateZonaSelected["millar1a5"]}
                  centena1a5={updateZonaSelected["centena1a5"]}
                  decena1a5={updateZonaSelected["decena1a5"]}
                  isOpen={!!updateZonaSelected}
                  onClose={() => setUpdateZonaSelected(null)}
                />
              )}
         {deleteZonas && (
              <ModalDeleteZonas
                id={deleteZonas.id}
                name={deleteZonas.nombre}
                isOpen={!!deleteZonas}
                onClose={() => setDeleteZonas(null)}
                
              />
            )}

    </div>
  );
};

