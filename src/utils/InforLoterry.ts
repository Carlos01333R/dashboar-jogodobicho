import { Loteria } from "@/hook/br/InforLoterias";
export const createLotteryInfoGetter = (loterias: Loteria[]) => {
  return (lotteryId: string) => {
    const lottery = loterias.find((l) => l.id === lotteryId);
    return lottery ? { 
      name: lottery.name, 
      time: lottery.sorteo_time, 
      fullName: lottery.full_name,
      id: lottery.id
    } : { 
      name: lotteryId, 
      time: "N/A", 
      fullName: lotteryId,
      id: lotteryId
    };
  };
};