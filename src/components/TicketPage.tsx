
'use client'
import useObtenerBoletoPorTicket from "@/hook/br/useObtenerBoletoPorTicket";
import { Card, CardContent } from "./ui/card";
import { AlertCircle } from "lucide-react";
import { FormatCurrencyBR } from "@/utils/Format";
import { Loteria, useLoteriasRg } from "@/hook/br/InforLoterias";
import { createLotteryInfoGetter } from "@/utils/InforLoterry";


export default function TicketPageClient({ ticketId }: { ticketId: string }) {
    const { boleto, loading, error } = useObtenerBoletoPorTicket({numeroTicket: ticketId});
    const { loterias } = useLoteriasRg();
    const getLotteryInfo = createLotteryInfoGetter(loterias);
   
    

    if (loading) {
      return (
        <section className="space-y-6">
            <div className="p-6">
              <h1 className="text-xl font-bold mb-4">Cargando boleto...</h1>
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-blue-600">
                    <AlertCircle className="h-5 w-5" />
                    <span>Cargando boleto...</span>
                  </div>
                </CardContent>
              </Card>
            </div>
        </section>
      )
    }

    if (error) {
      return (
        <section className="space-y-6">
        
          <div className="p-6">
            <h1 className="text-xl font-bold mb-4">Error al cargar boleto</h1>
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  <span>{error}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )
    }

    if (!ticketId) {
      return (
        <section className="flex-1 justify-center items-center">
          <h1 className="text-3xl font-bold text-primary mb-2">Boleto no encontrado</h1>
          <p className="text-muted-foreground">No se encontró el boleto solicitado.</p>
        </section>
      )
    }
  return (
    <section className="flex-1 flex justify-center items-center py-10 px-3">

        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden  border-4 border-dashed border-emerald-500 p-3">
            <section className="flex flex-col justify-center items-center border-b border-dashed border-gray-500 mb-2">
                <span className="font-bold">CHANCES PLUS</span>
           
            </section>

            <section className="border-b border-dashed border-gray-500 p-3">
                <p className="font-bold text-emerald-400"><span className="font-semibold text-black">Número do bilhete:</span> {boleto?.numero_ticket}</p>
                <p className="font-semibold">Data: <span className="font-bold">{boleto?.fecha_apuesta} - {boleto?.hora_apuesta}</span></p>
            </section>

               <section className="border-b border-dashed border-gray-500 p-3">
                <p className="font-bold text-emerald-400"><span className="font-semibold text-black">Apostador:</span> {boleto?.nombre}</p>
                <p className="font-semibold">Telefone: <span className="font-bold">{boleto?.telefono}</span></p>
            </section>


            <section className="flex flex-col justify-center items-center border-b border-dashed border-gray-500 p-3">
              <p className="font-bold">Loterias seleccionadas:</p>
              <div className="bg-emerald-50 flex flex-wrap gap-x-2 px-3 py-1 rounded-lg">
               {boleto?.loterias_seleccionadas.map((loteria, index) => {
                const lotteryInfo = getLotteryInfo(loteria);
                return (
                  <div key={index} className="flex items-center gap-x-2">
                    <p className="text-emerald-500">
                      {lotteryInfo.name} - {lotteryInfo.time}
                    </p>
                  </div>
                );
              })}
              </div>
            </section>

       <section className="flex flex-col justify-center items-center border-b border-dashed border-gray-500 p-3">
  <p className="font-bold">Bilhetes apostados:</p>
  <div className="bg-emerald-50 flex flex-col gap-x-4 gap-y-2 px-3 py-2 rounded-lg">
    {boleto?.boletos_apostados.map((apuesta : any, index : any) => (
      <div key={index} className="flex flex-row items-center gap-x-2 border p-2 rounded-md bg-white shadow-sm">
        <p className=" font-semibold">
          Número: <span className="text-emerald-500 font-bold text-center">{apuesta.numero_apostado}</span> 
        </p>
        <p className="font-semibold text-sm">
          Modalidade: <span className="font-bold text-center">{apuesta.modalidad}</span>
        </p>
        <p className="font-semibold text-sm">
          Prêmio: <span className="font-bold text-center">{apuesta.premio}</span>
        </p>
        <p className="font-semibold text-sm">
          Valor: <span>{FormatCurrencyBR(Number(apuesta.monto_individual))}</span>
        </p>
      </div>
    ))}
  </div>
</section>

          <section className="border-b border-dashed border-gray-500 p-3">
                <p className="font-bold text-emerald-400"><span className="font-semibold text-black">Monto total apostado:</span> {FormatCurrencyBR(Number(boleto?.monto))}</p>
                <p className="font-semibold">Fecha seleccionada: <span className="font-bold">{boleto?.fecha_apuesta}</span></p>
          </section>


 <section className=" border-gray-500 p-3 flex flex-col justify-center items-center">
                <p className="font-bold text-2xl">!Boa sorte!</p>
                <p className="font-semibold text-center">
                    <span className="text-gray-500">uarde este bilhete para conferir os resultados.</span>
                </p>
          </section>


        </div>
    </section>
  )}