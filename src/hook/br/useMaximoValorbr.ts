import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';


interface MaximoValorbr {
  id: string;
  milla: number;
  centena: number;
  decena: number;
  millar1a5: number;
  centena1a5: number;
  decena1a5: number;
  created_at: string;
}
export const useMaximoValorbr = () => {
  const [data, setData] = useState<MaximoValorbr[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMaximoValorbr = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Iniciando consulta a Supabase...');
      
      const { data: maximoData, error: supabaseError } = await supabase
        .from('maximoValorbr')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Respuesta de Supabase:', { maximoData, supabaseError });

      if (supabaseError) {
        console.error('Error de Supabase:', supabaseError);
        throw supabaseError;
      }

      setData(maximoData || []);
      console.log('Datos establecidos:', maximoData);

    } catch (err: any) {
      console.error('Error en el hook:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaximoValorbr();
  }, []);

  const refetch = () => {
    fetchMaximoValorbr();
  };

  return {
    data,
    loading,
    error,
    refetch
  };
};