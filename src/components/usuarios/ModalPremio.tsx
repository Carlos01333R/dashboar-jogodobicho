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
import { Trash2,Trophy, Users, Phone, TicketCheck, TicketMinus, TrophyIcon } from "lucide-react";
import useObtenerDetallesWinUser from "@/hook/co/usePremiosByUser";
import { FormatCurrencyCO } from "@/utils/Format";

interface Props { 
  fecha: string;
  email: string;   
}

export function ModalPremio({fecha, email} : Props) {
    const { data, loading, error } = useObtenerDetallesWinUser(fecha, email);
   


  return (
    <Dialog >
    
        <DialogTrigger asChild>
          <button className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-x-1">
         <p>Ver Premios</p>
         <Trophy className="w-4 h-4" /> 
        </button>
        </DialogTrigger>
        {loading ? (
          <p className="text-center py-4 text-xs text-gray-500">Cargando datos...</p>
        ) : (
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex-1 text-center">Premios de {email}</DialogTitle>
            <DialogDescription className="flex-1 text-center">
              <span >Premios de {fecha}</span>
            </DialogDescription>
          </DialogHeader>
          <section className="grid grid-cols-1 md:grid-cols-2 gap-x-5  gap-y-2 md:gap-y-2 overflow-y-scroll ">
           {data?.map((item : any) => (
              <div key={item.email} className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
               <section className="flex justify-between items-center gap-x-2">
            <p className="text-xs ">{item.fecha}</p>
            <p className="text-xs text-emerald-500 font-bold">{item.numero_venta}</p>
               </section>
               <section className="py-1">
                <div className="flex justify-between text-xs ">
                  <span className="flex items-center gap-x-1">
                     <Users className="w-3 h-3 " />
                    <p>Nombre</p>
                  </span>
                  <span>
                  
                    <p>{item.nombre}</p>
                  </span>
                   
                </div>
                <div className="flex justify-between text-xs">
                 <span className="flex items-center gap-x-1">
                     <Phone className="w-3 h-3 " />
                    <p>Telefono</p>
                  </span>
                  <span>
                  
                    <p>{item.celular}</p>
                  </span>
                </div>
               </section>
                 <section className="py-1">
                <div className="flex justify-between text-xs ">
                  <span className="flex items-center gap-x-1">
                     <TicketMinus className="w-3 h-3 " />
                    <p>Boleto</p>
                  </span>
                  <span>
                  
                    <p className="font-bold">{item.boleto}</p>
                  </span>
                   
                </div>
                <div className="flex justify-between text-xs">
                 <span className="flex items-center gap-x-1">
                     <TicketCheck className="w-3 h-3 " />
                    <p>Resultado</p>
                  </span>
                  <span>
                  
                    <p className="font-bold text-emerald-500">{item.result}</p>
                  </span>
                </div>
               </section>
               <section className="py-1">
                <div className="flex justify-between">
                    <span className="text-xs flex items-center gap-x-1">
                        <TrophyIcon className="w-4 h-4 " />
                        Premio:
                    </span>
                    <span>
                        <p className="font-bold text-emerald-500">{FormatCurrencyCO(item.premio)}</p>
                    </span>
                </div>
               </section>
               

               <div className="py-1 w-full flex justify-center items-center"> 
                <a
                                href={`https://view-ticket.vercel.app/ticket?ref_venta=${item.numero_venta}`}
                                target="_blank"
                                rel="noreferrer"
                                className="bg-zinc-900 text-white rounded-lg px-1 py-2 text-sm truncate"
                              >
                                Descargar el ticket
                              </a>
               </div>
                </div>
            ))}
          </section>
            <DialogFooter>
            <section className="w-full  flex items-center justify-center gap-x-2">
            <DialogClose asChild>
              <button className="py-1.5 px-3 bg-red-500 text-white rounded-lg cursor-pointer">Cancelar</button>
            </DialogClose>
           
            </section>
          </DialogFooter>
        </DialogContent>
        )}
          

    </Dialog>
  )
}
