'use client'
import React, { useState } from 'react';
import { Users as UsersIcon, Search, MapPin, Calendar, Trash2, Plus } from 'lucide-react';
import useAdminZonas from '@/hook/co/useAdminZonas';
import ModalFrom from '../usuarios/ModalFrom';
import ModalDelete from '../usuarios/ModalDelete';
import ModalUpdate from '../usuarios/ModalUpdate';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import useZonas from '@/hook/co/useZonas';
import { Button } from '../ui/button';

export default function AdminZonasComponent() {
  const [searchTerm, setSearchTerm] = useState('')
  const [sector , setSector] = useState('all');
  const { zonas, loading, error } = useAdminZonas();
  const { zonas: sectores } = useZonas();
  const [open, setOpen] = useState(false);
   const [openForm, setOpenForm] = useState(false);
    const [deleteUser, setDeleteUser] = useState<any | null>(null);
    const [updateUserSelected, setUpdateUserSelected] = useState<any | null>(null);



  
  const filteredUsers = zonas.filter((zona : any) =>
    (sector === 'all' || zona.sector === sector) &&
    (searchTerm === '' || 
     zona.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
  
  );

  const totalUsers = filteredUsers.length;

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const nombre = formData.get("nombre");
    const email = formData.get("email");
    const sector = formData.get("sector");
    const password = formData.get("password");
    const telefono = formData.get("telefono");
    const confirm_password = formData.get("confirm_password");
  
    if (
      nombre === "" ||
      email === "" ||
      sector === "" ||
      password === "" ||
      confirm_password === ""
    ) {
      toast.error("Complete los campos requeridos");
      return;
    }

    if (password !== confirm_password) {
      toast.error("Contraseñas no coinciden");
      return;
    }

    const { data, error } = await supabase
      .from("admin_zona")
      .insert([
        {
          email: email,
          nombre: nombre,
          telefono: telefono,
          password: password,
          sector: sector,
          is_active: "TRUE",
         
        },
      ])
      .select();

    if (error) {
      console.error("Error inserting data:", error.message);
    } else {
      toast.success("Administrador Agregado Correctamente");
      e.target.reset();
      window.location.reload();
    }
  };

  const handleUpdateUser = async (form : any) => {
  const { id, Nombre, Email, Telefono, Sector, Password, Estado } = form;

  if(id === "" || Nombre === "" || Email === "" || Telefono === "" || Sector === "" || Password === "" || Estado === "") {
    toast.error("Complete todos los campos");
    return;
  }

  const { error } = await supabase
    .from("admin_zona")
    .update({
      nombre: Nombre,
      email: Email,
      telefono: Telefono,
      password: Password,
      sector: Sector,
      is_active: Estado === "TRUE",
    })
    .eq("id", id);

  if (error){
toast.error("Error al actualizar");
  } 
  else{
 toast.success("Administrador actualizado");
window.location.reload(); // recarga toda la página

  }
  };

   const handleDelete = async (from : any) => {
    const { id } = from;
    const { error } = await supabase.from("admin_zona").delete().eq("id", id);

    if (error) {
      console.error("Error deleting data:", error.message);
      toast.error("Error deleting data");
    } else {
      toast.success("Administrador Eliminado Correctamente");
      window.location.reload();
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center ">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        <p className="font-bold text-xl ml-4">Cargando administradores...</p>
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

  if(sectores.length === 0) {
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
         <button
                onClick={() => setOpenForm(true)}
                className="flex items-center gap-x-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg"
              >
                <Plus className="w-4 h-4" />
                <p><span className="hidden md:block">Nuevo</span> Administrador</p>
              </button>
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
              Ordenar por zonas
            </label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" onChange={(e) => setSector(e.target.value)}>
                <option value="all">Todos los sectores</option>
             {sectores.map((zona : any) => (
              <option value={zona.nombre} key={zona.id}>{zona.nombre}</option>
            ))}
               
            </select>
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
        { !loading && filteredUsers.map((zonas : any) => {
         
          return (
            <div key={zonas.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
              
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{zonas.nombre}</h3>
                    <p className="text-sm text-gray-500">{zonas.email}</p>
                  </div>
                </div>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800 `}>
                 Administrador
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    Zona:
                  </span>
                  <span className="text-sm font-medium text-gray-900">{zonas.sector}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Creado:
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                     {new Date(zonas.created_at).toLocaleDateString()}
                  </span>
                </div>

             
              </div>

              {/* Status Indicator */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">Estado de actividad</span>
                  <span className="text-xs text-green-600">{zonas.is_active ? 'Activo' : 'Inactivo'}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                </div>
              </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex space-x-2">
                              {/* EDITAR */}
                              <button
                                className='bg-emerald-500  text-emerald-50 py-2 px-3 rounded-lg'
                              onClick={() => setUpdateUserSelected(zonas)}>
                                Editar Usuario
                              </button>
              
                              {/* ELIMINAR */}
                              <button
                                onClick={() => setDeleteUser(zonas)}
                                className="bg-red-50 hover:bg-red-100 text-red-700 py-2 px-3 rounded-lg"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
            </div>
          );
        })}
      </div>

        <ModalFrom
         title="administrador"
         onSubmit={handleSubmit}
         isOpen={openForm}
         onClose={() => setOpenForm(false)}
       />

       
             {/* MODAL UPDATE */}
             {updateUserSelected && (
               <ModalUpdate
                 id={updateUserSelected.id}
                 nombre={updateUserSelected.nombre}
                 email={updateUserSelected.email}
                 telefono={updateUserSelected.telefono}
                 sector={updateUserSelected.sector}
                 password={updateUserSelected.password}
                 estado={updateUserSelected.is_active.toString()}
                 onSubmit={handleUpdateUser}
                 title="Usuario"
                 isOpen={!!updateUserSelected}
                 onClose={() => setUpdateUserSelected(null)}
               />
             )}
       
             {/* MODAL DELETE */}
             {deleteUser && (
               <ModalDelete
                 id={deleteUser.id}
                 name={deleteUser.full_name}
                 title="usuario"
                 isOpen={!!deleteUser}
                 onClose={() => setDeleteUser(null)}
                 onsubmit={handleDelete}
               />
             )}

 
    </div>
  );
};

