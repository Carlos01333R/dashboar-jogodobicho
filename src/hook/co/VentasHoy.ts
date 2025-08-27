import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Venta {
  id: number;
  numero_venta: string;
  vendedor: string;
  zona: string;
  nombre: string;
  celular: string;
  fecha: string;
  hora: string;
  juego: string;
  loterias: string[];
  boletos: number;
  valor_bruta: number;
  venta_neta: number;
  ganancias: number;
  fecha_hora: string;
}

interface VentasStats {
  total_ventas: number;
  vendedores_unicos: number;
  venta_bruta_total: number;
  fecha_desde: string;
  fecha_hasta: string;
}

interface VentasResponse {
  stats: VentasStats;
  ventas: Venta[];
}

export function useVentasPorRango() {
  const [data, setData] = useState<VentasResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVentas = async (fechaDesde?: string, fechaHasta?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Llamar a la función PostgreSQL con los parámetros de fecha
      const { data: result, error: supabaseError } = await supabase
        .rpc('ventas_por_rango_fechas_colombia', {
          fecha_desde_str: fechaDesde || null,
          fecha_hasta_str: fechaHasta || null
        })
        .single();

      if (supabaseError) {
        throw supabaseError;
      }

      setData(result as VentasResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // Función para refrescar datos con nuevos parámetros
  const refetch = (fechaDesde?: string, fechaHasta?: string) => {
    fetchVentas(fechaDesde, fechaHasta);
  };

  // Carga inicial con fecha actual
  useEffect(() => {
    fetchVentas();
  }, []);

  return { 
    data, 
    loading, 
    error,
    refetch 
  };
}