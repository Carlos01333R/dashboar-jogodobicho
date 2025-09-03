import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Props {
  zona: string;
}
const useSumRewards = ({zona} : Props) => {
  const [total, setTotal] = useState(null as any);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!zona) return;

    const fetchSum = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from("win") // Cambia esto por el nombre de tu tabla
          .select("premio")
          .eq("zona", zona);

        if (error) throw error;

        const totalSum = data.reduce((sum, row) => {
          const premio = parseFloat(row.premio) || 0; // Convertir a número o asignar 0 si no es válido
          return sum + premio;
        }, 0);
        setTotal(totalSum);
      } catch (err : any) {
        const errorMessage = err.message || "Ocurrió un error al obtener los resultados";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchSum();
  }, [zona]);

  return { total, loading, error };
};

export default useSumRewards;
