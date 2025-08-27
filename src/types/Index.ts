export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'operator' | 'viewer';
  zone: string;
  createdAt: Date;
  lastLogin?: Date;
}

export interface Sale {
  id: string;
  ticketNumber: string;
  lottery: string;
  country: 'brazil' | 'colombia';
  amount: number;
  zone: string;
  sellerId: string;
  sellerName: string;
  date: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface Winner {
  id: string;
  ticketNumber: string;
  lottery: string;
  country: 'brazil' | 'colombia';
  prize: number;
  zone: string;
  winnerName: string;
  date: Date;
  claimed: boolean;
}

export interface Zone {
  id: string;
  name: string;
  city: string;
  state: string;
  country: 'brazil' | 'colombia';
  active: boolean;
  totalSales: number;
  totalWinners: number;
}

export interface Lottery {
  id: string;
  name: string;
  country: 'brazil' | 'colombia';
  drawTime: string;
  ticketPrice: number;
  maxPrize: number;
  active: boolean;
  nextDraw: Date;
}

export interface BlockedNumber {
  id: string;
  number: string;
  lottery: string;
  country: 'brazil' | 'colombia';
  reason: string;
  blockedBy: string;
  date: Date;
  active: boolean;
}

export interface DashboardStats {
  totalSales: number;
  totalWinnings: number;
  activeLotteries: number;
  totalUsers: number;
  todaySales: number;
  todayWinners: number;
  salesGrowth: number;
  winnersGrowth: number;
}