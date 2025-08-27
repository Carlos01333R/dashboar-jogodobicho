import { FormatCurrencyCO } from "@/utils/Format";
import { useState } from "react";
interface Props {
    Ventas : any;
}
export default function CardVentas({Ventas} : Props) {
     const [search, setSearch] = useState("");
     
    const FilterNumeroTicket = (Ventas : any) => {
    if (Ventas.length > 0) {
      return Ventas.filter((venta : any) =>
        venta.numero_venta.toLowerCase().includes(search.toLowerCase())
      );
    } else {
      return Ventas;
    }
  };

  const FilterTicket = FilterNumeroTicket(Ventas);

    return (
        <>
         <section className="w-full flex justify-end items-center pb-2 ">
        <form className="md:px-3">
          <input
            type="text"
            placeholder="Buscar por ticket..."
            className="border-b-2 bg-white border-zinc-900 rounded-lg p-2 text-black"
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
      </section>
      
          <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-5  gap-y-2 md:gap-y-0">
               {Ventas.length > 0 && FilterTicket.length > 0 ? (
                 FilterTicket.map((venta : any, index : number) => (
                   <div key={index}>
                     <section className=" bg-white shadow-sm flex flex-col justify-end items-center rounded-xl mt-3 ">
                       <div className="w-full flex justify-between items-center p-2 rounded-lg">
                         <p className="bg-[#101828] text-white rounded-lg px-1 text-sm md:text-base">
                           {venta.fecha}  -  {venta.hora}
                         </p>
                         <p className="text-green-600 font-bold ">
                           {" "}
                           #Venta {venta.numero_venta}
                         </p>
                       </div>
                       <div className="w-full flex justify-between items-center p-2 rounded-lg">
                         <article className="flex flex-col justify-center items-center">
                           <p className="font-bold text-lg">Tipo</p>
                           <p className="bg-[#009966] p-1 px-1 rounded-sm text-white">
                             {venta.juego}
                           </p>
                         </article>
                         <article className="flex flex-col justify-center items-center">
                           <p className="font-bold text-lg">Venta</p>
                           <p> {FormatCurrencyCO(venta.valor_bruta)}</p>
                         </article>
                         <article className="flex flex-col justify-center items-center">
                           <p className="font-bold text-lg">Cliente</p>
                           <div className="flex flex-col justify-center items-center">
                             <p>{venta.nombre} </p>
                             <p>{venta.celular}</p>
                           </div>
                         </article>
                       </div>
       
                       <div className="w-full flex justify-center items-center mt-1 mb-2">
                         <a
                           href={`https://admin-loterias.vercel.app/ticket?ref_venta=${venta.numero_venta}`}
                           target="_blank"
                           rel="noreferrer"
                           className="bg-[#009966] text-white rounded-lg px-1 py-2 text-sm"
                         >
                           Descargar el ticket
                         </a>
                       </div>
                     </section>
                   </div>
                 ))
               ) : (
                 <p>No hay ventas para este periodo</p>
               )}
             </section>
        </>
    )
}