import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from "@/lib/utils"


export default function StatCard({
  title,
  value,
  change,
  icon: Icon,
  color,
  className,
  iconClassName,
}: any) {
  
    return (
       <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">{title}</p>
              <p className={cn("font-bold text-gray-900 truncate", className)} >{value}</p>
              {change ? (
                 <div className="flex items-center mt-2">
                {change && change > 0  ? (
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {change}%
                </span>
                <span className="text-sm text-gray-500 ml-1">vs mes anterior</span>
              </div>
              ):(
                <span className='text-xs py-3 text-gray-500'>Actualizado</span>
              )}
             
            </div>
            <div className={cn(`p-3 rounded-lg ${color}`, iconClassName)}>
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
    )
}