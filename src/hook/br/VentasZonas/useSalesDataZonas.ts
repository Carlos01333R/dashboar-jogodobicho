
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Props {
  zona: string;
}
const useZonaSummary = ({zona}: Props) => {
  const [data, setData] = useState([] as any);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVentas = async () => {
      setLoading(true);
      setError('');

      try {
        const { data, error } = await supabase.rpc(
          "sumar_por_zona_br",
          {p_zona: zona }
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

export default useZonaSummary;
