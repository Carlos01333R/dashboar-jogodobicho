import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
interface LotteryData {
  lottery: string;
  count: number;
}

interface TopLoteriasResponse {
  loterias_mas_vendidas: LotteryData[];
}

export const useTopLoterias= () => {
  const [data, setData] = useState<LotteryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTopLoterias = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: response, error: supabaseError } = await supabase
        .rpc('get_top_loterias_simple');

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      // Parsear la respuesta
      const result: TopLoteriasResponse = typeof response === 'string' 
        ? JSON.parse(response) 
        : response;

      // Extraer solo el array de loterías más vendidas
      setData(result.loterias_mas_vendidas || []);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopLoterias();
  }, []);

  const refetch = () => {
    fetchTopLoterias();
  };

  return {
    data,
    loading,
    error,
    refetch
  };
};