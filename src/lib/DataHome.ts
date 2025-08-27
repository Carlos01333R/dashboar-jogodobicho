import { useVentasResumen } from "@/hook/co/VentasGenerales"
import { useUsuarios } from "@/hook/co/User"
import { useLoterias } from "@/hook/co/Loterias"
import { useWinningLotteries } from "../hook/co/Loterry";

export default function DataHome() {
    const { data, loading, error } = useVentasResumen();
    const { winningLotteries } = useWinningLotteries();
    
  
    const { cantidad } = useUsuarios();
    const { count } = useLoterias();
    const mesActual = data?.meses[0]?.total_bruto ?? 0;
    const mesAnterior = data?.meses[1]?.total_bruto ?? 0;
    const MesActualNeta = data?.meses[0]?.total_neta ?? 0;
    const MesAnteriorNeta = data?.meses[1]?.total_neta ?? 0;

    let diferenciaPorcentaje = 0;
    let diferenciaNeta = 0;

    if (mesAnterior !== 0 && MesAnteriorNeta !== 0) {
    diferenciaPorcentaje = ((mesActual - mesAnterior) / mesAnterior) * 100;
    diferenciaNeta = ((MesActualNeta - MesAnteriorNeta) / MesAnteriorNeta) * 100;
    } else if (mesActual !== 0 && MesActualNeta !== 0) {
    // Si mesAnterior es 0 y mesActual no, diferencia 100%
    diferenciaPorcentaje = 100;
    diferenciaNeta = 100;

    }

    const salesChartData = data?.meses.map(item => ({
    month: item.mes,
    brasil: item.total_bruto,
    colombia: item.total_neta
    })) || [];

    const items = {
        VentasTotale: data?.total_general.total_bruto,
        VentaNeta: data?.total_general.total_neta,
        Ganancias: data?.total_general.ganancias,  
       diferenciaTotal: `${diferenciaPorcentaje >= 0 ? '' : ''}${diferenciaPorcentaje.toFixed(1)}`,
       diferenciaNeta: `${diferenciaNeta >= 0 ? '' : ''}${diferenciaNeta.toFixed(1)}`,
       cantidadUsuarios: cantidad,
       cantidadLoterias: count,
       ventasChartData: salesChartData,
    winnersChartData: winningLotteries,
    }

    return {
        items,
        data,
        loading,
        error
    }
}