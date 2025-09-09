import { useAuthAdminZona } from "@/context/AuthContextAdminZona"
import CardTotales from "./CardTotales";

interface prop{
    desde: string;
    hasta: string;
    zona: string;
    itemsVentasHoy: any;
    ventas: any;
    error: any;
    loading: any;

}
export default function VentasAdminComponents({desde, hasta, zona, itemsVentasHoy, ventas, error, loading} : prop) {

    const { selectedCountry } = useAuthAdminZona()
    const Apuestas = ventas || 0

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

    return(
        <section>
          <CardTotales desde={desde} hasta={hasta} zona={zona} itemsVentasHoy={itemsVentasHoy} ventas={Apuestas} error={error} loading={loading} />
        </section>
    )
}
                     
