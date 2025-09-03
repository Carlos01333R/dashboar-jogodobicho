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
import {Clock, MapPin, Plus, Trash2, Trophy, User} from "lucide-react";
import useObtenerDetallesWin from "@/hook/co/ventasZonas/useObternerDetallesWin";

interface Props {
zona: string;
desde: string;
hasta: string;
}

export function ModalWin({zona, desde, hasta} : Props) {

const { data, loading, error } = useObtenerDetallesWin(desde, hasta, zona);

  return (
    <Dialog >
    
        <DialogTrigger asChild>
          <button className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors cursor-pointer">
      Ver premios
        </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[725px] ">
          <DialogHeader>
            <DialogTitle className="flex-1 text-center text-xs">Ventas del dia {desde} a {hasta}</DialogTitle>
            
          </DialogHeader>
           <section className="grid grid-cols-2 md:grid-cols-3 gap-x-3 md:gap-x-5 md:p-3 gap-y-2 md:gap-y-2">
    
            {data && data.length > 0 && (
             <div key={data.numero_venta} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className={`p-3 rounded-full bg-green-100`}>
                              <Trophy className={`w-6 h-6 text-gren-500`} />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{data.nombre}</h3>
                              <p className="text-sm text-gray-500">Ticket #{data.numero_venta}</p>
                            </div>
                          </div>
                          <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800 `}>
                            Premiado
                          </span>
                        </div>
            
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Premio:</span>
                            <span className="text-lg font-bold text-emerald-600">${data.premio.toLocaleString()}</span>
                          </div>
            
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Boleto:</span>
                            <span className="text-sm font-medium text-gray-900">{data.boleto}</span>
                          </div>

                           <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Resultado:</span>
                            <span className="text-sm font-medium text-gray-900">{data.result}</span>
                          </div>
            
                      
            
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              fecha y Hora:
                            </span>
                            <span className="text-sm font-medium text-gray-900">{data.fecha} - {data.hora}</span>
                          </div>
            
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 flex items-center">
                              <User className="w-4 h-4 mr-1" />
                              Contacto:
                            </span>
                            <span className="text-sm font-medium text-gray-900">{data.celular}</span>
                          </div>

                           <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 flex items-center">
                              <User className="w-4 h-4 mr-1" />
                              vendedor:
                            </span>
                            <span className="text-sm font-medium text-gray-900">{data.email}</span>
                          </div>

                        
                           <div className="w-full flex items-center justify-center ">
                             <a
                                href={`https://admin-loterias.vercel.app/ticket?ref_venta=${data.numero_venta}`}
                                target="_blank"
                                rel="noreferrer"
                                className="bg-zinc-900 text-white rounded-lg px-1 py-2 text-sm truncate"
                              >
                                Descargar el ticket
                              </a>
                          </div>



                        </div>

                        
            
                      
                      </div>
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
