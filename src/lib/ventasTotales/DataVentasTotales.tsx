import DataVentasByFechaBr from "@/lib/br/VentasZonas/DataVentasByFecha";
import DataVentasByFecha from "@/lib/VentasZonas/DataVentasByFecha";
import { DollarSign } from "lucide-react";
import { useEstadisticasVentasFlexible } from "@/hook/rifas/useEstadisticasByFecha";

interface Props {
    desde: string;
    hasta: string;
    zona: string;
}



export default function DataVentasTotales({desde, hasta, zona} : Props) {
    const { premio, ventaBrutaHoyNew, ventaNetaHoyNew: ventaNetaHoyNewCO, gananciasHoyNew: gananciasHoyNewCO, gananciasAdminZonaNew: gananciasAdminZonaNewCO, ventas} = DataVentasByFecha({desde, hasta, zona});
    const { totalPremio, Monto_total, ventaNetaHoyNew, gananciasHoyNew, gananciasAdminZonaNew,  apuestas, ganadores , loading, error} = DataVentasByFechaBr({desde, hasta, zona});
    const { data } = useEstadisticasVentasFlexible({zona, fechaInicio: desde, fechaFin: hasta});

    const totalVentasRifas = data?.total_ventas || 0;
    const totalVentaTotalRifas = data?.total_venta_total || 0;
    const totalVentaNetaRifas = data?.total_venta_neta || 0;
    const totalGananciasRifas = data?.total_ganancias_vendedor || 0;



    const premioTotal = totalPremio + (premio || 0);
    const VentaBruta = ventaBrutaHoyNew + Monto_total + totalVentaTotalRifas;
    const ventaNetaHoyNewTotal = ventaNetaHoyNew + ventaNetaHoyNewCO + totalVentaNetaRifas;
    const gananciasHoyNewTotal = gananciasHoyNew + gananciasHoyNewCO + totalGananciasRifas;
    const gananciasAdminZonaNewTotal = gananciasAdminZonaNew + gananciasAdminZonaNewCO;
   
     const itemsVentasHoyTotal = [
    {
      id: 1,
      title: "Venta Bruta",
      value: VentaBruta,
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      id: 2,
      title: "Venta Neta",
      value: ventaNetaHoyNewTotal,
      icon: DollarSign,
      color: "bg-blue-500",
    },
    {
      id: 3,
      title: "Ganancias",
      value: gananciasHoyNewTotal,
      icon: DollarSign,
      color: "bg-orange-500",
    },
    {
      id: 4,
      title: "Admin Zona",
      value: gananciasAdminZonaNewTotal,
      icon: DollarSign,
      color: "bg-gray-500",
    },
    {
      id: 5,
      title: "premio",
      value: premioTotal ,
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      id: 6,
      title: "Balance",
      value:  ventaNetaHoyNewTotal - premioTotal,
      icon: DollarSign,
      color: "bg-yellow-500",
    }
  ]

  
    const itemVentasBr = [
      {
      id: 1,
      title: "Venta Bruta",
      value: Monto_total,
      icon: DollarSign,
      color: "bg-green-500"
  },
  {
    id: 2,
    title: "Venta Neta",
    value: ventaNetaHoyNew,
    icon: DollarSign,
    color: "bg-blue-500"
  },
  {
    id: 3,
    title: "Ganancias",
    value: gananciasHoyNew,
    icon: DollarSign,
    color: "bg-orange-500"
  },
  {
    id: 4,
    title: "Premio",
    value: totalPremio,
    icon: DollarSign, 
    color: "bg-green-500"  
  }
  

    ]
  
    const itemVentaCo = [
      {
      id: 1,
      title: "Venta Bruta",
      value: ventaBrutaHoyNew,
      icon: DollarSign,
      color: "bg-green-500"
  },
  {
    id: 2,
    title: "Venta Neta",
    value: ventaNetaHoyNewCO,
    icon: DollarSign,
    color: "bg-blue-500"
  },
  {
    id: 3,
    title: "Ganancias",
    value: gananciasHoyNewCO,
    icon: DollarSign,
    color: "bg-orange-500"
  },
  {
    id: 4,
    title: "Premio",
    value: premio,
    icon: DollarSign,
    color: "bg-green-500"
  }
  
    ]

    const itemVentaRifas = [
      {
      id: 1,
      title: "Venta Bruta",
      value: totalVentaTotalRifas,
      icon: DollarSign,
      color: "bg-green-500"
  },
  {
    id: 2,
    title: "Venta Neta",
    value: totalVentaNetaRifas,
    icon: DollarSign,
    color: "bg-blue-500"
  },
  {
    id: 3,
    title: "Ganancias",
    value: totalGananciasRifas,
    icon: DollarSign,
    color: "bg-orange-500"
  }
  
    ]
  
    return {
        itemsVentasHoyTotal,
        ventas,
        ganadores,
        apuestas,
        premio,
        loading,
        error,
        data,
        itemVentasBr,
        itemVentaCo,
        itemVentaRifas,
        gananciasAdminZonaNewTotal



    }
}