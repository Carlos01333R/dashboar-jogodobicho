import { FormatCurrencyBR, FormatCurrencyCO} from "@/utils/Format";
import CardVentasBr from "../CardVentasBr";
import { EstadisticasVentas } from "./EstadisticasVentas";
import { useAuthAdminZona } from "@/context/AuthContextAdminZona";
import { DollarSign } from "lucide-react";
import CardVentas from "../CardVentas";

interface Props {
    desde: string;
    hasta: string;
    zona: string;
    itemsVentasHoy: any;
    ventas: any;
    error: any;
    loading: any;

}

export default function CardTotales({desde, hasta, zona, itemsVentasHoy, ventas, error, loading} : Props) {
    const { selectedCountry } = useAuthAdminZona()
    
    
    if (loading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <p className="font-bold text-xl ml-4">Cargando datos...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                Error: {error}
            </div>
        );
    }

  return (
    <>
    
      <section className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {itemsVentasHoy.map((item: any) => (
                        <>
                      <div key={item.id} className="bg-white rounded-xl shadow-sm p-2 md:p-6 border border-gray-200 flex justify-center md:justify-between items-center">
                                      <section>
                                        <p className="text-sm text-black font-semibold mb-1 text-center md:text-left">{item.title}</p>
                                        <p className={`font-bold text-gray-900 truncate text-sm md:text-base text-center md:text-left ${item.value < 0 ? 'text-red-600' : ''}`}>
                                            {selectedCountry === 'brazil' ? FormatCurrencyBR(item.value) : FormatCurrencyCO(item.value)}
                                           </p>
                                        <p className="text-gray-500 text-xs py-2 hidden md:block">{desde} - {hasta}</p>
                                      </section>
                                      <section className=" hidden md:block ">
                                         <div className={`p-2 rounded-lg ${item.color}`}>
                                         <DollarSign className="w-4 h-4 text-white" />
                                          </div>
                                      </section>
      
                                
                                      </div>
                                     
                                  </>
                      ))}
                       
                  </section>
              
              <section className="py-4 space-y-4 w-full">
                  <EstadisticasVentas fechaInicio={desde} fechaFin={hasta} zona={zona} />
                <p className="text-end px-3 font-bold text-emerald-500">Ventas</p>
              {ventas?.length > 0 && (
                selectedCountry === 'brazil' ? (
              <CardVentasBr Ventas={ventas} />
                ) : (
              <CardVentas Ventas={ventas} />   
                )

                  )}
                
              </section>
    </>
  )}