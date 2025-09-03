import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Apuesta {
  id: string;
  usuario: string | null;
  nombre: string;
  telefono: string;
  loterias_seleccionadas: string[];
  boletos_apostados: any; // jsonb
  monto: number;
  monto_neto: number | null;
  ganancias: number | null;
  fecha_apuesta: string;
  numero_ticket: string;
  created_at: string;
  zona: string | null;
}

interface Stats {
  total_apuestas: number;
  usuarios_unicos: number;
  monto_total: number;
  monto_neto_total: number;
  ganancias_total: number;
  fecha_desde: string;
  fecha_hasta: string;
  zona: string | null;
}

interface ApuestasResponse {
  stats: Stats;
  apuestas: Apuesta[];
}

interface UseApuestasPorFechaProps {
  fechaDesde?: string | null; // Formato DD/MM/YYYY
  fechaHasta?: string | null; // Formato DD/MM/YYYY
  zona?: string | null; // Nueva propiedad para filtrar por zona
  autoFetch?: boolean;
}

export const useApuestasPorFechabr = ({
  fechaDesde = null,
  fechaHasta = null,
  zona = null, // Valor por defecto null (todas las zonas)
  autoFetch = true
}: UseApuestasPorFechaProps) => {
  const [data, setData] = useState<ApuestasResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApuestas = async (
    desde: string | null, 
    hasta: string | null, 
    zonaParam: string | null
  ) => {
    setLoading(true);
    setError(null);

    try {
      const { data: result, error: supabaseError } = await supabase
        .rpc('apuestas_por_rango_fechas_brasil_zona', {
          fecha_desde_str: desde,
          fecha_hasta_str: hasta,
          p_zona: zonaParam
        });

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error fetching apuestas:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fetch automático cuando cambian las fechas o la zona
  useEffect(() => {
    if (autoFetch) {
      fetchApuestas(fechaDesde, fechaHasta, zona);
    }
  }, [fechaDesde, fechaHasta, zona, autoFetch]);

  const refetch = () => fetchApuestas(fechaDesde, fechaHasta, zona);

  return {
    data,
    loading,
    error,
    refetch,
    stats: data?.stats,
    apuestas: data?.apuestas || []
  };
};

// Hook adicional para un uso más simple con zona
export const useApuestasHoy = (zona?: string | null) => {
  const hoy = new Date();
  const fechaHoy = `${hoy.getDate().toString().padStart(2, '0')}/${(hoy.getMonth() + 1).toString().padStart(2, '0')}/${hoy.getFullYear()}`;

  return useApuestasPorFechabr({
    fechaDesde: fechaHoy,
    fechaHasta: fechaHoy,
    zona: zona,
    autoFetch: true
  });
};

export const useApuestasEsteMes = (zona?: string | null) => {
  const hoy = new Date();
  const primerDiaMes = `01/${(hoy.getMonth() + 1).toString().padStart(2, '0')}/${hoy.getFullYear()}`;
  const ultimoDiaMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
  const fechaUltimoDia = `${ultimoDiaMes.getDate().toString().padStart(2, '0')}/${(ultimoDiaMes.getMonth() + 1).toString().padStart(2, '0')}/${ultimoDiaMes.getFullYear()}`;

  return useApuestasPorFechabr({
    fechaDesde: primerDiaMes,
    fechaHasta: fechaUltimoDia,
    zona: zona,
    autoFetch: true
  });
};


