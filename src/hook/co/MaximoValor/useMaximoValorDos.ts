import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
const useMaximoValorDosCifras = () => {
  const [maximoValorDosCifras, setMaximoValorDosCifras] = useState(null);
  const [idsDos, setIdsDos] = useState([] as any); // Estado para almacenar los IDs
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { selectedCountry } = useAuth();

  async function fetchMaximoValor() {
    setLoading(true);

    // Seleccionamos tanto 'valor' como 'id' y ordenamos por valor descendente
    const { data, error } = await supabase
      .from("maximo_valor_dos_cifras")
      .select("id, valor")
      .order("valor", { ascending: false });

    setLoading(false);

    if (error) {
      console.error("Error fetching maximo_valor:", error);
      const errorMessage = error.message || "Ocurrió un error al obtener los resultados";
      setError(errorMessage);
    } else if (data && data.length > 0) {
      // Asigna el valor máximo y extrae todos los IDs
      setMaximoValorDosCifras(data[0].valor);
      setIdsDos(data.map((row) => row.id)); // Almacena todos los IDs
    } else {
      console.warn("No rows found in maximo_valor table.");
    }
  }

  useEffect(() => {
    fetchMaximoValor();
  }, []);

  return {
    maximoValorDosCifras,
    setMaximoValorDosCifras,
    idsDos, // Retorna los IDs también
    loading,
    error,
  };
};

export default useMaximoValorDosCifras;
