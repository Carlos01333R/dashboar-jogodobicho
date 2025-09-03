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
import { Trash2} from "lucide-react";
import { getModalidadText, getModalityColor } from "@/utils/Format";

interface Props {
  venta : any;
}

export function ModalBoletos({venta} : Props) {

  return (
    <Dialog >
    
        <DialogTrigger asChild>
          <button className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors cursor-pointer">
         Ver boletos
        </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] ">
          <DialogHeader>
            <DialogTitle className="flex-1 text-center">Boleto boletos</DialogTitle>
           
          </DialogHeader>
         
            <div className="w-full border-t border-gray-300 items-center mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 ">
           {venta.map((bet: any, index: number) => (
            <div key={index} className="w-full  border-b border-gray-100 last:border-0 last:mb-0 last:pb-0">
              <div className="flex-row justify-between items-start py-4">
                <div>
                  <div className={`inline-block ${getModalityColor(bet.modalidad)}`}>
                    <p className="text-sm font-medium text-center">{getModalidadText(bet.modalidad)}</p>
                  </div>
                  <p className="text-gray-700 mt-2">
                    {bet.numero_apostado ? `Número: ${bet.numero_apostado}` : 
                     bet.grupo_apostado ? `Grupo: ${bet.grupo_apostado}` : 
                     bet.grupos_apostados ? `Grupos: ${bet.grupos_apostados.join(", ")}` : ''}
                  </p>
                </div>
                
                <div className="items-end">
                  <p className="text-gray-500">Monto: R$ {bet.monto_individual}</p>
                  <p className="text-gray-500">Multiplicador: {bet.multiplicador_individual}x</p>
                  <p className="text-green-600 font-semibold">Premio: R$ {bet.premio}</p>
                </div>
              </div>
            </div>
          ))}
          </div>
      
            <DialogFooter>
            <section className="w-full  flex items-center justify-center gap-x-2">
            <DialogClose asChild>
              <button className="py-1.5 px-3 bg-red-500 text-white rounded-lg cursor-pointer">Cancelar</button>
            </DialogClose>
            </section>
          </DialogFooter>
        </DialogContent>
          

    </Dialog>
  )
}
