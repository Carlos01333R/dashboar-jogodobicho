"use client";

import { X, Calendar, CheckCircle } from "lucide-react";
interface DateModalProps {
  user: any;
  onClose: () => void;
  onDateChange: any;
  fechaDesde: string | null;
  fechaHasta: string | null;
  onContinue: () => void;
}
export default function DateModal({
  user,
  onClose,
  onDateChange,
  fechaDesde,
  fechaHasta,
  onContinue,
} : DateModalProps) {
  const handleDesdeChange = (e : any) => {
    const [year, month, day] = e.target.value.split("-");
    const selectedDate = new Date(year, month - 1, day);
    onDateChange.setFechaDesde(selectedDate);
  };

  const handleHastaChange = (e : any) => {
    const [year, month, day] = e.target.value.split("-");
    const selectedDate = new Date(year, month - 1, day);
    onDateChange.setFechaHasta(selectedDate);
  };

  const formatDate = (date : any) => {
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 backdrop-blur-xl  flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="md:text-2xl font-bold text-gray-800">
                  Seleccionar Fechas
                </h2>
                <p className="text-gray-600 text-xs md:text-base">
                  Usuario: <span className="font-semibold">{user?.email}</span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 text-center">
                Selecciona el rango de fechas para consultar
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Fecha Desde */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Fecha Desde
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="desde"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      onChange={handleDesdeChange}
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5  mr-3 text-gray-400 pointer-events-none" />
                  </div>
                  {fechaDesde && (
                    <p className="text-sm text-green-600 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      {formatDate(fechaDesde)}
                    </p>
                  )}
                </div>

                {/* Fecha Hasta */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Fecha Hasta
                  </label>
                  <div className="relative ">
                    <input
                      type="date"
                      name="hasta"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-black"
                      onChange={handleHastaChange}
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 mr-3 text-gray-400 pointer-events-none" />
                  </div>
                  {fechaHasta && (
                    <p className="text-sm text-green-600 flex items-center gap-x-2">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      {formatDate(fechaHasta)}
                    </p>
                  )}
                </div>
              </div>

              {/* Resumen de fechas seleccionadas */}
              {fechaDesde && fechaHasta && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200  hidden md:block">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    Rango seleccionado:
                  </h4>
                  <p className="text-blue-700">
                    Desde{" "}
                    <span className="font-semibold">
                      {formatDate(fechaDesde)}
                    </span>{" "}
                    hasta{" "}
                    <span className="font-semibold">
                      {formatDate(fechaHasta)}
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="w-full flex flex-row justify-between sm:flex-row gap-4 ">
              <button
                onClick={onClose}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={onContinue}
                disabled={!fechaDesde || !fechaHasta}
                className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
                  fechaDesde && fechaHasta
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Continuar
              </button>
            </div>
          </div>
        </>
      </div>
    </div>
  );
}
