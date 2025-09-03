import { DollarSign, Icon } from "lucide-react"
import useVentasPorZona from "@/hook/co/ventasZonas/useSalesDataZona"
import { useState } from "react"
import useVentasHoyAdminZona from "@/hook/co/ventasZonas/useVentasHoyZona"
import useZonas from "@/hook/co/useZonas"
import useTotalPremioPorZona from "@/hook/co/ventasZonas/usePremioHoyZona"
import useSumRewards from "@/hook/co/ventasZonas/useSumRewarts"

interface Props {
  zona: string;
}

export default function DataVentas({zona} : Props) {

  const { data, loading, error } = useVentasPorZona({ zona })
  const { valorBrutaHoy, ventaNetaHoy, gananciasHoy } = useVentasHoyAdminZona({
    sector: zona,
  })
  const { totalPremio, loading: loadingPremio, error: errorPremio } = useTotalPremioPorZona({ zona })
  const { total, loading: loadingRewards, error: errorRewards } = useSumRewards({ zona })
  const { zonas } = useZonas()
  const ventasData = data && data.length > 0 ? data[0] : null


  const adminZona = zonas ? zonas.find((z: any) => z.nombre === zona)?.porcentaje_admin_zona : null

  const adminZonaVentaNeta = zonas ? zonas.find((z: any) => z.nombre === zona)?.porcentaje_loteria : null

  const adminZonaGanancias = zonas ? zonas.find((z: any) => z.nombre === zona)?.porcentaje_cliente : null

  const ventaNetaHoyNew = valorBrutaHoy && adminZonaVentaNeta ? (valorBrutaHoy * adminZonaVentaNeta) / 100 : 0
  const gananciasHoyNew = valorBrutaHoy && adminZonaGanancias ? (valorBrutaHoy * adminZonaGanancias) / 100 : 0
  const gananciasAdminZonaNew = valorBrutaHoy && adminZona ? (valorBrutaHoy * adminZona) / 100 : 0


  const itemsVentasHoy = [
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

  const itemsVentasGenerales = [
  {
      id: 1,
      title: "Total Bruto",
      value: ventasData?.total_valor_bruta || 0, // Using actual data property
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      id: 2,
      title: "Total Neta",
      value:  (ventasData?.total_valor_bruta * adminZonaVentaNeta) /
                              100 || 0, // Using actual data property
      icon: DollarSign,
      color: "bg-blue-500",
    },
    {
      id: 3,
      title: " Admin zona",
      value:  (ventasData?.total_valor_bruta * adminZona) / 100,
      icon: DollarSign,
      color: "bg-orange-500",
    },
    {
      id: 4,
      title: "cliente",
      value:  (ventasData?.total_valor_bruta * adminZonaGanancias) /
                              100 || 0,
      icon: DollarSign,
      color: "bg-gray-500",
    },
    {
      id: 5,
      title: "Premio",
      value: total || 0,
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      id: 6,
      title: "Balance",
      value:  (ventasData?.total_valor_bruta *
                                  adminZonaVentaNeta) /
                                  100 -
                                  total || 0,
      icon: DollarSign,
      color: "bg-yellow-500",
    },
  
  ]

  const FechaActualColombia = new Date().toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' })

  return{
    itemsVentasHoy,
    itemsVentasGenerales,
    FechaActualColombia,
    loading,
    loadingPremio,
    loadingRewards,
    error,
    errorPremio,
    errorRewards
    
  }
}