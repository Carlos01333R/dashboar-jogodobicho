'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Boleto {
   id : string;
   numero_ticket : string;
   usuario : string;
   nombre : string;
   telefono : string;
   loterias_seleccionadas : string[];
   boletos_apostados : string[];
   monto : string;
   fecha_apuesta : string;
   hora_apuesta : string;
   created_at : string;
   zona : string;
   monto_neto : string;
   ganancias : string;
}
 
interface prop{
    numeroTicket: string;
}
const useObtenerBoletoPorTicket = ({numeroTicket}: prop) => {
  const [boleto, setBoleto] = useState<Boleto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!numeroTicket) {
      setBoleto(null);
      return;
    }

    const fetchBoleto = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { data, error: supabaseError } = await supabase
          .from('apuestas')
          .select('*')
          .eq('numero_ticket', numeroTicket)
          .single(); // .single() asegura que solo devuelve un registro

        if (supabaseError) {
          throw new Error(supabaseError.message);
        }

        setBoleto(data);
      } catch (err : any) {
        setError(err.message);
        setBoleto(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBoleto();
  }, [numeroTicket]);

  return { boleto, loading, error };
};

export default useObtenerBoletoPorTicket;