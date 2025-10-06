import useVentasTotales from "@/hook/co/ventasZonas/useVentasFechasZonas";
import usePremioByFecha from "@/hook/co/ventasZonas/usePremioByFecha";
import { useApuestasPorFechabr } from "@/hook/br/VentasZonas/useVentasFechasZonas";
import useZonas from "@/hook/co/useZonas";
import { DollarSign } from "lucide-react";
import { useApuestasPorFecha } from "@/hook/br/useVentasHoy";
import { useGanadoresSummary } from "@/hook/br/use-ganadores-summary";

interface Props {
    desde: string;
    hasta: string;
    zona: string;
}
export default function DataVentasByFechaBr({desde, hasta, zona} : Props) {
 

    const { data, refetch, error, stats, apuestas } = useApuestasPorFechabr({fechaDesde: desde ,fechaHasta: hasta, zona});

    const {
    data: summary,
    loading,
    error: errorSummary,
  } = useGanadoresSummary({
    zona: zona || undefined,
    fecha_inicio: desde || undefined,
    fecha_fin: hasta || undefined,
   
  })

  const totalPremio = summary?.resumen.total_premios || 0
  const ganadores = summary?.ganadores


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

   const Monto_total = stats?.monto_total || 0;

  const ventaNetaHoyNew = (Monto_total * adminZonaVentaNeta) / 100;
  const gananciasHoyNew = (Monto_total* adminZonaGanancias) / 100;
  const gananciasAdminZonaNew = (Monto_total * adminZona) / 100;
  // Primer modal para premios

  const itemsVentasHoybr = [
    {
      id: 1,
      title: "Venta Bruta",
      value: Monto_total || 0,
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      id: 2,
      title: "Venta Neta",
      value: ventaNetaHoyNew,
      icon: DollarSign,
      color: "bg-blue-500",
    },
    {
      id: 3,
      title: "Ganancias",
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
      value: totalPremio,
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      id: 6,
      title: "Balance",
      value: ventaNetaHoyNew - totalPremio,
      icon: DollarSign,
      color: "bg-yellow-500",
    }
  ]
  
    return {
    itemsVentasHoybr,
    apuestas,
    totalPremio,
    ganadores,
    loading,
    error,
    Monto_total,
    ventaNetaHoyNew,
    gananciasHoyNew,
    gananciasAdminZonaNew,
    

 
    
    }
}