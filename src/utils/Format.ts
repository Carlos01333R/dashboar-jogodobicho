export function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function FormatCurrencyCO(value: number | null | undefined): string {
  const numValue = Number(value) || 0; // Convierte null/undefined a 0
  
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numValue);
}


export function FormatCurrencyBR(value: number | null | undefined): string {
  const numValue = Number(value) || 0; // Convierte null/undefined a 0
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numValue);
}



   export  const getModalidadText = (modalidad: string) => {
    const modalidades: { [key: string]: string } = {
      millar: "Millar",
      centena: "Centena",
      decena: "Decena",
      grupo: "Grupo",
      duque: "Duque",
      terno: "Terno",
      multiple: "Múltiple"
    }
    return modalidades[modalidad] || modalidad
  }
  export const getModalityColor = (modality: string) => {
    const colors: { [key: string]: string } = {
      millar: "bg-red-100 text-red-800 px-2 py-1 rounded-xl",
      centena: "bg-blue-100 text-blue-800 px-2 py-1 rounded-xl",
      decena: "bg-green-100 text-green-800 px-2 py-1 rounded-xl",
      grupo: "bg-yellow-100 text-yellow-800 px-2 py-1 rounded-xl",
      duque: "bg-purple-100 text-purple-800 px-2 py-1 rounded-xl",
      terno: "bg-pink-100 text-pink-800 px-2 py-1 rounded-xl",
      multiple: "bg-gray-100 text-gray-800 px-2 py-1 rounded-xl",
    }
    return colors[modality] || "bg-gray-100 text-gray-800"
  }

import { lotteries } from "@/lib/br/lottery-config";
export const getLotteryInfo = (lotteryId: string) => {
  const lottery = lotteries.find((l) => l.id === lotteryId);
  return lottery ? { name: lottery.name, time: lottery.time, fullName: lottery.fullName } : { name: lotteryId, time: "N/A", fullName: lotteryId };
};
