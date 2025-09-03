import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Props {
  zona: string;
}
const useVentasPorZona = ({zona}: Props) => {
  const [data, setData] = useState([] as any);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVentas = async () => {
      setLoading(true);
      setError('');

      try {
        const { data, error } = await supabase.rpc(
          "obtener_totales_y_porcentajes_por_zona",
          { zona_param: zona }
        );

        if (error) throw error;

        setData(data);
      } catch (err : any) {
        const errorMessage = err.message || "Ocurrió un error al obtener los resultados";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (zona) {
      fetchVentas();
    }
  }, [zona]);

  return { data, loading, error };
};

export default useVentasPorZona;
