// components/EstadisticasVentas.tsx
import React from 'react';
import DataVentasByFechaAdminZona from '@/lib/adminZona/co/DataVentaByFecha';
import DataVentasByFechaAdminZonaBr from '@/lib/adminZona/br/DataVentaByFecha';
import { FormatCurrencyCO } from '@/utils/Format';
import { useAuthAdminZona } from '@/context/AuthContextAdminZona';
import TableComponents from './TableComponents';


interface VentasStats {
  usuario_email: string;
  total_valor_bruta: number;
  total_venta_neta: number;
  total_ganancias: number;
  total_premios: number;
}

interface EstadisticasVentasProps {
  fechaInicio: string;
  fechaFin: string;
  zona: string;
}

export const EstadisticasVentas: React.FC<EstadisticasVentasProps> = ({
  fechaInicio,
  fechaFin,
  zona
}) => {
    const { selectedCountry } = useAuthAdminZona()

    const { data, loading, error, totalBalanceNeto, totalGanancias, totalPremios, totalVentaNetaAjustada, totalValorBruta, exportToExcel, ventaNetaAjustada , balanceNetoAjustado, adminZona } = DataVentasByFechaAdminZona({fechaInicio, fechaFin, zona});

    const {dataBR, loadingBR, errorBR, totalBalanceNetoBR, totalGananciasBR, totalPremiosBR, totalVentaNetaAjustadaBR, totalValorBrutaBR, exportToExcelBR, ventaNetaAjustadaBR , balanceNetoAjustadoBR, adminZonaBR } = DataVentasByFechaAdminZonaBr({fechaInicio, fechaFin, zona});
  
   
  if ( selectedCountry === 'colombia' && loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (selectedCountry === 'colombia' && error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Error: {error}
      </div>
    );
  }

  if (selectedCountry === 'colombia' && data.length === 0 ) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        No se encontraron datos para los criterios seleccionados.
      </div>
    );
  }

  if (selectedCountry === 'brazil' && dataBR.length === 0 ) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        No se encontraron datos para los criterios seleccionados.
      </div>
    );
  }

  if (selectedCountry === 'colombia' && loadingBR) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="font-bold text-xl ml-4">Cargando datos...</p>
      </div>
    );
  }

  if (selectedCountry === 'brazil' && loadingBR) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="font-bold text-xl ml-4">Cargando datos...</p>
      </div>
    );
  }

  if (selectedCountry === 'colombia' && errorBR) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Error: {errorBR}
      </div>
    );
  }

 
  return (
    <div className="space-y-4">
      {/* Botón de exportación */}
      {selectedCountry === 'brazil' ? (
        <>
        <TableComponents data={dataBR} exportToExcel={exportToExcelBR} totalBalanceNeto={totalBalanceNetoBR} totalGanancias={totalGananciasBR} totalPremios={totalPremiosBR} totalVentaNetaAjustada={totalVentaNetaAjustadaBR} totalValorBruta={totalValorBrutaBR} adminZona={adminZonaBR} balanceNetoAjustado={balanceNetoAjustadoBR} ventaNetaAjustada={ventaNetaAjustadaBR} />
      </>
      ) : (
        <>
        <TableComponents data={data} exportToExcel={exportToExcel} totalBalanceNeto={totalBalanceNeto} totalGanancias={totalGanancias} totalPremios={totalPremios} totalVentaNetaAjustada={totalVentaNetaAjustada} totalValorBruta={totalValorBruta} adminZona={adminZona} balanceNetoAjustado={balanceNetoAjustado} ventaNetaAjustada={ventaNetaAjustada} />
        </>
      )}
    </div>
  );
};