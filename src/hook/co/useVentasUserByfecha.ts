import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";

interface VentasResponse {
    total_valor_bruta: number;
    total_venta_neta: number;
    total_ganancias: number;  
}

interface prop {
  fechaInicio: string;
  fechaFin: string;
  email: string;
}   
const useVentasUserByFecha = (fechaInicio : string, fechaFin : string, email : string) => {
 
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null as string | null);
  const [totales, setTotales] = useState<VentasResponse>({
    total_valor_bruta: 0,
    total_venta_neta: 0,
    total_ganancias: 0,
  });

  useEffect(() => {
    const fetchVentas = async () => {
      setLoading(true);
      try {
        // Llamar a la función almacenada
        const { data, error } = await supabase.rpc(
          "obtener_ventas_y_totales_app",
          {
            vendedor_email: email,
            fecha_inicio: fechaInicio,
            fecha_fin: fechaFin,
          }
        );

        if (error) throw error;

        // Desestructurar las ventas y los totales de la respuesta
        const { ventas: ventasData, totales: totalesData } = data[0] || {};
   

        setVentas(ventasData || []);
        setTotales(
          totalesData || {
            total_valor_bruta: 0,
            total_venta_neta: 0,
            total_ganancias: 0,
          }
        );
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Error desconocido";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (fechaInicio && fechaFin && email) {
      fetchVentas();
    }
  }, [fechaInicio, fechaFin, email]);

  return { ventas, loading, error, totales };
};

export default useVentasUserByFecha;
