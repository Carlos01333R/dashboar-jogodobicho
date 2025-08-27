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
import { Clock, Hash, MapPin, SquareM, TicketCheck, TicketMinus, Trash2, Trophy, User} from "lucide-react";
import { FormatCurrencyCO } from "@/utils/Format";

interface Winner {
  lottery: string[];
  boleto: string[];
  premio: number;
  nombre: string;
  celular: string;
  fecha: string;
  hora: string;
  numero_venta: string;
  zona: string;
  email: string;
  venta_total : number;

}

export function ModalDetail({
    lottery,
    boleto,
    premio,
    nombre,
    celular,
    fecha,
    hora,
    numero_venta,
    zona,
    email,
    venta_total
 }: Winner) {

  return (
    <Dialog >
    
        <DialogTrigger asChild>
           <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors cursor-pointer">
                  Ver Detalles
         </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
         <div className="flex items-start justify-between mb-4 pt-2">
                      <div className="flex items-center space-x-3">
                        <div className={`p-3 rounded-full bg-green-100`}>
                          <Trophy className={`w-6 h-6 text-gren-500`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{nombre}</h3>
                          <p className="text-sm text-gray-500">Ticket #{numero_venta}</p>
                        </div>
                      </div>
                      <section className="flex flex-col items-center gap-y-1">
                          <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800 `}>
                        Premiado
                      </span>
                    
                      </section>
                    
                    </div>
          </DialogHeader>
        
             <div className="space-y-3">
                         <div className="flex items-center justify-between">
                           <span className="text-sm text-gray-600">Premio:</span>
                           <span className="text-lg font-bold text-emerald-600">{FormatCurrencyCO(premio)}</span>
                         </div>
                        
           
                         <div className="flex items-center justify-between">
                           <span className="text-sm text-gray-600">Lotería:</span>
                           <span className="text-xs font-medium text-gray-900">{Array.from(lottery).join(", ")}</span>
                         </div>

                         <div className="flex items-center justify-between">
                           <span className="text-sm text-gray-700">Valor de ka venta:</span>
                           <span className="text-xs font-bold text-emerald-700">
                            {FormatCurrencyCO(venta_total)}
                           </span>
                         </div>
           
                         <div className="flex items-center justify-between">
                           <span className="text-sm text-gray-600 flex items-center">
                             <MapPin className="w-4 h-4 mr-1" />
                             Zona:
                           </span>
                           <span className="text-sm font-medium text-gray-900">{zona}</span>
                         </div>
           
                         <div className="flex items-center justify-between">
                           <span className="text-sm text-gray-600 flex items-center">
                             <Clock className="w-4 h-4 mr-1" />
                             fecha y Hora:
                           </span>
                           <span className="text-sm font-medium text-gray-900">{fecha} - {hora}</span>
                         </div>
           
                         <div className="flex items-center justify-between">
                           <span className="text-sm text-gray-600 flex items-center">
                             <User className="w-4 h-4 mr-1" />
                             Contacto:
                           </span>
                           <span className="text-sm font-medium text-gray-900">{celular}</span>
                         </div>

                          <div className="flex items-center justify-between">
                           <span className="text-sm text-gray-600 flex items-center">
                             <User className="w-4 h-4 mr-1" />
                             Vendedor:
                           </span>
                           <span className="text-sm font-medium text-gray-900">{email}</span>
                         </div>
                         
                           <span className="text-sm text-gray-600 flex items-center">
                             <TicketMinus className="w-4 h-4 mr-1" />
                             Boletos:
                           </span>
            
                          {boleto.map((boleto: any, index: number) => (
                         
                      
                         <section className="w-full flex justify-between items-center gap-x-2 ">

                         <div className="w-full flex flex-col ">
                          <section className="flex justify-between ">
                            <span className="text-sm text-gray-600 flex items-center gap-x-1  ">
                              <TicketCheck className="w-4 h-4 mr-1" />
                                    {boleto.lottery}
                                  </span>
                                  <span className="text-black font-bold">
                                    → {boleto.resultado}
                                  </span>
                          </section>
                            <section className="flex justify-between">
                                <p className="flex items-center gap-x-1">
                                    <Hash  className="w-4 h-4 mr-1 text-gray-600" />
                                    <span className="text-emerald-500 bg-emerald-100 rounded-lg p-1 px-2">
                                      {boleto.numero}
                                    </span>
                                  </p>
                                  <span className="text-emerald-700 font-bold">
                                    {FormatCurrencyCO(boleto.premio)}
                                  </span>
                            </section>
                            <span>
                               <div className="text-gray-500 text-xs">
                                  {boleto.match2 && (
                                    <span className="">
                                      2 dígitos
                                    </span>
                                  )}
                                  {boleto.match3 && (
                                    <span className="">
                                      3 dígitos
                                    </span>
                                  )}
                                  {boleto.match4 && (
                                    <span className="">
                                      4 dígitos
                                    </span>
                                  )}
                                  {boleto.combi > 0 && (
                                    <span className="">
                                      Combinada: {boleto.combi}
                                    </span>
                                  )}
                                </div>
                            </span>
                         </div>

                         
                         </section>
                      
                     ))}

                       </div>
                        

         
            <DialogFooter>
            <section className="w-full  flex items-center justify-center gap-x-2">
            <DialogClose asChild>
               <Button className="cursor-pointer">Aceptar</Button>
            </DialogClose>
          
            </section>
          </DialogFooter>
        </DialogContent>
          

    </Dialog>
  )
}