/* eslint-disable react-hooks/exhaustive-deps */
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

const useAdmin = (sector : string) => {
  const [user, setUser] = useState([] as any);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null as string | null);

  async function getCountries() {
    setLoading(true);
    const { data, error } = await supabase
      .from("users")
      .select()
      .eq("sector", sector);
    if (error) {
        const errorMessage = error instanceof Error ? error.message : "Error desconocido";
        setError(errorMessage);
    }
    else {
      setLoading(false);
      setUser(data);
    }
  }

  useEffect(() => {
    getCountries();
  }, [sector]);

  return {
    user,
    setUser,
    loading,
    error,
  };
};

export default useAdmin;
