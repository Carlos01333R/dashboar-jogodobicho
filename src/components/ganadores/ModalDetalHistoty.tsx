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
import { Clock, MapPin, SquareM, TicketCheck, TicketMinus, Trash2, Trophy, User} from "lucide-react";
import { FormatCurrencyCO } from "@/utils/Format";

interface Winner {
  lottery: string;
  boleto: string;
  result: string;
  match2: boolean;
  match3: boolean;
  match4: boolean;
  premio: number;
  combi: number;
  nombre: string;
  celular: string;
  fecha: string;
  hora: string;
  fecha_hora: string;
  numero_venta: string;
  zona: string;
  email: string;
  venta: number;
  boletos: string[];
  boletos2: string;
}

export function ModalDetailHistory({
    lottery,
    boleto,
    result,
    match2,
    match3,
    match4,
    premio,
    combi,
    nombre,
    celular,
    fecha,
    hora,
    fecha_hora,
    numero_venta,
    zona,
    email,
    venta,
    boletos,
    boletos2,
 }: Winner) {

  return (
    <Dialog >
    
        <DialogTrigger asChild>
           <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors cursor-pointer">
                  Ver Detalles
         </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
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
                           <span className="text-sm text-gray-600">Venta del boleto:</span>
                           <span className="text-lg font-bold text-emerald-600">{FormatCurrencyCO(venta)}</span>
                         </div>
           
                         <div className="flex items-center justify-between">
                           <span className="text-sm text-gray-600">Lotería:</span>
                           <span className="text-sm font-medium text-gray-900">{lottery}</span>
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

                         <section className="flex justify-between items-center gap-x-2">
                         <div className="flex flex-col justify-center items-center">
                        <span className="text-sm text-gray-500 flex items-center gap-x-1">
                            <TicketMinus className="w-4 h-4" />
                            Boletos</span>
                        
                      {boletos != null ? (
                        boletos.map((boleto: string, index: number) => (
                            <p key={index} className="text-sm font-medium text-gray-900">
                            {boleto}
                            </p>
                        ))
                        ) : (
                        <p>{boletos2}</p>
                        )}

                         </div>
                         <div className="flex flex-col justify-center items-center">
                        <span className="text-sm text-gray-500 flex items-center gap-x-1">
                            <TicketCheck  className="w-4 h-4" />
                            Resultado</span>
                        <p className="text-sm font-medium text-gray-900">{result}</p>
                         </div>
                         </section>
                      


                       </div>
                          <div className="flex items-center justify-between">
                           <span className="text-sm text-gray-600 flex items-center">
                             <SquareM  className="w-4 h-4 mr-1" />
                             Modalidad:
                           </span>
                           <span className="text-sm font-bold text-emerald-600">
                        {match2 ? " 2 cifras" : ""}
                        {match3 ? " 3 cifras" : ""}
                        {match4 ? " 4 cifras" : ""}
                        {combi > 0 ? " Con Combi" : ""}
                           </span>
                         </div>

         
            <DialogFooter>
            <section className="w-full  flex items-center justify-center gap-x-2">
            <DialogClose asChild>
              <button className="py-1.5 px-3 bg-red-500 text-white rounded-lg cursor-pointer">Cancelar</button>
            </DialogClose>
            <Button className="cursor-pointer">Aceptar</Button>
            </section>
          </DialogFooter>
        </DialogContent>
          

    </Dialog>
  )
}
