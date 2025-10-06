import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

const usePremiosByUsuarioAndDate = (usuario: string, fecha: string | Date) => {
  const [premios, setPremios] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!usuario || !fecha) {
      setPremios(null);
      return;
    }

    const fetchPremios = async () => {
      try {
        setLoading(true);
        setError(null);

        let fechaFormato: string;

        // Si la fecha es string en formato DD/MM/YYYY
        if (typeof fecha === 'string' && fecha.includes('/')) {
          const parts = fecha.split('/');
          if (parts.length === 3) {
            fechaFormato = `${parts[2]}-${parts[1]}-${parts[0]}`; // YYYY-MM-DD
          } else {
            throw new Error('Formato de fecha inválido. Use DD/MM/YYYY');
          }
        } 
        // Si la fecha es un objeto Date
        else if (fecha instanceof Date) {
          const yyyy = fecha.getFullYear();
          const mm = String(fecha.getMonth() + 1).padStart(2, "0");
          const dd = String(fecha.getDate()).padStart(2, "0");
          fechaFormato = `${yyyy}-${mm}-${dd}`;
        }
        // Si ya está en formato YYYY-MM-DD
        else {
          fechaFormato = fecha;
        }

        console.log('Llamando función con:', { 
          usuario, 
          fechaOriginal: fecha,
          fechaFormato 
        });

        const { data, error } = await supabase
          .rpc("get_premios_by_usuario_and_exact_date", {
            p_usuario: usuario,
            p_fecha_exacta: fechaFormato,
          });

        if (error) {
          console.error('Error de Supabase:', error);
          throw error;
        }
        
        console.log('Respuesta de Supabase:', data);
        
        setPremios(data);
        
      } catch (err: any) {
        console.error('Error fetching premios:', err);
        setError(err.message);
        setPremios(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPremios();
  }, [usuario, fecha]);

  return { premios, loading, error };
};

export default usePremiosByUsuarioAndDate;