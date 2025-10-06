import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
interface VentasStats {
  usuario_email: string;
  total_valor_bruta: number;
  total_venta_neta: number;
  total_ganancias: number;
  total_premios: number;
}

interface UseVentasStatsProps {
  fechaInicio: string; // formato D/M/YYYY
  fechaFin: string;    // formato D/M/YYYY
  zona: string;
}

export const useVentasStatsBr = ({ fechaInicio, fechaFin, zona }: UseVentasStatsProps) => {
  const [data, setData] = useState<VentasStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVentasStats = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data: result, error: supabaseError } = await supabase
        .rpc('calcular_totales_por_fecha_zona_ventas', {
          fecha_inicio_text: fechaInicio,
          fecha_fin_text: fechaFin,
          zona_param: zona
        });

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      setData(result || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fechaInicio && fechaFin && zona) {
      fetchVentasStats();
    }
  }, [fechaInicio, fechaFin, zona]);

  return { data, loading, error, refetch: fetchVentasStats };
};