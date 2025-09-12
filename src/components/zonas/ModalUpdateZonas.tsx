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
import { usePathname } from "next/navigation";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {Edit} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner" 
import { useState } from "react"

interface Props {
  id: string;
  nombre: string;
  porcentaje_loteria: number;
  porcentaje_cliente: number;
  porcentaje_admin_zona: number;
  cuatroCifras: number;
  tresCifras: number;
  dosCifras: number;
  cuatroCombi: number | null;
  tresCombi: number | null;
  pais: string | null;
}

export function ModalUpdateZonas({
  id,
  nombre,
  porcentaje_loteria,
  porcentaje_cliente,
  porcentaje_admin_zona,
  cuatroCifras,
  tresCifras,
  dosCifras,
  cuatroCombi,
  tresCombi,
  pais
}: Props) {
  const [Nombre, setNombre] = useState(nombre || "");
  const [Porcentaje_loteria, setPorcentaje_loteria] = useState(porcentaje_loteria?.toString() || "");
  const [Porcentaje_cliente, setPorcentaje_cliente] = useState(porcentaje_cliente?.toString() || "");
  const [Porcentaje_admin_zona, setPorcentaje_admin_zona] = useState(porcentaje_admin_zona?.toString() || "");
  const [CuatroCifras, setCuatroCifras] = useState(cuatroCifras?.toString() || "");
  const [TresCifras, setTresCifras] = useState(tresCifras?.toString() || "");
  const [DosCifras, setDosCifras] = useState(dosCifras?.toString() || "");
  const [CuatroCombi, setCuatroCombi] = useState(cuatroCombi?.toString() || "");
  const [TresCombi, setTresCombi] = useState(tresCombi?.toString() || "");
  
  const pathname = usePathname();
  const isActive = pathname === "/AdminZona/co/dashboard/zonas";
  const isBrasil = pais === 'brazil';

  // Función para convertir string vacío a null y string numérico a número
  const parseNumberField = (value: string): number | null => {
    if (value === "" || value === null || value === undefined) return null;
    const num = parseFloat(value);
    return isNaN(num) ? null : num;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar campos requeridos
    if (
      !Nombre.trim() ||
      !Porcentaje_loteria ||
      !Porcentaje_cliente ||
      !Porcentaje_admin_zona ||
      !CuatroCifras ||
      !TresCifras ||
      !DosCifras
    ) {
      toast.error("Complete todos los campos obligatorios");
      return;
    }

    try {
      const { error } = await supabase
        .from("zonas")
        .update({
          nombre: Nombre.trim(),
          porcentaje_loteria: parseNumberField(Porcentaje_loteria),
          porcentaje_cliente: parseNumberField(Porcentaje_cliente),
          porcentaje_admin_zona: parseNumberField(Porcentaje_admin_zona),
          "4cifras": parseNumberField(CuatroCifras),
          "3cifras": parseNumberField(TresCifras),
          "2cifras": parseNumberField(DosCifras),
          "4combi": isBrasil ? null : parseNumberField(CuatroCombi),
          "3combi": isBrasil ? null : parseNumberField(TresCombi),
        })
        .eq("id", id);

      if (error) {
        console.error("Error actualizando datos:", error.message);
        toast.error("Error al actualizar la zona");
      } else {
        toast.success("Zona actualizada correctamente");
        // No recargar la página completa, mejor usar estado o contexto
        setTimeout(() => window.location.reload(), 1000); // Pequeño delay para que se vea el toast
      }
    } catch (error) {
      console.error("Error inesperado:", error);
      toast.error("Error inesperado al actualizar la zona");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1 cursor-pointer">
          <Edit className="w-4 h-4" />
          <span>Editar</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar zona {nombre}</DialogTitle>
          <DialogDescription>
            <span>Actualiza la información de la zona.</span>
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          {/* Versión escritorio */}
          <div className="hidden md:grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="nombre-desktop">Nombre</Label>  
              <Input 
                id="nombre-desktop"
                placeholder="Nombre Completo" 
                value={Nombre} 
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>
            
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="porcentaje_loteria-desktop">% Casa</Label>
              <Input 
                id="porcentaje_loteria-desktop"
                placeholder="Porcentaje loteria" 
                type="number" 
                step="0.01"
                value={Porcentaje_loteria} 
                onChange={(e) => setPorcentaje_loteria(e.target.value)}
                required
              />
            </div>
            
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="porcentaje_cliente-desktop">% Vendedor</Label>
              <Input 
                id="porcentaje_cliente-desktop"
                placeholder="Porcentaje cliente" 
                type="number" 
                step="0.01"
                value={Porcentaje_cliente} 
                onChange={(e) => setPorcentaje_cliente(e.target.value)}
                required
              />
            </div>
            
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="porcentaje_admin_zona-desktop">% admin zona</Label>
              <Input 
                id="porcentaje_admin_zona-desktop"
                placeholder="Porcentaje admin zona" 
                type="number" 
                step="0.01"
                value={Porcentaje_admin_zona}
                onChange={(e) => setPorcentaje_admin_zona(e.target.value)}
                required
              />
            </div>
            
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="cuatroCifras-desktop">
                {isBrasil ? 'Premio 1a5' : '4 cifras'}
              </Label>
              <Input 
                id="cuatroCifras-desktop"
                placeholder={isBrasil ? 'Premio 1a5' : '4 cifras'} 
                type="number" 
                step="0.01"
                value={CuatroCifras} 
                onChange={(e) => setCuatroCifras(e.target.value)}
                required
              />
            </div>
            
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="tresCifras-desktop">
                {isBrasil ? 'Decena' : '3 cifras'}
              </Label>
              <Input 
                id="tresCifras-desktop"
                placeholder={isBrasil ? 'Decena' : '3 cifras'} 
                type="number" 
                step="0.01"
                value={TresCifras} 
                onChange={(e) => setTresCifras(e.target.value)}
                required
              />
            </div>
            
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="dosCifras-desktop">
                {isBrasil ? 'Centena' : '2 cifras'}
              </Label>
              <Input 
                id="dosCifras-desktop"
                placeholder={isBrasil ? 'Centena' : '2 cifras'} 
                type="number" 
                step="0.01"
                value={DosCifras} 
                onChange={(e) => setDosCifras(e.target.value)}
                required
              />
            </div>
            
            {!isBrasil && (
              <>
                <div className="flex flex-col gap-y-2">
                  <Label htmlFor="cuatroCombi-desktop">Cuatro combi</Label>
                  <Input 
                    id="cuatroCombi-desktop"
                    placeholder="Cuatro combi" 
                    type="number" 
                    step="0.01"
                    value={CuatroCombi} 
                    onChange={(e) => setCuatroCombi(e.target.value)}
                  />
                </div>
                
                <div className="flex flex-col gap-y-2">
                  <Label htmlFor="tresCombi-desktop">Tres combi</Label>
                  <Input 
                    id="tresCombi-desktop"
                    placeholder="Tres combi" 
                    type="number" 
                    step="0.01"
                    value={TresCombi} 
                    onChange={(e) => setTresCombi(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>

          {/* Versión móvil */}
          <div className="md:hidden space-y-4">
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="nombre-mobile">Nombre</Label>  
              <Input 
                id="nombre-mobile"
                placeholder="Nombre Completo" 
                value={Nombre} 
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="porcentaje_loteria-mobile">% Casa</Label>
                <Input 
                  id="porcentaje_loteria-mobile"
                  placeholder="Porcentaje loteria" 
                  type="number" 
                  step="0.01"
                  value={Porcentaje_loteria} 
                  onChange={(e) => setPorcentaje_loteria(e.target.value)}
                  required
                />
              </div>
              
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="porcentaje_cliente-mobile">% Vendedor</Label>
                <Input 
                  id="porcentaje_cliente-mobile"
                  placeholder="Porcentaje cliente" 
                  type="number" 
                  step="0.01"
                  value={Porcentaje_cliente} 
                  onChange={(e) => setPorcentaje_cliente(e.target.value)}
                  required
                />
              </div>
              
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="porcentaje_admin_zona-mobile">% admin zona</Label>
                <Input 
                  id="porcentaje_admin_zona-mobile"
                  placeholder="Porcentaje admin zona" 
                  type="number" 
                  step="0.01"
                  value={Porcentaje_admin_zona}
                  onChange={(e) => setPorcentaje_admin_zona(e.target.value)}
                  required
                />
              </div>
              
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="cuatroCifras-mobile">
                  {isBrasil ? 'Premio 1a5' : '4 cifras'}
                </Label>
                <Input 
                  id="cuatroCifras-mobile"
                  placeholder={isBrasil ? 'Premio 1a5' : '4 cifras'} 
                  type="number" 
                  step="0.01"
                  value={CuatroCifras} 
                  onChange={(e) => setCuatroCifras(e.target.value)}
                  required
                />
              </div>
              
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="tresCifras-mobile">
                  {isBrasil ? 'Decena' : '3 cifras'}
                </Label>
                <Input 
                  id="tresCifras-mobile"
                  placeholder={isBrasil ? 'Decena' : '3 cifras'} 
                  type="number" 
                  step="0.01"
                  value={TresCifras} 
                  onChange={(e) => setTresCifras(e.target.value)}
                  required
                />
              </div>
              
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="dosCifras-mobile">
                  {isBrasil ? 'Centena' : '2 cifras'}
                </Label>
                <Input 
                  id="dosCifras-mobile"
                  placeholder={isBrasil ? 'Centena' : '2 cifras'} 
                  type="number" 
                  step="0.01"
                  value={DosCifras} 
                  onChange={(e) => setDosCifras(e.target.value)}
                  required
                />
              </div>
              
              {!isBrasil && (
                <>
                  <div className="flex flex-col gap-y-2">
                    <Label htmlFor="cuatroCombi-mobile">Cuatro combi</Label>
                    <Input 
                      id="cuatroCombi-mobile"
                      placeholder="Cuatro combi" 
                      type="number" 
                      step="0.01"
                      value={CuatroCombi} 
                      onChange={(e) => setCuatroCombi(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex flex-col gap-y-2">
                    <Label htmlFor="tresCombi-mobile">Tres combi</Label>
                    <Input 
                      id="tresCombi-mobile"
                      placeholder="Tres combi" 
                      type="number" 
                      step="0.01"
                      value={TresCombi} 
                      onChange={(e) => setTresCombi(e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
          
          <DialogFooter className="mt-4">
            <div className="w-full flex items-center justify-end gap-x-2">
              <DialogClose asChild>
                <Button type="button" variant="destructive">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit">
                Guardar Cambios
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}