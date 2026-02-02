import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const pieColors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

export const LotteryPieChart = ({ 
  data,
  totalLotteries = 40 
}: { 
  data: Array<{ lottery: string, count: number }>,
  totalLotteries?: number 
}) => {
  // 1. Filtrar solo loterías con ganadores y ordenar por count descendente
  const winningLotteries = data
    .filter(item => item.count > 0)
    .sort((a, b) => b.count - a.count);

  // 2. Calcular el porcentaje de loterías con ganadores
  const winningPercentage = Math.round((winningLotteries.length / totalLotteries) * 100);

  // 3. Preparar datos para el gráfico
  const chartData = winningLotteries.map((item, index) => ({
    name: item.lottery,
    winners: item.count,
    // Color que se repite cíclicamente
    color: pieColors[index % pieColors.length]
  }));

  // 4. Si hay muchas loterías, agrupar las menores en "Otras"
  const MAX_VISIBLE = 8;
  let finalData = chartData;
  let otherData = null;

  if (chartData.length > MAX_VISIBLE) {
    const mainData = chartData.slice(0, MAX_VISIBLE - 1);
    const others = chartData.slice(MAX_VISIBLE - 1);
    
    const otherCount = others.reduce((sum, item) => sum + item.winners, 0);
    
    finalData = [
      ...mainData,
      { 
        name: `Otras (${others.length})`, 
        winners: otherCount,
        color: '#94A3B8' // Color gris para "Otras"
      }
    ];
    
    otherData = others;
  }

  return (
    <div className="lottery-chart-container ">
          <section className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ganadores por Lotería</h3>
              <article>
                       <p className='text-xs text-gray-600'>Distribución de Ganadores</p>
                      <p className='text-xs text-gray-600'>{winningLotteries.length} de {totalLotteries} loterías ({winningPercentage}%) tienen ganadores</p>
                    </article>
                      
                  </section>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={finalData}
            cx="50%"
            cy="50%"
            outerRadius={120}
            innerRadius={60}
            dataKey="winners"
            style={{
                fontSize: '12px',
            
            }}
            label={({ name, value }) => 
              `${name} ${(value)}`
            }
            labelLine={false}
          >
            {finalData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color} 

              />
            ))}
          </Pie>
         <Tooltip
  formatter={(value) => {
    if (value == null) return ['', ''];
    return [`${value} ganadores`, ''];
  }}
  labelFormatter={(label) => `Lotería: ${label}`}
/>

        
        </PieChart>
      </ResponsiveContainer>

      {otherData && (
        <div className="other-lotteries hidden">
          <h4>Detalle de otras loterías:</h4>
          <ul>
            {otherData.map((item, index) => (
              <li key={index}>
                {item.name}: {item.winners} ganadores
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};