"use client";

import { ArrowLeft } from "lucide-react";
import useVentasUserByFecha from "@/hook/co/useVentasUserByfecha";
import PaymentCalculator from "./Payment-Calculator";
import { useState, useCallback, useEffect, useMemo } from "react"; // Importa 
import { formatDateToMMDDYYYYBrasil, formatDateToMMDDYYYYBR} from "@/utils/date-utils";
import { useApuestasUsuario } from "@/hook/br/useVentasUserByFecha";
import { FormatCurrencyBR } from "@/utils/Format";



interface ResultsViewProps {
  selectedUser: any;
  fechaDesde:  Date;
  fechaHasta:  Date;
  selectedZona: string;
  onBackToUsers: () => void;
  onBackToZones: () => void;
  onNewQuery: () => void;
}
export default function ResultsViewBR({
  selectedUser,
  fechaDesde,
  fechaHasta,
  selectedZona,
  onBackToUsers,
  onBackToZones,
  onNewQuery,
}: ResultsViewProps) {
  // Estados locales para la mora y la última actualización
  const [currentMora, setCurrentMora] = useState(selectedUser?.mora ?? 0);
  const [lastUpdated, setLastUpdated] = useState(selectedUser?.actualizacion);
   const { data, loading, error, fetchApuestasUsuario } = useApuestasUsuario();


  // Sincronizar estados locales con props cuando selectedUser cambie
  useEffect(() => {
    setCurrentMora(selectedUser?.mora ?? 0);
    setLastUpdated(selectedUser?.actualizacion);
  }, [selectedUser]);

  const formatDate = (date : any) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatDateTime = (isoString : string) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return date.toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const email = selectedUser?.email;
  const desde = formatDateToMMDDYYYYBrasil(fechaDesde);
  const hasta = formatDateToMMDDYYYYBrasil(fechaHasta);



 useEffect(() => {
    if (selectedUser?.email && fechaDesde && fechaHasta) {
      fetchApuestasUsuario(email, desde, hasta);
    }
  }, [selectedUser?.email, fechaDesde, fechaHasta, fetchApuestasUsuario]);



  const formatPesoCop = (value : number) => {
    if (value == null || isNaN(value)) {
      return "N/A"; // Retorna un valor por defecto si es nulo o no es un número
    }
    return value.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  // 1. Función para obtener la fecha actual en Colombia (UTC-5)
  const getCurrentColombiaDate = () => {
    const now = new Date();
    // Ajustar a UTC-5 (Colombia)
    now.setHours(now.getHours() - 5);
    return now;
  };

  // 2. Normalizar fechas para comparar solo día, mes y año (sin horas/minutos)
  const normalizeToDate = (date : Date) => {
    const d = new Date(date);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  };

  // 3. Lógica de comparación
  const fechaActualizacion = lastUpdated ? new Date(lastUpdated) : null;
  const hoyColombia = getCurrentColombiaDate();
  const esHoy = useMemo(() => {
    if (!lastUpdated) return false;
    const fechaActualizacion = new Date(lastUpdated);
    const hoyColombia = getCurrentColombiaDate();
    return (
      normalizeToDate(fechaActualizacion).getTime() ===
      normalizeToDate(hoyColombia).getTime()
    );
  }, [lastUpdated, getCurrentColombiaDate, normalizeToDate]);

  // Debug: Verificar fechas
  useEffect(() => {
    console.log("Comparación de fechas:", {
      actualizacion: lastUpdated,
      hoyColombia: getCurrentColombiaDate(),
      esHoy,
      normalizadoActualizacion: lastUpdated
        ? normalizeToDate(new Date(lastUpdated))
        : null,
      normalizadoHoy: normalizeToDate(getCurrentColombiaDate()),
    });
  }, [esHoy, lastUpdated]);

  const VentaBruta = data?.totales.total_monto ?? 0;
  const VentaNeta = (VentaBruta * selectedUser?.porcentaje_loteria) / 100;
  const Ganancias = (VentaBruta * selectedUser?.porcentaje_cliente) / 100;
  const GananciasAdmin =
    (VentaBruta * selectedUser?.porcentaje_admin_zona) / 100;

  // Total a entregar para el PERIODO ACTUAL (sin mora anterior)
  const totalPeriodoActual = esHoy
    ? 0 + currentMora
    : VentaNeta + GananciasAdmin;
  const TotalAnterior = VentaNeta + GananciasAdmin;

  // Total que se debe pagar al calculador (incluye mora actual)
  const totalParaCalculadora = esHoy
    ? currentMora
    : totalPeriodoActual + currentMora;

  // Callback para actualizar la mora y la fecha de actualización
  const handleMoraUpdated = useCallback((nuevaMora : number, nuevaActualizacion : string) => {
    setCurrentMora(nuevaMora);
    setLastUpdated(nuevaActualizacion);
  }, []);

  return (
    <section className="w-full md:py-5 px-3">
      <button
        onClick={onBackToZones}
        className="bg-gray-800 text-white rounded-lg py-1 px-2 md:px-6 md:py-3 mb-6 flex items-center gap-3 hover:bg-gray-700 transition-colors shadow-md cursor-pointer"
      >
        <ArrowLeft size={20} />
        <span className="font-medium">Volver a zonas</span>
      </button>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Resultados <span className="hidden md:block"> de Consulta</span>
          </h2>
          <div className="text-sm text-gray-600">
            Zona:{" "}
            <span className="font-semibold text-blue-600">{selectedZona}</span>
          </div>
        </div>
        {/* Información del usuario y fechas */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-2 md:p-6 mb-8 border border-blue-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center mr-3">
              📋
            </span>
            Información de la Consulta
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Usuario</p>
              <p className="font-semibold text-gray-800 text-lg">
                {selectedUser?.email}
              </p>
            </div>
            <section className="flex md:hidden flex-row items-center gap-x-2">
              <div className="w-[48%] bg-white rounded-lg p-4 shadow-sm ">
                <p className="text-sm text-gray-600 mb-1">Teléfono</p>
                <p className="font-semibold text-gray-800">
                  {selectedUser?.telefono}
                </p>
              </div>
              <div className="w-[48%] bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-600 mb-1">Sector</p>
                <p className="font-semibold text-gray-800">
                  {selectedUser?.sector}
                </p>
              </div>
            </section>

            <div className="hidden md:block bg-white rounded-lg p-4 shadow-sm ">
              <p className="text-sm text-gray-600 mb-1">Teléfono</p>
              <p className="font-semibold text-gray-800">
                {selectedUser?.telefono}
              </p>
            </div>
            <div className="hidden md:block bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Sector</p>
              <p className="font-semibold text-gray-800">
                {selectedUser?.sector}
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Rango de fechas</p>
              <p className="font-semibold text-gray-800 text-sm">
                {fechaDesde &&
                  fechaHasta &&
                  `${formatDateToMMDDYYYYBrasil(fechaDesde)} - ${formatDateToMMDDYYYYBrasil(fechaHasta)}`}
              </p>
            </div>
          </div>
          {/* Nueva sección de porcentajes */}
          <div className="border-t border-blue-200 pt-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <span className="bg-green-100 rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm">
                %
              </span>
              Configuración de Porcentajes
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <section className="w-full  flex md:hidden flex-row items-center gap-x-2">
                <div className="w-[48%] bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
                  <p className="text-sm text-gray-600 mb-1">Lotería</p>
                  <p className="font-bold text-blue-600 text-xl">
                    {selectedUser?.porcentaje_loteria}%
                  </p>
                </div>
                <div className="w-[48%] bg-white rounded-lg p-4 shadow-sm border-l-4 border-green-500">
                  <p className="text-sm text-gray-600 mb-1">Usuario</p>
                  <p className="font-bold text-green-600 text-xl">
                    {selectedUser?.porcentaje_cliente}%
                  </p>
                </div>
              </section>

              <div className="hidden md:block bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
                <p className="text-sm text-gray-600 mb-1">Lotería</p>
                <p className="font-bold text-blue-600 text-xl">
                  {selectedUser?.porcentaje_loteria}%
                </p>
              </div>
              <div className="hidden md:block bg-white rounded-lg p-4 shadow-sm border-l-4 border-green-500">
                <p className="text-sm text-gray-600 mb-1">Usuario</p>
                <p className="font-bold text-green-600 text-xl">
                  {selectedUser?.porcentaje_cliente}%
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-purple-500">
                <p className="text-sm text-gray-600 mb-1">Admin Zona</p>
                <p className="font-bold text-purple-600 text-xl">
                  {selectedUser?.porcentaje_admin_zona}%
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Área de resultados */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          {/* Header de resultados */}
          {/* Contenido de resultados */}
          <div className="p-2 md:p-8">
            <section className="w-full flex justify-end items-center py-3 ">
              <p className="text-xs text-gray-500">
                Ultimo pago realizado el {formatDateTime(lastUpdated)}
              </p>
            </section>
            {/* Tarjetas de resumen */}
            <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 md:p-6 text-center border border-blue-200">
                <div className="text-2xl md:text-4xl font-bold text-blue-600 mb-2 truncate">
                  {FormatCurrencyBR(VentaBruta)}
                </div>
                <p className="text-gray-700 font-medium">Venta bruta</p>
                <p className="text-xs text-gray-500 ">Ventas totales</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 md:p-6 text-center border border-green-200">
                <div className="text-2xl md:text-4xl font-bold text-green-600 mb-2">
                  {FormatCurrencyBR(Ganancias)}
                </div>
                <p className="text-gray-700 font-medium">Ganancias</p>
                <p className="text-xs text-gray-500">Ganancias totales</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 md:p-6 text-center border border-purple-200">
                <div className="text-2xl md:text-4xl font-bold text-purple-600 mb-2">
                  {FormatCurrencyBR(totalPeriodoActual)}
                </div>
                <p className="text-gray-700 font-medium">Total a entregar</p>
                <p className="text-xs text-gray-500 mt-1">
                  Total correspondiente al{" "}
                  {selectedUser.porcentaje_loteria +
                    selectedUser.porcentaje_admin_zona}{" "}
                  %
                  {esHoy && (
                    <span>
                      <p>
                        Ya entregado{" "}
                        {FormatCurrencyBR(TotalAnterior - currentMora)}
                      </p>
                    </span>
                  )}
                </p>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 md:p-6 text-center border border-red-200">
                <div className="text-2xl md:text-4xl font-bold text-red-600 mb-2">
                  {FormatCurrencyBR(currentMora)}
                </div>
                <p className="text-gray-700 font-medium">Mora</p>
                <p className="text-xs text-gray-500 mt-1">Mora actual</p>
              </div>
            </div>
            {/* Tabla de resultados */}
            <div className="bg-gray-50 rounded-xl p-2 md:p-6">
              <PaymentCalculator
                ventaNetaTotal={totalParaCalculadora} // Pasa el total incluyendo la mora actual
                userEmail={selectedUser?.email}
                onMoraUpdated={handleMoraUpdated}
              />
            </div>
          </div>
        </div>
        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button
            onClick={onBackToUsers}
            className="flex items-center justify-center gap-3 px-8 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium shadow-lg cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver a usuarios
          </button>
        </div>
      </div>
    </section>
  );
}
