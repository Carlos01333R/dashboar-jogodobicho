import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Apuesta {
  id: string;
  usuario: string | null;
  nombre: string;
  telefono: string;
  loterias_seleccionadas: string[];
  boletos_apostados: any;
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
  usuario: string | null;
}

interface ApuestasResponse {
  stats: Stats;
  apuestas: Apuesta[];
}

interface UseApuestasPorFechaProps {
  fechaDesde?: string | null;
  fechaHasta?: string | null;
  usuario?: string | null; // Nuevo parámetro para filtrar por usuario
  autoFetch?: boolean;
}

export const useApuestasUserPorFecha = ({
  fechaDesde = null,
  fechaHasta = null,
  usuario = null, // Valor por defecto null (todos los usuarios)
  autoFetch = true
}: UseApuestasPorFechaProps) => {
  const [data, setData] = useState<ApuestasResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApuestas = async (
    desde: string | null, 
    hasta: string | null, 
    usuarioParam: string | null
  ) => {
    setLoading(true);
    setError(null);

    try {
      const { data: result, error: supabaseError } = await supabase
        .rpc('apuestas_por_rango_fechas_brasil_user', {
          fecha_desde_str: desde,
          fecha_hasta_str: hasta,
          p_usuario: usuarioParam
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

  useEffect(() => {
    if (autoFetch) {
      fetchApuestas(fechaDesde, fechaHasta, usuario);
    }
  }, [fechaDesde, fechaHasta, usuario, autoFetch]);

  const refetch = () => fetchApuestas(fechaDesde, fechaHasta, usuario);

  return {
    data,
    loading,
    error,
    refetch,
    stats: data?.stats,
    apuestas: data?.apuestas || []
  };
};

// Hook adicional para un uso más simple con usuario
export const useApuestasHoy = (usuario?: string | null) => {
  const hoy = new Date();
  const fechaHoy = `${hoy.getDate().toString().padStart(2, '0')}/${(hoy.getMonth() + 1).toString().padStart(2, '0')}/${hoy.getFullYear()}`;

  return useApuestasUserPorFecha({
    fechaDesde: fechaHoy,
    fechaHasta: fechaHoy,
    usuario: usuario,
    autoFetch: true
  });
};

export const useApuestasEsteMes = (usuario?: string | null) => {
  const hoy = new Date();
  const primerDiaMes = `01/${(hoy.getMonth() + 1).toString().padStart(2, '0')}/${hoy.getFullYear()}`;
  const ultimoDiaMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
  const fechaUltimoDia = `${ultimoDiaMes.getDate().toString().padStart(2, '0')}/${(ultimoDiaMes.getMonth() + 1).toString().padStart(2, '0')}/${ultimoDiaMes.getFullYear()}`;

  return useApuestasUserPorFecha({
    fechaDesde: primerDiaMes,
    fechaHasta: fechaUltimoDia,
    usuario: usuario,
    autoFetch: true
  });
};
