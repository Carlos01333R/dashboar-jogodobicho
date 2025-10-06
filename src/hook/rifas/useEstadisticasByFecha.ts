import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface EstadisticasVentas {
  total_ventas: number;
  total_venta_total: number;
  total_venta_neta: number;
  total_ganancias_vendedor: number;
}

interface UseEstadisticasVentasProps {
  zona: string;
  fechaInicio: string; // formato DD/MM/YYYY
  fechaFin: string; // formato DD/MM/YYYY
}

// Función para convertir DD/MM/YYYY a YYYY-MM-DD
const convertirFecha = (fechaDDMMYYYY: string): string => {
  const [dia, mes, anio] = fechaDDMMYYYY.split('/');
  return `${anio}-${mes}-${dia}`;
};

export function useEstadisticasVentasFlexible({ 
  zona, 
  fechaInicio, 
  fechaFin 
}: UseEstadisticasVentasProps) {
  const [data, setData] = useState<EstadisticasVentas | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEstadisticas = async () => {
    try {
      setLoading(true);
      setError(null);

      // Convertir fechas al formato YYYY-MM-DD
      const fechaInicioConvertida = convertirFecha(fechaInicio);
      const fechaFinConvertida = convertirFecha(fechaFin);

      console.log('Parámetros enviados:', { 
        zona, 
        fechaInicioOriginal: fechaInicio,
        fechaFinOriginal: fechaFin,
        fechaInicioConvertida,
        fechaFinConvertida
      });

      const { data: result, error: supabaseError } = await supabase
        .rpc('obtener_estadisticas_ventas_flexible', {
          p_zona: zona,
          p_fecha_inicio: fechaInicioConvertida,
          p_fecha_fin: fechaFinConvertida
        });

      console.log('Respuesta de Supabase:', { result, error: supabaseError });

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      // La función RPC devuelve un array con un solo objeto
      const estadisticas = Array.isArray(result) ? result[0] : result;
      console.log('Estadísticas procesadas:', estadisticas);
      
      setData(estadisticas);
    } catch (err) {
      console.error('Error fetching estadísticas:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (zona && fechaInicio && fechaFin) {
      fetchEstadisticas();
    } else {
      setLoading(false);
      setData(null);
    }
  }, [zona, fechaInicio, fechaFin]);

  const refetch = () => {
    fetchEstadisticas();
  };

  return {
    data,
    loading,
    error,
    refetch
  };
}