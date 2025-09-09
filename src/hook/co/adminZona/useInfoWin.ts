import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; // ajusta según tu path

interface WinSummary {
  total_ganadores: number;
  total_premios: number;
  premio_promedio: number;
  total_ganadores_por_mes: { mes: string; ganadores: number }[];
  total_premios_por_mes: { mes: string; premios: number }[];
  data: any[];
}

export const useWinSummaryAdminZona = (zona: string) => {
  const [summary, setSummary] = useState<WinSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .rpc(
            'get_win_summary_zonas',
            {
            p_zona: zona
            }
        )

        if (error) {
          setError(error.message);
          setLoading(false);
          return;
        }

        setSummary(data as WinSummary);
      } catch (err: any) {
        setError(err.message || 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  return { summary, loading, error };
};
