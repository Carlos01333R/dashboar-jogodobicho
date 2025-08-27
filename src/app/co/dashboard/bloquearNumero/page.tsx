'use client'
import BlockedNumbers from "@/components/numerosBloqueados/Numeros"
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import useNumerosBloqueados from "@/hook/co/useNumeroBloqueados";
import useMaximoValor from "@/hook/co/MaximoValor/useMaximoValor";
export default function BloquearNumero(){
    const { numerosBloqueados, loading, error } = useNumerosBloqueados()

     const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const numero = formData.get("Numero");
    const razon = formData.get("razon");

    // Validar que todos los campos estén completos
    if (numero === "" || razon === "" ) {
      toast.error("Complete all fields");
      return;
    }

    const { data, error } = await supabase
      .from("bloquear_number")
      .insert([
        {
          numero: numero,
          valor: 0,
          razon: razon,
        },
      ])
      .select();

    if (error) {
      console.error("Error inserting data:", error.message);
    } else {
      
      toast.success("Número Bloqueado Agregado Correctamente");
      e.target.reset();

      window.location.reload();
    }
    };

     const handleDelete = async (from : any) => {
      const { id } = from;

    const { error } = await supabase
      .from("bloquear_number")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting data:", error.message);
      toast.error("Error deleting data");
    } else {
      toast.success("Zona Eliminada Correctamente");
      window.location.reload();
    }
    };

  const handleSubmitUpdate = async (formData: {
  id: string;
  Numero: number;
  RazonNumero: string;
}) => {
  const { id, Numero, RazonNumero } = formData;

  if (Numero === 0 || RazonNumero === '') {
    toast.error("Complete todos los campos");
    return;
  }

  const { data, error } = await supabase
    .from("bloquear_number")
    .update({
      numero: Numero,
      valor: 0,
      razon: RazonNumero,
    })
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error updating data:", error.message);
    toast.error("Error al actualizar los datos");
  } else {
    toast.success("Número actualizado correctamente");
    // En lugar de recargar toda la página, sería mejor actualizar el estado local
    setTimeout(() => window.location.reload(), 1000);
  }
  };

    return(
        <section>
     <BlockedNumbers Submit={handleSubmit} Delete={handleDelete} Update={handleSubmitUpdate} loading={loading} error={error} numerosBloqueados={numerosBloqueados}/>
        </section>
    )
}