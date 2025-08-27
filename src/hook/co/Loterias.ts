import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Dia {
  dia: string;
  cierre: string;
  apertura: string;
}

interface Loteria {
  days: Dia[];
  logo: string;
  name: string;
}

interface LoteriasData {
  loterias: Loteria[];
}

export function useLoterias() {
  const [data, setData] = useState<LoteriasData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    async function fetchLoterias() {
      setLoading(true);
      setError(null);

      try {
        // Obtener el JSON de la tabla loterias
        const { data: loteriasData, error: fetchError } = await supabase
          .from('loterias')
          .select('data')
          .single();

        if (fetchError) {
          throw fetchError;
        }

        // Verificar y parsear los datos
        if (loteriasData?.data && isLoteriasData(loteriasData.data)) {
          setData(loteriasData.data);
          setCount(loteriasData.data.loterias.length);
        } else {
          throw new Error('Formato de datos incorrecto');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setData(null);
        setCount(0);
      } finally {
        setLoading(false);
      }
    }

    fetchLoterias();
  }, []);

  return { data, count, loading, error };
}

// Función de verificación de tipo
function isLoteriasData(data: any): data is LoteriasData {
  return (
    data !== null &&
    typeof data === 'object' &&
    Array.isArray(data.loterias) &&
    data.loterias.every((loteria: any) => 
      Array.isArray(loteria.days) &&
      typeof loteria.logo === 'string' &&
      typeof loteria.name === 'string'
    )
  );
}