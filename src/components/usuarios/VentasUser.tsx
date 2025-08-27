import { FormatCurrencyCO } from "@/utils/Format";
import DataVentasUsers from "@/lib/DataVentasUsers";
import DataVentasBrasil from "@/lib/DataVentasUserBr";
import CardVentas from "../CardVentas";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatCard from "../StatCard";
import { DollarSign } from "lucide-react";
import { ModalPremio } from "./ModalPremio";


interface Props {
  selectUser: string;
  fechaSeleccionada: string;
  sector: string;
  country: string | null;
}

export default function VistaInfo({
  selectUser,
  fechaSeleccionada,
  sector,
  country,
}: Props) {
  // Llama a la función correspondiente según el país
  const { itemsSale, ventas, loading, error, premio } =
    country === "colombia"
      ? DataVentasUsers({ fechaSeleccionada, selectUser, sector })
      : DataVentasBrasil({ fechaSeleccionada, selectUser, sector });

    if(error) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="font-bold text-xl text-red-600">{error}</p>
          </div>  
        </div>
      )
    }

    if(loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="font-bold text-xl ml-4">Cargando ventas...</p>
        </div>
      )
    }
  return (
    <>
      <section>
        <section className="w-full flex items-center justify-between mb-2 px-2 md:px-4 py-4">
          <p className="flex items-center gap-x-2">
            <DollarSign className="w-4 h-4 text-blue-500" />
            <span className="text-gray-500">Ventas de:</span>
          </p>
          <p className="text-gray-500">{selectUser}</p>
        </section>
    
          <section className="w-full grid grid-cols-2 md:grid-cols-3 gap-x-3 md:gap-x-5 md:p-3 gap-y-2 md:gap-y-2">
            {itemsSale.map((item: any) => (
              <StatCard
                key={item.label}
                title={item.label}
                value={FormatCurrencyCO(item.value)}
                icon={item.icon}
                color={item.color}
                className='text-sm md:text-2xl truncate'
                iconClassName="hidden md:block"
              />
            ))}

            {premio !== 0 && (
              <Card className="border-2 border-zinc-200 rounded-lg p-4 h-20 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] flex flex-col justify-center items-center hover:scale-105 transition-all duration-300">
                <div className="flex items-center">
                  <ModalPremio fecha={fechaSeleccionada} email={selectUser} />
                </div>
              </Card>
            )}
          </section>
        
      </section>
      
      <section className="py-4 w-full">
              {ventas.length > 0 && <CardVentas Ventas={ventas} />}
      </section>
    
    </>
  );
}
