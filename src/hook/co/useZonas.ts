/* eslint-disable react-hooks/exhaustive-deps */
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";


const useZonas = () => {
  const [zonas, setZonas] = useState([] as any);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null as string | null);

  async function getCountries() {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("zonas").select();

      if (error) {
        const errorMessage = error instanceof Error ? error.message : "Error desconocido";
        setError(errorMessage);
        setZonas([]); // Establece un array vacío como fallback
      } else {
        setZonas(data) ;
      }
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      setZonas([]); // Establece un array vacío como fallback
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getCountries();
  }, []);

  return {
    zonas,
    loading,
    error,
    setZonas,
  };
};

export default useZonas;
