import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
interface props{
     fecha: string;
    email: string;
}

export default function useObtenerDetallesWinUser(fecha: string, email: string) {

  const [data, setData] = useState([] as any);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Evitamos ejecutar si los parámetros están vacíos
    if (!fecha || !email) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase.rpc(
          "obtener_detalles_win_user",
          {
            fecha_inicio_param: fecha,
            fecha_fin_param: fecha,
            email_param: email,
          }
        );

        if (error) throw error;

        setData(data);
      } catch (error: any) {
        const errorMessage = error.message || "Ocurrió un error al obtener los detalles";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fecha, email]);

  return { data, loading, error };
}
