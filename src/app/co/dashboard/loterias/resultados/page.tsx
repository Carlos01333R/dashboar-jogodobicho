'use client'
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import useResultadosLoteriaHoy from "@/hook/co/useResultadosLotery";
import { Edit, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { ModalEditarResultado } from "@/components/loterias/ModalEditarResultado";
import { ModalFromResultado } from "@/components/loterias/ModalAgregarResultado";

export default function ResultadosManager() {
    const { resultadosHoy, loading, error } = useResultadosLoteriaHoy();
    const [loteriaEditando, setLoteriaEditando] = useState<any>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [Filter, setFilter] = useState('');



  const filterNameProyect = (resultadosHoy : any) => {
    if (!resultadosHoy) return []; // Asegúrate de que user no sea null
    if (Filter === null) return resultadosHoy;
    return resultadosHoy.filter((zona : any) =>
      zona.lottery.toLowerCase().includes(Filter.toLowerCase())
    );
  };

  const FilterProject = filterNameProyect(resultadosHoy); // Validación adicional para evitar errores
   // Función para manejar la apertura del modal
    const handleEditarLoteria = (loteria: any) => {
        console.log("Editando lotería:", loteria);
        setLoteriaEditando(loteria);
        setIsModalOpen(true);
    }

    // Función para cerrar el modal y resetear
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setLoteriaEditando(null);
    }

    const handleSave = async () => {
        setLoteriaEditando(null);
        setIsModalOpen(false);
        toast.success("Lotería actualizada con éxito");
        window.location.reload();
    }
  const handleDelete = async (id : any) => {
    const { error } = await supabase
      .from("resultados_loteria")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting data:", error.message);
      toast.error("Error deleting data");
    } else {
      toast.success("Resultado Eliminado Correctamente");
      window.location.reload();
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-emerald-500" />
        <p className="font-medium text-lg text-gray-600">Cargando resultados...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="font-bold text-xl text-red-600">{error}</p>
        </div>
      </div>
    );
  }

    return(
        <>
        <section className="w-full flex justify-end items-center py-4"> 
            <ModalFromResultado />  
        </section>
         <section className="w-full  px-2">
        <Table >
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="font-semibold text-gray-700 py-4">LOTERIA</TableHead>
              <TableHead className="font-semibold text-gray-700 py-4">RESULTADO</TableHead>
              <TableHead className="font-semibold text-gray-700 py-4 text-right">FECHA</TableHead>
              <TableHead className="font-semibold text-gray-700 py-4 text-right">ACCIONES</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {FilterProject.length > 0 ? (
              FilterProject.map((loteria: any, index: number) => (
                <TableRow key={index} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                  <TableCell className="font-medium py-4">
                    <div className="flex items-center">
                     
                      {loteria.lottery}
                    
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                   <div className="flex items-center">
                    {loteria.result}
                   </div>
                  </TableCell>
                  <TableCell className="py-4 text-right">
                    {loteria.date}
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex justify-end gap-2">
                      <button
                       
                     
                        onClick={() => handleEditarLoteria(loteria)}
                        className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg  space-x-2 transition-colors cursor-pointer"
                      >
                        <Edit className="h-4 w-4" />
                        Editar
                      </button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(loteria.id)}
                        className="flex items-center gap-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                  {FilterProject ? "No se encontraron loterías con ese nombre" : "No hay loterías disponibles"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
         </section>

       
            {loteriaEditando && (
                <ModalEditarResultado
                    loteria={loteriaEditando}
                    onSave={handleSave}
                    isOpen={isModalOpen}
                    onOpenChange={handleCloseModal} // Usar handleCloseModal en lugar de setIsModalOpen
                />
            )}

</>

    )}

 