import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";


export default function usePremioUserByFecha(desde : string, hasta : string, email : string) {
  const [premio, setPremio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null as string | null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null); // Reinicia el error al comenzar la carga
      try {
        // Las fechas se pasan directamente en formato DD/MM/YYYY
        const { data, error } = await supabase.rpc(
          "obtener_total_premio_user",
          {
            fecha_inicio_param: desde,
            fecha_fin_param: hasta,
            email_param: email,
          }
        );

        if (error) throw error;

        setPremio(data);
      } catch (err) {
        const errMessage = err instanceof Error ? err.message : "Error desconocido";
        setError(errMessage);
      } finally {
        setLoading(false);
      }
    };

    if (desde && hasta && email) fetchData();
  }, [desde, hasta, email]);

  return { premio, loading, error };
}
