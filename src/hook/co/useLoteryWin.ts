import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const useLoteriaComparisonNew = () => {
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para agrupar por número de venta
  const agruparPorNumeroVenta = (datos = []) => {
    const agrupados = {} as Record<string, any>;

    datos.forEach((item : any) => {
      if (!agrupados[item.numero_venta]) {
        agrupados[item.numero_venta] = {
          numero_venta: item.numero_venta,
          vendedor: item.email,
          zona: item.zona,
          nombre: item.nombre,
          celular: item.celular,
          fecha: item.fecha,
          hora: item.hora,
          fecha_hora: item.fecha_hora,
          venta_total: item.venta,
          boletos: [],
          loterias: new Set(),
          premio_total: 0,
          detalles: [],
        };
      }

      const grupo = agrupados[item.numero_venta];
      grupo.boletos.push({
        numero: item.boleto,
        resultado: item.result,
        premio: item.premio || 0,
        match2: item.match2,
        match3: item.match3,
        match4: item.match4,
        lottery: item.lottery,
        combi: item.combi,
      });

      grupo.loterias.add(item.lottery);
      grupo.premio_total += Number(item.premio) || 0;
      grupo.detalles.push(item);
    });

    return Object.values(agrupados);
  };

  const fetchResultados = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.rpc(
        "comparar_ventas_resultados_con_combinaciones_v2"
      );

      if (error) {
        throw error;
      }

      // Agrupar los resultados por número de venta
      const resultadosAgrupados = agruparPorNumeroVenta(data || []);
      setResultados(resultadosAgrupados as any);
    } catch (err : any) {
      console.error("Error al obtener resultados:", err);
      const errorMessage = err.message || "Ocurrió un error al obtener los resultados";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResultados();
  }, []);

  // Función para refrescar los datos
  const refrescar = () => {
    fetchResultados();
  };

  return {
    resultados,
    loading,
    error,
    refrescar,
  };
};

export default useLoteriaComparisonNew;
