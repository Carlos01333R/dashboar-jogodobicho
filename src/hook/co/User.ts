import { useState, useEffect, act } from 'react';
import { supabase } from '@/lib/supabase';
interface Usuario {
  id: string;       // Ajusta los campos según tu tabla usuarios
  email: string;
    full_name: string;
    sector: string;
    created_at: Date;
    updated_at: Date;
    is_active: boolean;
    password: string;
    telefono: string;
  
}

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cantidad, setCantidad] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsuarios() {
      setLoading(true);
      setError(null);

      try {
        // Traer todos los usuarios
        const { data, error } = await supabase.from('users').select('*');
        if (error) throw error;
        setUsuarios(data || []);

        // Contar usuarios
        const { count, error: countError } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });
        if (countError) throw countError;
        setCantidad(count || 0);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUsuarios();
  }, []);

  return { usuarios, cantidad, loading, error };
}
