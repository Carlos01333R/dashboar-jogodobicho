import { useState } from 'react';
import { supabase } from '@/lib/supabase';
interface BoletoApostado {
  premio: number;
  modalidad: string;
  grupo_apostado: string | null;
  numero_apostado: string | null;
  grupos_apostados: any | null;
  monto_individual: number;
  multiplicador_individual: number;
}

interface Apuesta {
  id: string;
  usuario: string | null;
  nombre: string;
  telefono: string;
  zona: string;
  monto: number;
  monto_neto: number;
  ganancias: number;
  fecha_apuesta: string;
  numero_ticket: string;
  created_at: string;
  boletos_apostados: BoletoApostado[];
  loterias_seleccionadas: string[];
}

interface Totales {
  total_monto: number;
  total_neto: number;
  ganancias: number;
}

interface ApuestasResponse {
  apuestas: Apuesta[];
  totales: Totales;
}

export const useApuestasUsuario = () => {
  const [data, setData] = useState<ApuestasResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApuestasUsuario = async (usuarioEmail: string, fechaInicio: string, fechaFin: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data: result, error: supabaseError } = await supabase
        .rpc('obtener_apuestas_y_totales_app_br', {
          usuario_email: usuarioEmail,
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin
        });

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      if (result && result.length > 0) {
        // Supabase ya parsea automáticamente los JSON, así que accedemos directamente
        const response: ApuestasResponse = {
          apuestas: result[0].apuestas || [],
          totales: result[0].totales || { total_monto: 0, total_neto: 0, ganancias: 0 }
        };
        
        setData(response);
        return response;
      }

      // Retorno por defecto si no hay datos
      const defaultResponse: ApuestasResponse = {
        apuestas: [],
        totales: { total_monto: 0, total_neto: 0, ganancias: 0 }
      };
      
      setData(defaultResponse);
      return defaultResponse;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error fetching apuestas usuario:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    fetchApuestasUsuario
  };
};