import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

// Helper para convertir fechas de DD/MM/YYYY a YYYY-MM-DD
function formatDateToYMD({fecha} : any) {
  const [day, month, year] = fecha.split("/");
  return `${year}-${month}-${day}`; // No necesitas este helper ya que trabajamos con DD/MM/YYYY
}

interface Props {
  desde: string;
  hasta: string;
  zona: string;
}
export default function usePremioByFecha({desde, hasta, zona} : Props) {
  const [premio, setPremio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log(desde, hasta, zona);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null); // Reinicia el error al comenzar la carga
      try {
        // Las fechas se pasan directamente en formato DD/MM/YYYY
        const { data, error } = await supabase.rpc("obtener_total_premio", {
          fecha_inicio_param: desde,
          fecha_fin_param: hasta,
          zona_param: zona,
        });

        if (error) throw error;

        setPremio(data);
      } catch (err : any) {
        const errorMessage = err.message || "Ocurrió un error al obtener los resultados";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (desde && hasta && zona) fetchData();
  }, [desde, hasta, zona]);

  return { premio, loading, error };
}
