import { useVentasStats } from "@/hook/adminZona/co/useVentasStats";
import useZonas from "@/hook/co/useZonas";
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



export default function DataVentasByFechaAdminZona({fechaInicio,
  fechaFin,
  zona} : EstadisticasVentasProps) {
    
     const { data, loading, error } = useVentasStats({ fechaInicio, fechaFin, zona });
  const { zonas } = useZonas();

  const adminZona = zonas
    ? zonas.find((z: any) => z.nombre === zona)?.porcentaje_admin_zona || 0
    : 0;

  const GananciasAdminZona = data.map((item: VentasStats) => 
    item.total_valor_bruta * adminZona / 100
  );

  const ventaNetaAjustada = data.map((item: VentasStats, index: number) => 
    item.total_venta_neta + GananciasAdminZona[index]
  );

  const balanceNetoAjustado = data.map((item: VentasStats, index: number) => 
    ventaNetaAjustada[index] - item.total_premios
  );

  const totalValorBruta = data.reduce((sum, item) => sum + item.total_valor_bruta, 0);
  const totalVentaNeta = data.reduce((sum, item) => sum + item.total_venta_neta, 0);
  const totalGanancias = data.reduce((sum, item) => sum + item.total_ganancias, 0);
  const totalPremios = data.reduce((sum, item) => sum + item.total_premios, 0);
  const totalGananciasAdminZona = GananciasAdminZona.reduce((sum, item) => sum + item, 0);
  const totalVentaNetaAjustada = totalVentaNeta + totalGananciasAdminZona;
  const totalBalanceNeto = totalVentaNetaAjustada - totalPremios;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };


  const exportToExcel = () => {
    // Preparar datos para Excel
    const excelData = data.map((item: VentasStats, index: number) => ({
      'Usuario': item.usuario_email,
      'Valor Bruta': item.total_valor_bruta,
      'Venta Neta': item.total_venta_neta,
      'Ganancias Admin Zona': GananciasAdminZona[index],
      'Venta Neta Ajustada': ventaNetaAjustada[index],
      'Ganancias': item.total_ganancias,
      'Premios': item.total_premios,
      'Balance Neto': balanceNetoAjustado[index]
    }));

    // Agregar fila de totales
    excelData.push({
      'Usuario': 'TOTALES',
      'Valor Bruta': totalValorBruta,
      'Venta Neta': totalVentaNeta,
      'Ganancias Admin Zona': totalGananciasAdminZona,
      'Venta Neta Ajustada': totalVentaNetaAjustada,
      'Ganancias': totalGanancias,
      'Premios': totalPremios,
      'Balance Neto': totalBalanceNeto
    });

    // Crear workbook y worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Estadísticas Ventas');

    // Estilos para las celdas
    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1:H1');
    
    // Aplicar formato de moneda a las columnas numéricas
    for (let R = range.s.r; R <= range.e.r; R++) {
      for (let C = range.s.c + 1; C <= range.e.c; C++) { // Empezar desde la columna B
        const cell_address = {c: C, r: R};
        const cell_ref = XLSX.utils.encode_cell(cell_address);
        
        if (ws[cell_ref]) {
          // Formato de número para valores grandes
          ws[cell_ref].z = '#,##0';
        }
      }
    }

    // Encabezados en negrita
    for (let C = range.s.c; C <= range.e.c; C++) {
      const cell_address = {c: C, r: range.s.r};
      const cell_ref = XLSX.utils.encode_cell(cell_address);
      if (ws[cell_ref]) {
        ws[cell_ref].s = { font: { bold: true } };
      }
    }

    // Fila de totales en negrita
    const totalRow = range.e.r;
    for (let C = range.s.c; C <= range.e.c; C++) {
      const cell_address = {c: C, r: totalRow};
      const cell_ref = XLSX.utils.encode_cell(cell_address);
      if (ws[cell_ref]) {
        ws[cell_ref].s = { font: { bold: true } };
      }
    }

    // Auto ajustar el ancho de las columnas
    const colWidths = [
      { wch: 25 }, // Usuario
      { wch: 15 }, // Valor Bruta
      { wch: 15 }, // Venta Neta
      { wch: 20 }, // Ganancias Admin Zona
      { wch: 20 }, // Venta Neta Ajustada
      { wch: 15 }, // Ganancias
      { wch: 15 }, // Premios
      { wch: 15 }  // Balance Neto
    ];
    ws['!cols'] = colWidths;

    // Generar nombre del archivo con fecha y zona
    const fechaExport = new Date().toISOString().split('T')[0];
    const fileName = `estadisticas_ventas_${zona}_${fechaExport}.xlsx`;

    // Descargar archivo
    XLSX.writeFile(wb, fileName);
  };

  return {
   data,
   loading,
   error,
   totalBalanceNeto,
   totalGanancias,
   totalGananciasAdminZona,
   totalPremios,
   totalVentaNeta,
   totalVentaNetaAjustada,
   totalValorBruta,
   exportToExcel,
   ventaNetaAjustada,
   balanceNetoAjustado,
   adminZona

    
  }
}