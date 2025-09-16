import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface VentaRifa {
  id: string;
  rifa_id: string;
  vendedor_id: string;
  vendedor_nombre: string;
  usuario_nombre: string;
  usuario_telefono: string;
  usuario_email: string;
  numeros_comprados: number[];
  cantidad_tickets: number;
  valor_total: number;
  metodo_pago: string;
  estado_pago: string;
  fecha_venta: string;
  created_at: string;
  venta_total: number;
  venta_neta: number;
  ganancias_vendedor: number;
  numero_ticket: string | null;
  nombre_rifa: string;
  foto_url: string;
}

interface Estadisticas {
  ventas_hoy: number;
  total_hoy: number;
  neto_hoy: number;
  ganancias_hoy: number;
  total_acumulado: number;
  neto_acumulado: number;
  ganancias_acumulado: number;
}

interface EstadisticasVentasResponse {
  estadisticas: Estadisticas;
  ventas_del_dia: VentaRifa[];
  fecha_consulta: string;
  vendedor_filtrado: string | null;
}

export const useEstadisticasVentasRifas = (vendedor?: string) => {
  const [data, setData] = useState<EstadisticasVentasResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: result, error: rpcError } = await supabase
          .rpc('obtener_estadisticas_ventas_diarias', {
            p_vendedor_nombre: vendedor || null
          });

        if (rpcError) {
          throw new Error(rpcError.message);
        }

        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al obtener estadísticas');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [vendedor]);

  return {
    data,
    loading,
    error,
    estadisticas: data?.estadisticas,
    ventasDelDia: data?.ventas_del_dia || []
  };
};