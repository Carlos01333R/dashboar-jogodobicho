import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

const useNumerosBloqueados = () => {
  const [numerosBloqueados, setNumerosBloqueados] = useState([] as any);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { selectedCountry } = useAuth();

  async function getCountries() {
    setLoading(true);
    const { data, error } = await supabase.from("bloquear_number").select().eq("pais", selectedCountry);
  

    if (error) {
        const errorMessage = error.message || "Ocurrió un error al obtener los resultados";
      setError(errorMessage);
      console.error("Error fetching data:", error.message);
    } else {
      setLoading(false);
      setNumerosBloqueados(data);
    }
  }

  useEffect(() => {
    getCountries();
  }, [selectedCountry]);

  return {
    numerosBloqueados,
    setNumerosBloqueados,
    loading,
    error,
  };
};

export default useNumerosBloqueados;
