import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

const useMaximoValorTresCifras = () => {
  const [maximoValorTresCifras, setMaximoValorTresCifras] = useState(null);
  const [idsTres, setIdsTres] = useState([] as any); // Estado para almacenar los IDs
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { selectedCountry } = useAuth();

  async function fetchMaximoValor() {
    setLoading(true);

    // Seleccionamos tanto 'valor' como 'id' y ordenamos por valor descendente
    const { data, error } = await supabase
      .from("maximo_valor_tres_cifras")
      .select("id, valor")
      .eq("pais", selectedCountry)
      .order("valor", { ascending: false });

    setLoading(false);

    if (error) {
      console.error("Error fetching maximo_valor:", error);
      const errorMessage = error.message || "Ocurrió un error al obtener los resultados";
      setError(errorMessage);
    } else if (data && data.length > 0) {
      // Asigna el valor máximo y extrae todos los IDs
      setMaximoValorTresCifras(data[0].valor);
      setIdsTres(data.map((row) => row.id)); // Almacena todos los IDs
    } else {
      console.warn("No rows found in maximo_valor table.");
    }
  }

  useEffect(() => {
    fetchMaximoValor();
  }, [selectedCountry]);

  return {
    maximoValorTresCifras,
    setMaximoValorTresCifras,
    idsTres, // Retorna los IDs también
    loading,
    error,
  };
};

export default useMaximoValorTresCifras;
