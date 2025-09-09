import useVentasTotales from "@/hook/co/ventasZonas/useVentasFechasZonas";
import usePremioByFecha from "@/hook/co/ventasZonas/usePremioByFecha";
import useZonas from "@/hook/co/useZonas";
import { DollarSign } from "lucide-react";
interface Props {
    desde: string;
    hasta: string;
    zona: string;
}
export default function DataVentasByFecha({desde, hasta, zona} : Props) {

    const { ventas, loading, error, totales } = useVentasTotales(
   desde, hasta,  zona 
    
  );
  const {
    premio,
    loading: loadingPremio,
    error: errorPremio,
  } = usePremioByFecha({desde, hasta, zona});


  const { zonas } = useZonas();

  const adminZona = zonas
    ? zonas.find((z : any) => z.nombre === zona)?.porcentaje_admin_zona
    : null;

  const adminZonaVentaNeta = zonas
    ? zonas.find((z : any) => z.nombre === zona)?.porcentaje_loteria
    : null;

  const adminZonaGanancias = zonas
    ? zonas.find((z : any) => z.nombre === zona)?.porcentaje_cliente
    : null;

  const ventaNetaHoyNew = (totales?.valorBruta * adminZonaVentaNeta) / 100;
  const gananciasHoyNew = (totales?.valorBruta * adminZonaGanancias) / 100;
  const gananciasAdminZonaNew = (totales?.valorBruta * adminZona) / 100;
  // Primer modal para premios

  const itemsVentasHoy = [
    {
      id: 1,
      title: "Venta Bruta Hoy",
      value: totales?.valorBruta || 0,
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      id: 2,
      title: "Venta Neta Hoy",
      value: ventaNetaHoyNew,
      icon: DollarSign,
      color: "bg-blue-500",
    },
    {
      id: 3,
      title: "Ganancias Hoy",
      value: gananciasHoyNew,
      icon: DollarSign,
      color: "bg-orange-500",
    },
    {
      id: 4,
      title: "Admin Zona",
      value: gananciasAdminZonaNew,
      icon: DollarSign,
      color: "bg-gray-500",
    },
    {
      id: 5,
      title: "premio",
      value: premio,
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      id: 6,
      title: "Balance",
      value: premio ? ventaNetaHoyNew - premio : 0,
      icon: DollarSign,
      color: "bg-yellow-500",
    }
  ]
  
    return {
    itemsVentasHoy,
    ventas,
    premio,
    error,
    loading
    
    }
}