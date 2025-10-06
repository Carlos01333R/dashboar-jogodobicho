import { FormatCurrencyCO, FormatCurrencyBR } from "@/utils/Format";
import { useAuthAdminZona } from "@/context/AuthContextAdminZona";
interface VentasStats {
  usuario_email: string;
  total_valor_bruta: number;
  total_venta_neta: number;
  total_ganancias: number;
  total_premios: number;
}

interface Props {
  data: VentasStats[];
  exportToExcel: () => void;
  totalBalanceNeto: number;
  totalGanancias: number;
  totalPremios: number;
  totalVentaNetaAjustada: number;
  totalValorBruta: number;
  adminZona: number;
  balanceNetoAjustado: number[];
  ventaNetaAjustada: number[];
  gananciasAdminZonaNewTotal: number;
}

export default function TableComponents({data, exportToExcel, totalBalanceNeto, totalGanancias, totalPremios, totalVentaNetaAjustada, totalValorBruta, adminZona, balanceNetoAjustado, ventaNetaAjustada, gananciasAdminZonaNewTotal}: Props) {

    const {selectedCountry} = useAuthAdminZona()

    
  return (
    <section>
    <div className="flex justify-end py-4">
            <button
              onClick={exportToExcel}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Exportar a Excel</span>
            </button>
          </div>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario 
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor Bruta
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Venta Neta
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ganancias
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Premios
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Balance Neto
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((item: VentasStats, index: number) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.usuario_email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {selectedCountry === 'brazil' ? FormatCurrencyBR(item.total_valor_bruta) : FormatCurrencyCO(item.total_valor_bruta)}
                      
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    
                      {selectedCountry === 'brazil' ? FormatCurrencyBR(ventaNetaAjustada[index]) : FormatCurrencyCO(ventaNetaAjustada[index])}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  
                      {selectedCountry === 'brazil' ? FormatCurrencyBR(item.total_ganancias) : FormatCurrencyCO(item.total_ganancias)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                     
                      {selectedCountry === 'brazil' ? FormatCurrencyBR(item.total_premios) : FormatCurrencyCO(item.total_premios)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${
                      balanceNetoAjustado[index] < 0 ? 'text-red-600' : 'text-gray-900'
                    }`}>
                     
                      {selectedCountry === 'brazil' ? FormatCurrencyBR(balanceNetoAjustado[index]) : FormatCurrencyCO(balanceNetoAjustado[index])}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-100">
                <tr>
                  <td className="px-6 py-3 text-sm font-bold text-gray-900">TOTALES</td>
                  <td className="px-6 py-3 text-sm font-bold text-gray-900">
                    {selectedCountry === 'brazil' ? FormatCurrencyBR(totalValorBruta) : FormatCurrencyCO(totalValorBruta)}
                  

                  </td>
                  <td className="px-6 py-3 text-sm font-bold text-gray-900">
                    {selectedCountry === 'brazil' ? FormatCurrencyBR(totalVentaNetaAjustada + gananciasAdminZonaNewTotal) : FormatCurrencyCO(totalVentaNetaAjustada + gananciasAdminZonaNewTotal)}
                
                  </td>
                  <td className="px-6 py-3 text-sm font-bold text-gray-900">
                    {selectedCountry === 'brazil' ? FormatCurrencyBR(totalGanancias) : FormatCurrencyCO(totalGanancias)}
             
                  </td>
                  <td className="px-6 py-3 text-sm font-bold text-gray-900">
                    {selectedCountry === 'brazil' ? FormatCurrencyBR(totalPremios) : FormatCurrencyCO(totalPremios)}
                
                  </td>
                  <td className={`px-6 py-3 text-sm font-bold ${
                    totalBalanceNeto < 0 ? 'text-red-600' : 'text-gray-900'
                  }`}>
                    {selectedCountry === 'brazil' ? FormatCurrencyBR(totalBalanceNeto + gananciasAdminZonaNewTotal) : FormatCurrencyCO(totalBalanceNeto + gananciasAdminZonaNewTotal)}
                  
                  </td>
                </tr>
              </tfoot>
            </table>
            
            <div className="p-4 bg-blue-50 border-t border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Nota:</strong> El total de la Venta Neta incluye ganancias de admin zona + total venta neta
              </p>
            </div>
          </div>
</section>
  )}