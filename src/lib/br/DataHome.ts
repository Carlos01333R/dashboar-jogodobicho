
import { useApuestasResumenBr } from "@/hook/br/VentasGenerales"
import { useUsuarios } from "@/hook/co/User"
import { useLoterias } from "@/hook/co/Loterias"
import { useTopLoterias } from "@/hook/br/use-top-loterias"
//import { useWinningLotteries } from "../hook/co/Loterry";

export default function DataHomeBr() {
  const { data, loading, error } = useApuestasResumenBr()
  const {data:dataLotery } = useTopLoterias()

  //const { winningLotteries } = useWinningLotteries();

  const itemsWinningLotteries = [
    [
      {
        lottery: "ASTRO LUNA",
        count: 6,
      },
      {
        lottery: "SINUANO NOCHE",
        count: 6,
      },
      {
        lottery: "CARIBEÑA NOCHE",
        count: 4,
      },
      {
        lottery: "PIJAO DE ORO",
        count: 2,
      },
      {
        lottery: "BOGOTA",
        count: 1,
      },
      {
        lottery: "CRUZ ROJA",
        count: 1,
      },
      {
        lottery: "ASTRO LUNA, CARIBEÑA NOCHE",
        count: 1,
      },
      {
        lottery: "VALLE",
        count: 1,
      },
      {
        lottery: "SINUANO DIA",
        count: 1,
      },
      {
        lottery: "MEDELLIN",
        count: 1,
      },
      {
        lottery: "PAISITA NOCHE",
        count: 1,
      },
      {
        lottery: "ANTIOQUEÑITA 2",
        count: 1,
      },
      {
        lottery: "CARIBEÑA DIA",
        count: 1,
      },
    ],
  ]



  const { cantidad } = useUsuarios()
  const { count } = useLoterias()
 const mesActual = data?.meses?.[0]?.monto_total_apostado ?? 0
const mesAnterior = data?.meses?.[1]?.monto_total_apostado ?? 0
const MesActualNeta = data?.meses?.[0]?.total_neto ?? 0
const MesAnteriorNeta = data?.meses?.[1]?.total_neto ?? 0

  let diferenciaPorcentaje = 0
  let diferenciaNeta = 0

  if (mesAnterior !== 0 && MesAnteriorNeta !== 0) {
    diferenciaPorcentaje = ((mesActual - mesAnterior) / mesAnterior) * 100
    diferenciaNeta = ((MesActualNeta - MesAnteriorNeta) / MesAnteriorNeta) * 100
  } else if (mesActual !== 0 && MesActualNeta !== 0) {
    // Si mesAnterior es 0 y mesActual no, diferencia 100%
    diferenciaPorcentaje = 100
    diferenciaNeta = 100
  }

 const salesChartData = data?.meses?.map((item) => ({
  month: item.mes,
  brasil: item.monto_total_apostado,
  colombia: item.total_neto,
})) || []

  const montoTotal = data?.total_general?.monto_total_apostado ?? 0
  const montoNeto = data?.total_general?.total_neto ?? 0
  const Ganancias = data?.total_general?.ganancias ?? 0
  
   

  const items = {
    VentasTotale: montoTotal,
    VentaNeta: montoNeto,
    Ganancias: Ganancias,
    diferenciaTotal: `${diferenciaPorcentaje >= 0 ? "" : ""}${diferenciaPorcentaje.toFixed(1)}`,
    diferenciaNeta: `${diferenciaNeta >= 0 ? "" : ""}${diferenciaNeta.toFixed(1)}`,
    cantidadUsuarios: cantidad,
    cantidadLoterias: 6,
    ventasChartData: salesChartData,
    winnersChartData: dataLotery,
  }

  return {
    items,
    data,
    loading,
    error,
    
  }
}
