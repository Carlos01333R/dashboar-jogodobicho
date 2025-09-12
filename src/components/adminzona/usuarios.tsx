'use client'
import React, { FormEvent, useState } from 'react';
import { Users as UsersIcon, Search, MapPin, Calendar } from 'lucide-react';
import { useUsuarios } from '@/hook/co/User';
import useZonas from '@/hook/co/useZonas';
import { ModalFrom } from '@/components/usuarios/ModalFrom';
import { ModalDelete } from '@/components/usuarios/ModalDelete';
import { ModalUpdate } from '@/components/usuarios/ModalUpdate';
import Link from 'next/link';
import { useAuthAdminZona } from '@/context/AuthContextAdminZona';

interface prop{
  submit: (e: FormEvent<Element>) => void
  updateUser: (form: { id: string; Nombre: string; Email: string; Telefono: string; Sector: string; Password: string; Estado: string; }) => void | Promise<void>
  Delete: (form: { id: string; }) => void | Promise<void>

}

export default function UsersComponentAdminZona({submit, updateUser, Delete}: prop) {
  const { user } = useAuthAdminZona()
  const zonaAdmin = user?.sector || ""
  const [searchTerm, setSearchTerm] = useState('')
  const { usuarios, loading, error } = useUsuarios();
  const { zonas, loading: loadingZonas, error: errorZonas } = useZonas();

  
  const filteredUsers = usuarios.filter(user => 
    ( user.sector === zonaAdmin) &&
    (searchTerm === '' || 
     user.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
  
  );
  const totalUsers = filteredUsers.length;



  if (loading) {
    return (
      <div className="flex justify-center items-center ">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        <p className="font-bold text-xl ml-4">Cargando usuarios...</p>
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

  if(zonaAdmin.length === 0) {
    return (
      <div className="flex justify-center items-center ">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="font-bold text-xl text-red-600 text-center">No hay zonas configuradas</p>
          <span className='text-gray-500 py-4'>Por favor, configure las zonas en la sección de zonas aqui: <Link href='/co/dashboard/zona/zonas' className='text-emerald-500 underline'>Configuración de zonas</Link></span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base md:text-3xl font-bold text-gray-900">Gestión de Usuarios</h2>
          <p className="text-gray-600 mt-1 text-xs md:text-base">
            Administración de usuarios <span className='hidden md:block'>del sistema</span>
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <ModalFrom onSubmit={submit} title='Usuario' />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Search className="w-4 h-4 inline mr-2" />
              Buscar Usuario
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
             Total usuarios
            </label>
            <section className="w-full border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"> 
              <div className="flex items-center justify-between ">
            <div className='flex items-center gap-x-2'>
              <p className="text-sm text-gray-600 ">Total Usuarios: </p>
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
        { !loading && filteredUsers.map((user) => {
         
          return (
            <div key={user.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
              
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{user.full_name}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800 `}>
                 Vendedor
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    Zona:
                  </span>
                  <span className="text-sm font-medium text-gray-900">{user.sector}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Creado:
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                     {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </div>

             
              </div>

              {/* Status Indicator */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">Estado de actividad</span>
                  <span className="text-xs text-green-600">{user.is_active ? 'Activo' : 'Inactivo'}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <ModalUpdate id={user.id} nombre={user.full_name} email={user.email} telefono={user.telefono} sector={user.sector} password={user.password}   estado={user.is_active.toString()} onSubmit={updateUser} title='Usuario' />
                    <ModalDelete name={user.full_name} id={user.id} onsubmit={Delete} title='Usuario' />
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

