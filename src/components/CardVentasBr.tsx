import { FormatCurrencyBR } from "@/utils/Format";
import { Calendar, Download, Phone, Ticket, TrendingUp, User } from "lucide-react";
import { getLotteryInfo } from "@/utils/Format";
import { ModalBoletos } from "./ModalBoletos";


interface Props {
    Ventas : any;
}

interface Venta {
  boletos_apostados: any;
  id: string
  nombre: string
  telefono: string
  loteria: string
  modalidad: string
  numero_apostado: string | null
  grupo_apostado: string | null
  grupos_apostados: string[] | null
  monto: number
  multiplicador: number
  fecha_apuesta: string
  numero_ticket: string
  created_at: string
  loterias_seleccionadas: any;
}

export default function CardVentasBr({Ventas} : Props) {


    
const downloadTicket = async (bet: Venta) => {
  try {
    const betTime = new Date(bet.created_at).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    let ticketContent = `
═══════════════════════════════════════
           JOGO DO BICHO
         LOTERÍA PT - RIO DE JANEIRO
═══════════════════════════════════════

Bilhete: ${bet.numero_ticket}
Fecha: ${bet.fecha_apuesta}
───────────────────────────────────────

APOSTADOR:
${bet.nombre}
Tel: ${bet.telefono}

───────────────────────────────────────
LOTERÍAS SELECCIONADAS:
`;
    bet.loterias_seleccionadas.forEach((lotteryId: string) => {
      const lotteryInfo = getLotteryInfo(lotteryId);
      ticketContent += `- ${lotteryInfo.fullName} (${lotteryInfo.time})\n`;
    });

    ticketContent += `
───────────────────────────────────────

BOLETOS APOSTADOS:
`;
    bet.boletos_apostados.forEach((boleto: any, index: number) => {
      let betDesc = "";
      switch (boleto.modalidad) {
        case "grupo":
          betDesc = `Grupo: ${boleto.grupo_apostado}`;
          break;
        case "decena":
          betDesc = `Decena: ${boleto.numero_apostado?.padStart(2, "0")}`;
          break;
        case "centena":
          betDesc = `Centena: ${boleto.numero_apostado?.padStart(3, "0")}`;
          break;
        case "millar":
          betDesc = `Millar: ${boleto.numero_apostado?.padStart(4, "0")}`;
          break;
        case "multiple":
          betDesc = `Múltiples: ${boleto.numero_apostado}`;
          break;
        case "duque":
          betDesc = `Duque: ${boleto.grupos_apostados?.join(" y ")}`;
          break;
        case "terno":
          betDesc = `Terno: ${boleto.grupos_apostados?.join(", ")}`;
          break;
      }
      ticketContent += `${index + 1}. ${betDesc} (${boleto.modalidad.toUpperCase()}) - R$ ${boleto.monto_individual} x ${boleto.multiplicador_individual}x\n`;
    });

    ticketContent += `
───────────────────────────────────────
MONTO TOTAL APOSTADO: R$ ${bet.monto.toLocaleString()}
Registrado: ${new Date(bet.created_at).toLocaleString("es-ES")}
═══════════════════════════════════════

        ¡BUENA SUERTE!
   Conserve este bilhete para
      verificar resultados
═══════════════════════════════════════
    `;

    // Crear blob y descargar archivo
    const blob = new Blob([ticketContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Crear elemento de descarga
    const a = document.createElement('a');
    a.href = url;
    a.download = `ticket_${bet.numero_ticket}.txt`;
    document.body.appendChild(a);
    a.click();
    
    // Limpiar
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);

  } catch (error) {
    console.error('Error al descargar el ticket:', error);
    alert('No se pudo descargar el ticket');
  }
};

    return(
        <section className="w-full flex justify-end items-center pb-2 ">
     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
       {Ventas.map((venta : any) => (
         <section key={venta.id} className="bg-white rounded-xl shadow-sm flex flex-col justify-end items-center p-2 border border-gray-200">
     <div className="w-full flex-row justify-between items-center ">

        <div className="w-full flex flex-row justify-between items-center">
         
          <p className="text-sm font-bold text-emerald-500">
            {venta.fecha_apuesta}
          </p>
           <p className="text-sm font-bold text-emerald-500">
            #{venta.numero_ticket} 
          </p>
        </div>

        <section className="w-full flex flex-col py-2">
       <div className="flex items-center justify-between">
        <p className="flex items-center  text-gray-500 text-sm"><span><User className="w-4 h-4" /> </span> {venta.vendedor}</p> 
        <p>{venta.nombre}</p>
       </div>
         <div className="flex items-center justify-between">
        <p className="flex items-center  text-gray-500 text-sm"><span><Phone className="w-4 h-4" /> </span> {venta.vendedor}</p> 
        <p>{venta.telefono}</p>
       </div>

         <div className="flex items-center justify-between">
        <p className="flex items-center text-gray-500 text-sm"><span><Calendar className="w-4 h-4" /> </span> {venta.vendedor}</p> 
        <p>{new Date(venta.created_at).toLocaleString("es-ES")}</p>
       </div>
        </section>

        <section className="w-full flex flex-col">
        <div>
             {venta.loterias_seleccionadas.map((loteria: string, index: number) => (
              <div key={index} className="flex justify-between items-center">
                <p className="text-gray-500 text-sm flex items-center gap-x-1" > <Ticket className="w-4 h-4" />Loteria </p>
                <p className="text-emerald-600 flex items-center gap-x-1"> {loteria} </p>
              </div>
            ))}
        </div>

        </section>
        
        <section className="flex justify-between items-center py-2">
            <p className="text-gray-500 text-sm">Boletos</p>
            <ModalBoletos venta={venta.boletos_apostados} />
        </section>

        <div className="flex justify-between items-center">
          <p className="flex items-center text-gray-500 text-sm gap-x-1">
             <TrendingUp className="h-4 w-4 " color='#16a34a'/>
             ganancias potencial
          </p>
          <p className="font-bold text-emerald-600">
             R$ {venta.boletos_apostados.reduce((sum: number, bet: any) => sum + bet.premio, 0)}
          </p>
        </div>

         <div className="flex py-3 w-full ">
      
       <button
       onClick={() => downloadTicket(venta)}
       className="w-full flex gap-2 justify-end items-end 
       "
       >
        <div className="w-full flex flex-row items-center justify-center  gap-x-2 bg-emerald-500 px-3 py-2 rounded-xl">
            <Download className="h-3 w-3" color={"white"} />
            <p className="text-sm font-bold text-white">Descargar Ticket</p>
        </div>
       </button>
      </div>

      </div>


        </section>
       ))}
    </div>
    </section>

    )
}