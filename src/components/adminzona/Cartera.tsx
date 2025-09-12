"use client";
import useZonas from "@/hook/adminZona/useZonas";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import useAdmin from "@/hook/co/useAdmin";
import DateModal from "../cartera/DataModal";
import ResultsView from "../cartera/Resuls-View";
import { useAuthAdminZona } from "@/context/AuthContextAdminZona";
import ResultsViewBR from "../cartera/Resuls-ViewBr";


export default function CarteraAdminZona() {
  const { zonas, loading, error } = useZonas();
  const [selectedZona, setSelectedZona] = useState("");
  const [filterName, setFilterName] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [fechaDesde, setFechaDesde] = useState(null as any);
  const [fechaHasta, setFechaHasta] = useState(null as any);
  const [showResults, setShowResults] = useState(false);
  const { selectedCountry, user: userAdmin } = useAuthAdminZona();
  const zonaAdmin = userAdmin?.sector || ""

  const {
    user,
    loading: loadingAdmin,
    error: errorAdmin,
  } = useAdmin(selectedZona);

  const filterNameAdmin = (user : any) => {
    if (!user) return [];
    if (filterName === null) return user;
    return user.filter((user : any) =>
      user.full_name.toLowerCase().includes(filterName.toLowerCase())
    );
  };

  const FilterAdmin = filterNameAdmin(user);

  const handleUserSelect = (usuario : any) => {
    // Encontrar la zona correspondiente
    const zonaData = zonas.find((zona : any) => zona.nombre === selectedZona);

    // Crear el usuario con los datos de la zona
    const usuarioConZona = {
      ...usuario,
      porcentaje_loteria: zonaData?.porcentaje_loteria || 0,
      porcentaje_cliente: zonaData?.porcentaje_cliente || 0,
      porcentaje_admin_zona: zonaData?.porcentaje_admin_zona || 0,
      zona_2cifras: zonaData?.["2cifras"] || 0,
      zona_3cifras: zonaData?.["3cifras"] || 0,
      zona_3combi: zonaData?.["3combi"] || 0,
      zona_4cifras: zonaData?.["4cifras"] || 0,
      zona_4combi: zonaData?.["4combi"] || 0,
    };

    setSelectedUser(usuarioConZona);
    setShowModal(true);
    setFechaDesde(null);
    setFechaHasta(null);
    setShowResults(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setFechaDesde(null);
    setFechaHasta(null);
    setShowResults(false);
  };

  const handleContinue = () => {
    if (fechaDesde && fechaHasta) {
      setShowModal(false);
      setShowResults(true);
    }
  };

  const handleBackToUsers = () => {
    setShowResults(false);
    setSelectedUser(null);
    setFechaDesde(null);
    setFechaHasta(null);
  };

  const handleBackToZones = () => {
    setSelectedZona("");
    setShowResults(false);
    setSelectedUser(null);
    setFechaDesde(null);
    setFechaHasta(null);
  };

  const handleNewQuery = () => {
    setSelectedUser(null);
    setShowModal(true);
    setFechaDesde(null);
    setFechaHasta(null);
  };


  const FilterZona = zonas.filter((zona : any) =>
    zona.nombre.toLowerCase().includes(zonaAdmin.toLowerCase())
  );




  // Estados de carga y error
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="font-bold text-xl ml-4">Cargando zonas...</p>
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

  if (!loading && (!zonas || zonas.length === 0)) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="font-bold text-sm text-yellow-700">
            No hay zonas disponibles. Por favor, inténtalo más tarde.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full min-h-screen  bg-gray-50 rounded-xl">
     

      {selectedZona === "" ? (
        <>
        <p className="p-4 text-xl md:text-2xl font-bold text-center ">Seleccione una zona</p>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6  p-4">
          {FilterZona.map((zona : any) => (
            <button
              onClick={() => setSelectedZona(zona.nombre)}
              key={zona.id}
              className="bg-white shadow-lg rounded-xl overflow-hidden hover:scale-105 hover:shadow-xl transition-all duration-300 border border-gray-200 cursor-pointer"
            >
              <img
                src="https://trayectoriasenviaje.com/wp-content/uploads/2022/05/que-hacer-cartagena-entrada_ciudad_amurallada.jpg"
                alt={zona.nombre}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <p className="text-xl font-bold text-gray-800">{zona.nombre}</p>
              </div>
            </button>
          ))}
        </div>
        </>
      ) : showResults ? (
      
        selectedCountry === 'brazil' ? (
          <ResultsViewBR
            selectedUser={selectedUser}
            fechaDesde={fechaDesde}
            fechaHasta={fechaHasta}
            selectedZona={selectedZona}
            onBackToUsers={handleBackToUsers}
            onBackToZones={handleBackToZones}
            onNewQuery={handleNewQuery}
          />
        ) : (
          <ResultsView
            selectedUser={selectedUser}
            fechaDesde={fechaDesde}
            fechaHasta={fechaHasta}
            selectedZona={selectedZona}
            onBackToUsers={handleBackToUsers}
            onBackToZones={handleBackToZones}
            onNewQuery={handleNewQuery}
          />
        )
      ) : (
        <section className="w-full py-5 px-3">
          <button
            onClick={handleBackToZones}
            className="bg-gray-800 text-white rounded-lg px-6 py-3 mb-6 flex items-center gap-3 hover:bg-gray-700 transition-colors shadow-md cursor-pointer"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Volver a zonas</span>
          </button>

          <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Zona seleccionada:{" "}
              <span className="text-blue-600">{selectedZona}</span>
            </h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por nombre..."
                className="bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                onChange={(e) => setFilterName(e.target.value)}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </div>
            </div>
          </div>

          {errorAdmin && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-lg">
              <p className="font-medium">
                Error al cargar usuarios: {errorAdmin}
              </p>
            </div>
          )}

          {loadingAdmin ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="font-medium ml-4">Cargando usuarios...</p>
            </div>
          ) : (
            <>
              {!user || user.length === 0 ? (
                <div className="text-center py-20">
                  <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">👥</span>
                  </div>
                  <p className="text-gray-500 text-lg">
                    No hay usuarios disponibles en esta zona.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {FilterAdmin.map((usuario : any) => (
                    <div
                      key={usuario.id}
                      onClick={() => handleUserSelect(usuario)}
                      className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200 hover:border-blue-300"
                    >
                      <div className="flex items-center mb-4">
                        <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                          <span className="text-blue-600 font-bold text-lg">
                            {usuario.full_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <h3 className="font-bold text-lg text-gray-800">
                          {usuario.email}
                        </h3>
                      </div>
                      <div className="space-y-2">
                       
                        <p className="text-gray-600 flex items-center">
                          <span className="font-semibold mr-2">📍</span>
                          {usuario.sector}
                        </p>
                         <p className="text-gray-600 flex items-center text-xs">
                          <span className="font-semibold mr-2">📅</span>
                          {usuario.created_at}
                        </p>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <span className="text-sm text-blue-600 font-medium">
                          Click para seleccionar fechas →
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      )}

      {/* Modal */}
      {showModal && (
        <DateModal
          user={selectedUser}
          onClose={handleCloseModal}
          onDateChange={{ setFechaDesde, setFechaHasta }}
          fechaDesde={fechaDesde}
          fechaHasta={fechaHasta}
          onContinue={handleContinue}
        />
      )}
    </section>
  );
}
