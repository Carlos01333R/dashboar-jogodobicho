"use client";

import { useState } from "react";
import { Calculator, Save, AlertTriangle, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
interface PaymentCalculatorProps {
  ventaNetaTotal: number;
  userEmail: string;
  onMoraUpdated: (mora: number, actualizacion: string) => void;
}
export default function PaymentCalculator({
  ventaNetaTotal,
  userEmail,
  onMoraUpdated,
 } : PaymentCalculatorProps) {
  const [montoPagado, setMontoPagado] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" | "error" | "warning"

  const formatPesoCop = (value : number) => {
    if (value == null || isNaN(value)) {
      return "N/A";
    }
    return value.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const calcularMora = () => {
    const pago = Number.parseFloat(montoPagado) || 0;
    const diferencia = ventaNetaTotal - pago;
    return diferencia > 0 ? diferencia : 0;
  };

  const actualizarMora = async () => {
    if (!montoPagado || montoPagado === "") {
      setMessage("Por favor ingresa un monto válido");
      setMessageType("error");
      return;
    }

    const pago = Number.parseFloat(montoPagado);
    const moraCalculada = calcularMora();
    const currentTimestamp = new Date().toISOString(); // Obtener la fecha y hora actual

    setLoading(true);
    setMessage("");

    try {
      const { data, error } = await supabase
        .from("usuarios")
        .update({
          mora: moraCalculada,
          actualizacion: currentTimestamp, // Usar la fecha y hora actual
        })
        .eq("email", userEmail) // Usamos 'email' para la condición WHERE
        .select();

      if (error) {
        console.error("Error de Supabase:", error);
        setMessage(`Error al actualizar la mora: ${error.message}`);
        setMessageType("error");
      } else if (data.length === 0) {
        setMessage("Usuario no encontrado en la base de datos.");
        setMessageType("error");
      } else {
        setMessage(
          moraCalculada > 0
            ? `Mora actualizada: ${formatPesoCop(moraCalculada)}`
            : "Pago completo registrado correctamente"
        );
        setMessageType(moraCalculada > 0 ? "warning" : "success");

        // Notificar al componente padre con la nueva mora y la fecha de actualización
        if (onMoraUpdated) {
          onMoraUpdated(moraCalculada, currentTimestamp);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error de conexión al actualizar la mora");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const mora = calcularMora();
  const pago = Number.parseFloat(montoPagado) || 0;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-2 md:p-6 mb-8">
      <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <Calculator className="w-6 h-6 mr-3 text-blue-600" />
        Calculadora de Pagos
      </h4>

      <div className="">
        {/* Información de totales */}
        <div className="flex flex-col md:flex-row items-center gap-2 py-2">
          <div className="w-full md:w-[48%] bg-blue-50 rounded-lg py-7 px-4 border border-blue-200">
            <p className="text-sm text-gray-600 mb-1">
              Total a pagar (incl. mora)
            </p>
            <p className="text-2xl font-bold text-blue-600">
              {formatPesoCop(ventaNetaTotal)}
            </p>
          </div>

          <div className="w-full md:w-[48%] bg-gray-50 rounded-lg p-4 border border-gray-200">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Monto pagado
            </label>
            <input
              type="number"
              value={montoPagado}
              onChange={(e) => setMontoPagado(e.target.value)}
              placeholder="Ingresa el monto pagado"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Resultados del cálculo */}
        <div className="space-y-4">
          {pago > 0 && (
            <section className="w-full grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <p className="text-sm text-gray-600 mb-1">Monto pagado</p>
                <p className="text-xl font-bold text-green-600">
                  {formatPesoCop(pago)}
                </p>
              </div>

              <div
                className={`rounded-lg p-4 border ${
                  mora > 0
                    ? "bg-red-50 border-red-200"
                    : "bg-green-50 border-green-200"
                }`}
              >
                <p className="text-sm text-gray-600 mb-1">
                  {mora > 0 ? "Mora pendiente" : "Estado"}
                </p>
                <p
                  className={`text-xl font-bold ${
                    mora > 0 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {mora > 0 ? formatPesoCop(mora) : "Pago completo"}
                </p>
              </div>

              {/* Diferencia/Exceso */}
              {pago > ventaNetaTotal && (
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <p className="text-sm text-gray-600 mb-1">Exceso pagado</p>
                  <p className="text-xl font-bold text-yellow-600">
                    {formatPesoCop(pago - ventaNetaTotal)}
                  </p>
                </div>
              )}
            </section>
          )}
        </div>
      </div>

      {/* Botón de guardar */}
      <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-end items-center">
        <button
          onClick={actualizarMora}
          disabled={loading || !montoPagado}
          className={`flex items-center gap-3 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            loading || !montoPagado
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl"
          }`}
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <Save className="w-5 h-5" />
          )}
          {loading ? "Guardando..." : "Guardar pago"}
        </button>

        {/* Mensaje de estado */}
        {message && (
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              messageType === "success"
                ? "bg-green-100 text-green-700 border border-green-200"
                : messageType === "warning"
                ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                : "bg-red-100 text-red-700 border border-red-200"
            }`}
          >
            {messageType === "success" && <CheckCircle className="w-5 h-5" />}
            {messageType === "warning" && <AlertTriangle className="w-5 h-5" />}
            {messageType === "error" && <AlertTriangle className="w-5 h-5" />}
            <span className="text-sm font-medium">{message}</span>
          </div>
        )}
      </div>

      {/* Información adicional */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-600">
          <strong>Usuario:</strong> {userEmail}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          La mora se actualizará automáticamente en la base de datos cuando
          guardes el pago.
        </p>
      </div>
    </div>
  );
}
