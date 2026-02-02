import { supabase } from "@/lib/supabase";
import { DollarSign, Edit } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

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
  milla: number | null;
  centena: number | null;
  decena: number | null;
  millar1a5: number | null;
  centena1a5: number | null; 
  decena1a5: number | null;
  isOpen: boolean; // 👈 ahora se controla desde afuera
  onClose: () => void; // 👈 cerrar desde afuera
}


export default function ModalUpdateZonas({
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
  pais,
  milla,
  centena,
  decena,
  millar1a5,
  centena1a5, 
  decena1a5,
  isOpen,
  onClose
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
  const [Milla, setMilla] = useState(milla?.toString() || "");
  const [Centena, setCentena] = useState(centena?.toString() || "");
  const [Decena, setDecena] = useState(decena?.toString() || "");
  const [Millar1a5, setMillar1a5] = useState(millar1a5?.toString() || "");
  const [Centena1a5, setCentena1a5] = useState(centena1a5?.toString() || "");
  const [Decena1a5, setDecena1a5] = useState(decena1a5?.toString() || "");
 
   
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
        !DosCifras ||
        !Milla ||
        !Centena ||
        !Decena ||
        !Millar1a5 ||
        !Centena1a5 ||
        !Decena1a5
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
            "milla": parseNumberField(Milla),
            "centena": parseNumberField(Centena),
            "decena": parseNumberField(Decena),
            "millar1a5": parseNumberField(Millar1a5),
            "centena1a5": parseNumberField(Centena1a5),
            "decena1a5": parseNumberField(Decena1a5),
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
    <div className="flex z-50 items-center justify-center ">
       

      {/* Fondo oscuro */}
      {isOpen && (
        <div
          className="fixed z-40 inset-0 flex justify-center items-center backdrop-blur-sm bg-opacity-50  transition-opacity"
          onClick={() => onClose()}
        >
          {/* Contenido del modal */}
          <div
            className="bg-white w-[90%] rounded-2xl shadow-xl p-6 relative z-30 sm:max-w-[725px] md:max-w-2xl max-h-[90vh] apsolute  flex-col overflow-y-scroll"
            onClick={(e) => e.stopPropagation()} // Evita cerrar si se hace click dentro
          >

            <p className="text-center py-4 font-bold">Editar zona {nombre}</p>

              <form onSubmit={handleSubmit}>
          {/* Versión escritorio */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
               millar 
              </Label>
              <Input 
                id="cuatroCifras-desktop"
                placeholder="Milla"
                type="number" 
                step="0.01"
                value={Milla}
                onChange={(e) => setMilla(e.target.value)}
                required
              />
            </div>
            
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="tresCifras-desktop">
              Centena
              </Label>
              <Input 
                id="tresCifras-desktop"
                placeholder="Centena"
                type="number" 
                step="0.01"
                value={Centena}
                onChange={(e) => setCentena(e.target.value)}
              
                required
              />
            </div>
            
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="dosCifras-desktop">
               Decena
              </Label>
              <Input 
                id="dosCifras-desktop"
                placeholder="Decena"
                type="number" 
                step="0.01"
                value={Decena}
                onChange={(e) => setDecena(e.target.value)}
              
                required
              />
            </div>
          
                <div className="flex flex-col gap-y-2">
                  <Label htmlFor="cuatroCifras1a5-desktop">
                   millar1a5
                  </Label>
                  <Input 
                    id="cuatroCifras1a5-desktop"
                    placeholder="Millar1a5"
                    type="number" 
                    step="0.01"
                    value={Millar1a5}
                    onChange={(e) => setMillar1a5(e.target.value)}
                  
                    required
                  />
                </div>
                
                <div className="flex flex-col gap-y-2">
                  <Label htmlFor="tresCifras1a5-desktop">
                  Centena1a5
                  </Label>
                  <Input 
                    id="tresCifras1a5-desktop"
                    placeholder="Centena1a5"
                    type="number" 
                    step="0.01"
                    value={Centena1a5}
                    onChange={(e) => setCentena1a5(e.target.value)}
                   
                    required
                  />
                </div>
                
                <div className="flex flex-col gap-y-2">
                  <Label htmlFor="dosCifras1a5-desktop">
                    Decena1a5
                  </Label>
                  <Input 
                    id="dosCifras1a5-desktop"
                    placeholder="Decena1a5"
                    type="number" 
                    step="0.01"
                    value={Decena1a5}
                    onChange={(e) => setDecena1a5(e.target.value)}
                    
                    required
                  />
                </div>
          
          </div>
        
        <section className="flex justify-center items-center py-4">
          <p className="text-black font-bold">Datos de modalidades de colombia</p>
        </section>
          <section className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="nombre-mobile">4 cifras</Label>  
              <Input 
                id="nombre-mobile"
                placeholder="4 cifras"
                value={CuatroCifras} 
                onChange={(e) => setCuatroCifras(e.target.value)}
                required
              />
            </div>
            
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="porcentaje_loteria-mobile">3 cifras</Label>
              <Input 
                id="porcentaje_loteria-mobile"
                placeholder="3 cifras" 
                type="number" 
                step="0.01"
                value={TresCifras} 
                onChange={(e) => setTresCifras(e.target.value)}
                required
              />
            </div>
            
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="porcentaje_cliente-mobile">2 cifras</Label>
              <Input 
                id="porcentaje_cliente-mobile"
                placeholder="2 cifras" 
                type="number" 
                step="0.01"
                value={DosCifras} 
                onChange={(e) => setDosCifras(e.target.value)}
                required
              />
            </div>

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
          </section>

        
        
            <div className="w-full flex items-center justify-end gap-x-2 py-4">
                <Button
                onClick={() => onClose()}
                type="button" variant="destructive">
                  Cancelar
                </Button>
         
              <Button type="submit">
                Guardar Cambios
              </Button>
            </div>
        
        </form>
        
          
          </div>
        </div>
      )}
    </div>
  );
}