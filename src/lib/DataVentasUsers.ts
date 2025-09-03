import useVentasUserByFecha from "@/hook/co/useVentasUserByfecha";
import usePremioUserByFecha from "@/hook/co/usePremiosUserByFechas";
import useZonas from "@/hook/co/useZonas";
import { FormatCurrencyCO } from "@/utils/Format";
import { DollarSign, Trophy } from "lucide-react";

interface Props {
  selectUser: string;
  fechaSeleccionada: string;
  sector: string;
}

export default function DataVentasUsers({fechaSeleccionada, selectUser, sector} : Props) {
    const { ventas, loading, error, totales } = useVentasUserByFecha(
    fechaSeleccionada,
    fechaSeleccionada,
    selectUser
  );

  const {
    premio,
    loading: loadingPremio,
    error: errorPremio,
  } = usePremioUserByFecha(fechaSeleccionada, fechaSeleccionada, selectUser);

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

  const ventaNetaHoyNew =
    (totales?.total_valor_bruta * adminZonaVentaNeta) / 100;
  const gananciasHoyNew =
    (totales?.total_valor_bruta * adminZonaGanancias) / 100;
  const gananciasAdminZonaNew = (totales?.total_valor_bruta * adminZona) / 100;

  const itemsSale = [
    {

      label: "Venta Bruta",
      value: totales?.total_valor_bruta,
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
      value: premio,
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
    itemsSale,
    ventas,
    loading,
    error,
    premio,
  
    
   
  }
}
