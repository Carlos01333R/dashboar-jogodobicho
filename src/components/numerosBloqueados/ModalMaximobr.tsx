"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useMaximoValorbr } from "@/hook/br/useMaximoValorbr"
import { Loader2, Edit, Save, X } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface MaximoValorbr {
  idx: number;
  id: string;
  created_at: string;
  millar1a5: number;
  centena1a5: number;
  decena1a5: number;
  milla: number;
  centena: number;
  decena: number;
}

export function ModalMaximoValorbr() {
  const { data, loading, error, refetch } = useMaximoValorbr();
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState<MaximoValorbr | null>(null);
  const [saving, setSaving] = useState(false);

  // Inicializar los datos editados cuando los datos se cargan
  useEffect(() => {
    if (data && data.length > 0) {
      setEditedData(data[0] as MaximoValorbr);
    }
  }, [data]);

  const handleInputChange = (field: keyof MaximoValorbr, value: string) => {
    if (editedData) {
      // Solo permitir números y convertir a número
      const numericValue = value === '' ? 0 : parseInt(value.replace(/\D/g, '')) || 0;
      
      setEditedData({
        ...editedData,
        [field]: numericValue
      });
    }
  };

  const handleSave = async () => {
    if (!editedData) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('maximoValorbr')
        .update({
          millar1a5: editedData.millar1a5,
          centena1a5: editedData.centena1a5,
          decena1a5: editedData.decena1a5,
          milla: editedData.milla,
          centena: editedData.centena,
          decena: editedData.decena
        })
        .eq('id', editedData.id);

      if (error) {
        throw error;
      }

      setEditMode(false);
      refetch(); // Recargar los datos después de guardar
    } catch (err) {
      console.error('Error al guardar:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (data && data.length > 0) {
      setEditedData(data[0] as MaximoValorbr);
    }
    setEditMode(false);
  };

  // Función para formatear el valor mostrado en los inputs
  const formatDisplayValue = (value: number): string => {
    return value === 0 ? '' : value.toString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-emerald-500" />
        <p className="font-medium text-lg text-gray-600">Cargando números bloqueados...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <button className="bg-zinc-700 hover:bg-zinc-800 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors cursor-pointer">
            <p>Agregar valores máximos</p>
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[725px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex-1 text-center">Limitar el valor máximo</DialogTitle>
            <DialogDescription className="flex-1 text-center">
              <span>Poner un valor máximo para los números bloqueados</span>
            </DialogDescription>
          </DialogHeader>
          
          <section className="py-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Valores actuales</h3>
              {!editMode ? (
                <Button 
                  onClick={() => setEditMode(true)} 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Edit className="h-4 w-4" />
                  Editar
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button 
                    onClick={handleSave} 
                    disabled={saving}
                    className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700"
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Guardar
                  </Button>
                  <Button 
                    onClick={handleCancelEdit} 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <X className="h-4 w-4" />
                    Cancelar
                  </Button>
                </div>
              )}
            </div>
            
            {data.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No hay valores configurados
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Card para Millar */}
                <div className="bg-white border rounded-lg p-4 shadow-sm">
                  <h4 className="font-medium text-lg mb-3 text-center border-b pb-2">Millar</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Millar 1-5</label>
                      {editMode ? (
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={formatDisplayValue(editedData?.millar1a5 || 0)}
                          onChange={(e) => handleInputChange('millar1a5', e.target.value)}
                          className="w-full p-2 border rounded-md"
                          placeholder="0"
                        />
                      ) : (
                        <div className="p-2 bg-gray-100 rounded-md">{data[0]?.millar1a5 || 0}</div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Millar</label>
                      {editMode ? (
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={formatDisplayValue(editedData?.milla || 0)}
                          onChange={(e) => handleInputChange('milla', e.target.value)}
                          className="w-full p-2 border rounded-md"
                          placeholder="0"
                        />
                      ) : (
                        <div className="p-2 bg-gray-100 rounded-md">{data[0]?.milla || 0}</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card para Centena */}
                <div className="bg-white border rounded-lg p-4 shadow-sm">
                  <h4 className="font-medium text-lg mb-3 text-center border-b pb-2">Centena</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Centena 1-5</label>
                      {editMode ? (
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={formatDisplayValue(editedData?.centena1a5 || 0)}
                          onChange={(e) => handleInputChange('centena1a5', e.target.value)}
                          className="w-full p-2 border rounded-md"
                          placeholder="0"
                        />
                      ) : (
                        <div className="p-2 bg-gray-100 rounded-md">{data[0]?.centena1a5 || 0}</div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Centena</label>
                      {editMode ? (
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={formatDisplayValue(editedData?.centena || 0)}
                          onChange={(e) => handleInputChange('centena', e.target.value)}
                          className="w-full p-2 border rounded-md"
                          placeholder="0"
                        />
                      ) : (
                        <div className="p-2 bg-gray-100 rounded-md">{data[0]?.centena || 0}</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card para Decena */}
                <div className="bg-white border rounded-lg p-4 shadow-sm md:col-span-2">
                  <h4 className="font-medium text-lg mb-3 text-center border-b pb-2">Decena</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Decena 1-5</label>
                      {editMode ? (
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={formatDisplayValue(editedData?.decena1a5 || 0)}
                          onChange={(e) => handleInputChange('decena1a5', e.target.value)}
                          className="w-full p-2 border rounded-md"
                          placeholder="0"
                        />
                      ) : (
                        <div className="p-2 bg-gray-100 rounded-md">{data[0]?.decena1a5 || 0}</div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Decena</label>
                      {editMode ? (
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={formatDisplayValue(editedData?.decena || 0)}
                          onChange={(e) => handleInputChange('decena', e.target.value)}
                          className="w-full p-2 border rounded-md"
                          placeholder="0"
                        />
                      ) : (
                        <div className="p-2 bg-gray-100 rounded-md">{data[0]?.decena || 0}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
          
          <DialogFooter>
            <section className="w-full flex items-center justify-center gap-x-2">
              <DialogClose asChild>
                <button className="py-2 px-4 bg-red-500 text-white rounded-lg cursor-pointer hover:bg-red-600 transition-colors">
                  Cerrar
                </button>
              </DialogClose>
            </section>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}