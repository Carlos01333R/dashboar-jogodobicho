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
import {Plus, Trash2} from "lucide-react";
import CardVentas from "../CardVentas";
import { useAuth } from "@/context/AuthContext";
import CardVentasBr from "../CardVentasBr";

interface Props {
ventas: [] | any;
desde: string;
hasta: string;
}

export function ModalVentasByFecha({ventas, desde, hasta} : Props) {
  const { selectedCountry } = useAuth();


  return (
    <Dialog >
    
        <DialogTrigger asChild>
          <button className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors cursor-pointer">
      Ver ventas
        </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[725px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex-1 text-center text-xs">Ventas del dia {desde} a {hasta}</DialogTitle>
            
          </DialogHeader>
           <section className="">
            {selectedCountry === 'brazil' ? (
             <CardVentasBr Ventas={ventas} />
             ) : (
            <CardVentas Ventas={ventas} />
             )}
              
              
                
           </section>
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
