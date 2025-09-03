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
  fecha_apuesta: string;
  numero_ticket: string;
  created_at: string;
}

interface Stats {
  total_apuestas: number;
  usuarios_unicos: number;
  monto_total: number;
  fecha_desde: string;
  fecha_hasta: string;
}

interface ApuestasResponse {
  stats: Stats;
  apuestas: Apuesta[];
}

interface UseApuestasPorFechaProps {
  fechaDesde?: string | null; // Formato DD/MM/YYYY
  fechaHasta?: string | null; // Formato DD/MM/YYYY
  autoFetch?: boolean;
}

export const useApuestasPorFecha = ({
  fechaDesde = null,
  fechaHasta = null,
  autoFetch = true
}: UseApuestasPorFechaProps) => {
  const [data, setData] = useState<ApuestasResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApuestas = async (desde: string | null, hasta: string | null) => {
    setLoading(true);
    setError(null);

    try {
      const { data: result, error: supabaseError } = await supabase
        .rpc('apuestas_por_rango_fechas_brasil', {
          fecha_desde_str: desde,
          fecha_hasta_str: hasta
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

  // Fetch automático cuando cambian las fechas
  useEffect(() => {
    if (autoFetch) {
      fetchApuestas(fechaDesde, fechaHasta);
    }
  }, [fechaDesde, fechaHasta, autoFetch]);

  const refetch = () => fetchApuestas(fechaDesde, fechaHasta);

  return {
    data,
    loading,
    error,
    refetch,
    stats: data?.stats,
    apuestas: data?.apuestas || []
  };
};

// Hook adicional para un uso más simple
export const useApuestasHoy = () => {
  const hoy = new Date();
  const fechaHoy = `${hoy.getDate().toString().padStart(2, '0')}/${(hoy.getMonth() + 1).toString().padStart(2, '0')}/${hoy.getFullYear()}`;

  return useApuestasPorFecha({
    fechaDesde: fechaHoy,
    fechaHasta: fechaHoy,
    autoFetch: true
  });
};

export const useApuestasEsteMes = () => {
  const hoy = new Date();
  const primerDiaMes = `01/${(hoy.getMonth() + 1).toString().padStart(2, '0')}/${hoy.getFullYear()}`;
  const ultimoDiaMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
  const fechaUltimoDia = `${ultimoDiaMes.getDate().toString().padStart(2, '0')}/${(ultimoDiaMes.getMonth() + 1).toString().padStart(2, '0')}/${ultimoDiaMes.getFullYear()}`;

  return useApuestasPorFecha({
    fechaDesde: primerDiaMes,
    fechaHasta: fechaUltimoDia,
    autoFetch: true
  });
};