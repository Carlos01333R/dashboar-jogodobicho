import useVentasUserByFecha from "@/hook/co/useVentasUserByfecha";
import usePremioUserByFecha from "@/hook/co/usePremiosUserByFechas";
import useZonas from "@/hook/co/useZonas";
import { FormatCurrencyCO } from "@/utils/Format";
import { DollarSign, Trophy } from "lucide-react";
import { useApuestasUsuario } from "@/hook/br/useVentasUserByFecha";
import { useEffect } from "react";
import { useApuestasUserPorFecha } from "@/hook/br/useSalesUserFecha";
import usePremiosByUsuarioAndDate from "@/hook/br/usePremioUsuarioFecha";


interface Props {
  selectUser: any;
  fechaSeleccionada: string;
  sector: string;
}

export default function DataVentasUsers({fechaSeleccionada, selectUser, sector} : Props) {

  const { stats, apuestas, loading : loadingbr, error: errorbr } = useApuestasUserPorFecha({fechaDesde: fechaSeleccionada, fechaHasta: fechaSeleccionada, usuario: selectUser});
  
  const { premios, loading: loadingPremio, error: errorPremio } = usePremiosByUsuarioAndDate(selectUser, fechaSeleccionada);

  console.log(fechaSeleccionada)


  const premiobr = premios || 0;
  console.log('Premios', premios)

  const { zonas } = useZonas();

  const adminZona = zonas
    ? zonas.find((z : any) => z.nombre === sector)?.porcentaje_admin_zona
    : null;

  const adminZonaVentaNeta = zonas
    ? zonas.find((z : any) => z.nombre === sector)?.porcentaje_loteria
    : null;

  const adminZonaGanancias = zonas
    ? zonas.find((z : any) => z.nombre === sector)?.porcentaje_cliente
    : null;

 
    const montoTotal = stats?.monto_total || 0;
       const ventaNetaHoyNew =
    (montoTotal * adminZonaVentaNeta) / 100;
  const gananciasHoyNew =
    (montoTotal * adminZonaGanancias) / 100;
  const gananciasAdminZonaNew = (montoTotal * adminZona) / 100;
   
 
  const itemsSalebr = [
    {

      label: "Venta Bruta",
      value: montoTotal,
      icon: DollarSign,
      color: "bg-emerald-500",
    },
    {
      label: "Venta Neta",
      value: ventaNetaHoyNew,
      icon: DollarSign,
      color: "bg-blue-500",
    },
    {
      label: "premio",
      value: premiobr,
      icon: Trophy,
      color: "bg-emerald-500",
    },
    {
      label: "Ganancias Admin Zona",
      value: gananciasAdminZonaNew,
      icon: DollarSign,
      color: "bg-blue-500",
    },
    {
      label: "Ganancias Clientes",
      value: gananciasHoyNew,
      icon: DollarSign,
      color: "bg-blue-500",
    },
    {
      label: `total de entregar a ${selectUser}`,
      value: ventaNetaHoyNew + gananciasAdminZonaNew,
      icon: DollarSign,
      color: "bg-blue-500",
    },
  ];




  return{
    itemsSalebr,
    apuestas,
    stats, 
    loadingbr,
    errorbr,
    premiobr,
    
   
  }
}
