import { User,  Sale, Winner, Zone, Lottery, BlockedNumber, DashboardStats} from '@/types/Index';

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@loteriabr.com',
    role: 'admin',
    zone: 'São Paulo',
    createdAt: new Date('2024-01-15'),
    lastLogin: new Date('2025-01-10')
  },
  {
    id: '2',
    username: 'operador1',
    email: 'operador@loteriabr.com',
    role: 'operator',
    zone: 'Rio de Janeiro',
    createdAt: new Date('2024-02-20'),
    lastLogin: new Date('2025-01-09')
  },
  {
    id: '3',
    username: 'vendedor_bogota',
    email: 'vendedor@loteriacol.com',
    role: 'operator',
    zone: 'Bogotá',
    createdAt: new Date('2024-03-10'),
    lastLogin: new Date('2025-01-08')
  }
];

export const mockSales: Sale[] = [
  {
    id: '1',
    ticketNumber: '12345',
    lottery: 'Mega-Sena',
    country: 'brazil',
    amount: 4.50,
    zone: 'São Paulo',
    sellerId: '1',
    sellerName: 'João Silva',
    date: new Date('2025-01-10'),
    status: 'confirmed'
  },
  {
    id: '2',
    ticketNumber: '67890',
    lottery: 'Baloto',
    country: 'colombia',
    amount: 2.00,
    zone: 'Bogotá',
    sellerId: '3',
    sellerName: 'María García',
    date: new Date('2025-01-10'),
    status: 'confirmed'
  },
  {
    id: '3',
    ticketNumber: '11111',
    lottery: 'Quina',
    country: 'brazil',
    amount: 2.00,
    zone: 'Rio de Janeiro',
    sellerId: '2',
    sellerName: 'Carlos Santos',
    date: new Date('2025-01-09'),
    status: 'pending'
  }
];

export const mockWinners: Winner[] = [
  {
    id: '1',
    ticketNumber: '98765',
    lottery: 'Mega-Sena',
    country: 'brazil',
    prize: 120000.00,
    zone: 'São Paulo',
    winnerName: 'Ana Costa',
    date: new Date('2025-01-08'),
    claimed: false
  },
  {
    id: '2',
    ticketNumber: '54321',
    lottery: 'Baloto',
    country: 'colombia',
    prize: 85000.00,
    zone: 'Medellín',
    winnerName: 'Pedro Rodríguez',
    date: new Date('2025-01-07'),
    claimed: true
  },
  {
    id: '3',
    ticketNumber: '77777',
    lottery: 'Lotofácil',
    country: 'brazil',
    prize: 15000.00,
    zone: 'Brasília',
    winnerName: 'Lucía Mendoza',
    date: new Date('2025-01-10'),
    claimed: false
  }
];

export const mockZones: Zone[] = [
  {
    id: '1',
    name: 'Zona Centro SP',
    city: 'São Paulo',
    state: 'São Paulo',
    country: 'brazil',
    active: true,
    totalSales: 125000.50,
    totalWinners: 23
  },
  {
    id: '2',
    name: 'Zona Norte RJ',
    city: 'Rio de Janeiro',
    state: 'Rio de Janeiro',
    country: 'brazil',
    active: true,
    totalSales: 98500.75,
    totalWinners: 18
  },
  {
    id: '3',
    name: 'Zona Centro Bogotá',
    city: 'Bogotá',
    state: 'Cundinamarca',
    country: 'colombia',
    active: true,
    totalSales: 87650.25,
    totalWinners: 15
  },
  {
    id: '4',
    name: 'Zona Sur Medellín',
    city: 'Medellín',
    state: 'Antioquia',
    country: 'colombia',
    active: true,
    totalSales: 72300.80,
    totalWinners: 12
  }
];

export const mockLotteries: Lottery[] = [
  {
    id: '1',
    name: 'Mega-Sena',
    country: 'brazil',
    drawTime: '20:00',
    ticketPrice: 4.50,
    maxPrize: 50000000,
    active: true,
    nextDraw: new Date('2025-01-11')
  },
  {
    id: '2',
    name: 'Quina',
    country: 'brazil',
    drawTime: '20:00',
    ticketPrice: 2.00,
    maxPrize: 15000000,
    active: true,
    nextDraw: new Date('2025-01-11')
  },
  {
    id: '3',
    name: 'Baloto',
    country: 'colombia',
    drawTime: '22:45',
    ticketPrice: 2.00,
    maxPrize: 20000000,
    active: true,
    nextDraw: new Date('2025-01-11')
  },
  {
    id: '4',
    name: 'Lotería de Bogotá',
    country: 'colombia',
    drawTime: '14:00',
    ticketPrice: 1.50,
    maxPrize: 5000000,
    active: true,
    nextDraw: new Date('2025-01-12')
  }
];

export const mockBlockedNumbers: BlockedNumber[] = [
  {
    id: '1',
    number: '13',
    lottery: 'Mega-Sena',
    country: 'brazil',
    reason: 'Número de la suerte bloqueado por exceso de ventas',
    blockedBy: 'admin',
    date: new Date('2025-01-05'),
    active: true
  },
  {
    id: '2',
    number: '07',
    lottery: 'Baloto',
    country: 'colombia',
    reason: 'Bloqueo temporal por mantenimiento',
    blockedBy: 'operador1',
    date: new Date('2025-01-08'),
    active: false
  }
];

export const mockDashboardStats: DashboardStats = {
  totalSales: 485000.75,
  totalWinnings: 220000.00,
  activeLotteries: 4,
  totalUsers: 156,
  todaySales: 12450.25,
  todayWinners: 3,
  salesGrowth: 15.5,
  winnersGrowth: -2.3
};

export const salesChartData = [
  { month: 'Jul', brasil: 45000, colombia: 32000 },
  { month: 'Ago', brasil: 52000, colombia: 38000 },
  { month: 'Sep', brasil: 48000, colombia: 35000 },
  { month: 'Oct', brasil: 61000, colombia: 42000 },
  { month: 'Nov', brasil: 55000, colombia: 39000 },
  { month: 'Dic', brasil: 67000, colombia: 45000 },
  { month: 'Ene', brasil: 58000, colombia: 41000 }
];

export const winnersChartData = [
  { lottery: 'Mega-Sena', winners: 45, prize: 2500000 },
  { lottery: 'Quina', winners: 128, prize: 850000 },
  { lottery: 'Lotofácil', winners: 89, prize: 450000 },
  { lottery: 'Baloto', winners: 67, prize: 1200000 },
  { lottery: 'Loto Colombia', winners: 52, prize: 680000 }
];