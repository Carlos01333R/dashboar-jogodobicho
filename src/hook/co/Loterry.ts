import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface LotteryCount {
  lottery: string;
  count: number;
}

export const useWinningLotteries = () => {
  const [data, setData] = useState<LotteryCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchWinningLotteries = async () => {
    try {
      setLoading(true);
      setError(null);

      // Llamamos a la función de PostgreSQL que creamos
      const { data: result, error: queryError } = await supabase
        .rpc('count_winning_lotteries');

      if (queryError) {
        throw queryError;
      }

      setData(result || []);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching winning lotteries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWinningLotteries();
  }, []);

  return { 
    winningLotteries: data, 
    isLoading: loading, 
    error, 
    refresh: fetchWinningLotteries 
  };
};