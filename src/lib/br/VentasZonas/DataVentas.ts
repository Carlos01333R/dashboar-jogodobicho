import { DollarSign, Icon } from "lucide-react"
import useZonaSummary from "../../../hook/br/VentasZonas/useSalesDataZonas"
import useZonas from "@/hook/co/useZonas"
import { useGanadoresSummary } from "@/hook/br/use-ganadores-summary";

interface Props {
  zona: string;
}

export default function DataVentasBr({zona} : Props) {

  const { data, loading : loadingbr, error: errorbr } = useZonaSummary({ zona });
  const { zonas } = useZonas()
    const {
      data: summary,
      loading,
      error,
    } = useGanadoresSummary()

    
 

    const totalPremio = summary?.resumen.total_premios || 0

  const adminZona = zonas ? zonas.find((z: any) => z.nombre === zona)?.porcentaje_admin_zona : null

  const adminZonaVentaNeta = zonas ? zonas.find((z: any) => z.nombre === zona)?.porcentaje_loteria : null

  const adminZonaGanancias = zonas ? zonas.find((z: any) => z.nombre === zona)?.porcentaje_cliente : null

  {/*
     const ventaNetaHoyNew = valorBrutaHoy && adminZonaVentaNeta ? (valorBrutaHoy * adminZonaVentaNeta) / 100 : 0
  const gananciasHoyNew = valorBrutaHoy && adminZonaGanancias ? (valorBrutaHoy * adminZonaGanancias) / 100 : 0
  const gananciasAdminZonaNew = valorBrutaHoy && adminZona ? (valorBrutaHoy * adminZona) / 100 : 0
    */}
 

  const MontonTotal = data?.total_monto ?? 0


  {/*
  const itemsVentasHoybr = [
    {
      id: 1,
      title: "Venta Bruta Hoy",
      value: valorBrutaHoy,
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
      value: totalPremio,
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      id: 6,
      title: "Balance",
      value: totalPremio ? ventaNetaHoyNew - totalPremio : 0,
      icon: DollarSign,
      color: "bg-yellow-500",
    }
  ]

  */}
  const itemsVentasGeneralesbr = [
  {
      id: 1,
      title: "Total Bruto",
      value: MontonTotal || 0, // Using actual data property
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      id: 2,
      title: "Total Neta",
      value:  (MontonTotal * adminZonaVentaNeta) /
                              100 || 0, // Using actual data property
      icon: DollarSign,
      color: "bg-blue-500",
    },
    {
      id: 3,
      title: " Admin zona",
      value:  (MontonTotal * adminZona) / 100,
      icon: DollarSign,
      color: "bg-orange-500",
    },
    {
      id: 4,
      title: "cliente",
      value:  (MontonTotal * adminZonaGanancias) /
                              100 || 0,
      icon: DollarSign,
      color: "bg-gray-500",
    },
    {
      id: 5,
      title: "Premio",
      value:  totalPremio,
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      id: 6,
      title: "Balance",
      value:  (MontonTotal * adminZonaVentaNeta) /
                              100 - totalPremio || 0,
      icon: DollarSign,
      color: "bg-yellow-500",
    },
  
  ]

  const FechaActualColombiabr = new Date().toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' })

  return{
    data,
    //itemsVentasHoybr,
    itemsVentasGeneralesbr,
    FechaActualColombiabr,
    loadingbr,
    //loadingPremiobr,
    //loadingRewardsbr,
    errorbr,
    //errorPremiobr,
    //errorRewardsbr
    
  }
}