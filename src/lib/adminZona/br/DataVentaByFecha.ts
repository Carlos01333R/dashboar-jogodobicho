import { useVentasStatsBr } from "@/hook/adminZona/br/useVentasStats";
import useZonas from "@/hook/adminZona/useZonas";
import * as XLSX from 'xlsx';

interface EstadisticasVentasProps {
  fechaInicio: string;
  fechaFin: string;
  zona: string;
}

interface VentasStats {
  usuario_email: string;
  total_valor_bruta: number;
  total_venta_neta: number;
  total_ganancias: number;
  total_premios: number;
}

export default function DataVentasByFechaAdminZonaBr({
  fechaInicio,
  fechaFin,
  zona,
}: EstadisticasVentasProps) {
  const { data: rawDataBR, loading: loadingBR, error: errorBR } = useVentasStatsBr({ fechaInicio, fechaFin, zona });
  const { zonas } = useZonas();

  // 🔹 Transformar strings → números
  const dataBR: VentasStats[] = rawDataBR.map((item: any) => ({
    usuario_email: item.usuario_email,
    total_valor_bruta: Number(item.total_valor_bruta),
    total_venta_neta: Number(item.total_venta_neta),
    total_ganancias: Number(item.total_ganancias),
    total_premios: Number(item.total_premios),
  }));

  const adminZonaBR =
    zonas?.find((z: any) => z.nombre === zona)?.porcentaje_admin_zona || 0;

  const GananciasAdminZona = dataBR.map(
    (item: VentasStats) => (item.total_valor_bruta * adminZonaBR) / 100
  );

  const ventaNetaAjustadaBR = dataBR.map(
    (item: VentasStats, index: number) =>
      item.total_venta_neta
  );

  const balanceNetoAjustadoBR = dataBR.map(
    (item: VentasStats, index: number) =>
      ventaNetaAjustadaBR[index] - item.total_premios
  );

  // 🔹 Totales
  const totalValorBrutaBR = dataBR.reduce((sum, item) => sum + item.total_valor_bruta, 0);
  const totalVentaNetaBR = dataBR.reduce((sum, item) => sum + item.total_venta_neta, 0);
  const totalGananciasBR = dataBR.reduce((sum, item) => sum + item.total_ganancias, 0);
  const totalPremiosBR = dataBR.reduce((sum, item) => sum + item.total_premios, 0);

  const totalGananciasAdminZonaBR = GananciasAdminZona.reduce((sum, item) => sum + item, 0);
  const totalVentaNetaAjustadaBR = totalVentaNetaBR ;
  const totalBalanceNetoBR = totalVentaNetaAjustadaBR - totalPremiosBR;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const exportToExcelBR = () => {
    const excelData = dataBR.map((item: VentasStats, index: number) => ({
      Usuario: item.usuario_email,
      "Valor Bruta": item.total_valor_bruta,
      "Venta Neta": item.total_venta_neta,
      "Ganancias Admin Zona": GananciasAdminZona[index],
      "Venta Neta Ajustada": ventaNetaAjustadaBR[index],
      Ganancias: item.total_ganancias,
      Premios: item.total_premios,
      "Balance Neto": balanceNetoAjustadoBR[index],
    }));

    excelData.push({
      Usuario: "TOTALES",
      "Valor Bruta": totalValorBrutaBR,
      "Venta Neta": totalVentaNetaBR,
      "Ganancias Admin Zona": totalGananciasAdminZonaBR,
      "Venta Neta Ajustada": totalVentaNetaAjustadaBR,
      Ganancias: totalGananciasBR,
      Premios: totalPremiosBR,
      "Balance Neto": totalBalanceNetoBR,
    });

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Estadísticas Ventas");

    // Ajustar ancho de columnas
    ws["!cols"] = [
      { wch: 25 },
      { wch: 15 },
      { wch: 15 },
      { wch: 20 },
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
    ];

    const fechaExport = new Date().toISOString().split("T")[0];
    const fileName = `estadisticas_ventas_${zona}_${fechaExport}.xlsx`;

    XLSX.writeFile(wb, fileName);
  };

  return {
    dataBR,
    loadingBR,
    errorBR,
    totalBalanceNetoBR,
    totalGananciasBR,
    totalGananciasAdminZonaBR,
    totalPremiosBR,
    totalVentaNetaBR,
    totalVentaNetaAjustadaBR,
    totalValorBrutaBR,
    exportToExcelBR,
    ventaNetaAjustadaBR,
    balanceNetoAjustadoBR,
    adminZonaBR,
  };
}
