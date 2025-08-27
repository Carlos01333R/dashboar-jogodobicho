import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface MesData {
  year: number;
  mes: string;
  total_bruto: number;
  total_neta: number;
  ganancias: number;
}

interface VentasResumen {
  meses: MesData[];
  total_general: {
    total_bruto: number;
    total_neta: number;
    ganancias: number;
  };
}

export function useVentasResumen() {
  const [data, setData] = useState<VentasResumen | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVentasResumen() {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .rpc('ventas_resumen_json')
        .single();

      if (error) {
        setError(error.message);
        setData(null);
      } else {
        setData(data as VentasResumen);
      }
      setLoading(false);
    }

    fetchVentasResumen();
  }, []);

  return { data, loading, error };
}
