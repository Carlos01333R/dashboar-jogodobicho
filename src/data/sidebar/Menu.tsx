  import { 
  Home, 
  Settings, 
  Trophy, 
  MapPin, 
  Ban, 
  Users, 
  Ticket,
  BarChart3,
  Wallet,
  Calendar,
  History
} from 'lucide-react';

  export const MenuItems = [
    {
      id: 'home',
      label: 'Inicio',
      icon: Home,
      section: 'home',
      href: '/co/dashboard'
    },
    {
      id: 'admin',
      label: 'Administrador',
      icon: Settings,
      submenu: [
        { id: 'ventas', label: 'Ventas', icon: BarChart3, section: 'sales', href: '/co/dashboard/ventas' },
        { id: 'cartera', label: 'Cartera', icon: Wallet, section: 'wallet', href: '/co/dashboard/cartera' },
      ]
    },
    {
      id: 'winners',
      label: 'Ganadores',
      icon: Trophy,
      submenu: [
        { id: 'ganadores-hoy', label: 'Ganadores Hoy', icon: Calendar, section: 'winners-today', href: '/co/dashboard/ganadores/hoy' },
        { id: 'historial-ganadores', label: 'Historial', icon: History, section: 'winners-history', href: '/co/dashboard/ganadores/historial' },
      ]
    },
    {
      id: 'zona',
      label: 'Zonas',
      icon: MapPin,
      submenu: [
        { id: 'zonas', label: 'Zonas', icon: MapPin, section: 'zones', href: '/co/dashboard/zona/zonas' },
        { id: 'administradores', label: 'Administradores', icon: Users, section: 'admins-zonas', href: '/co/dashboard/zona/administradores' },
      ]
      
    },
    {
      id: 'bloquear',
      label: 'Bloquear Números',
      icon: Ban,
      section: 'blocked-numbers',
      href: '/co/dashboard/bloquearNumero'
    },
    {
      id: 'usuarios',
      label: 'Usuarios',
      icon: Users,
      submenu: [
        { id: 'Usuarios', label: 'Usuarios', icon: Users, section: 'users', href: '/co/dashboard/Usuarios/users' },
        { id: 'Ventas usuarios', label: 'Ventas usuarios', icon: BarChart3, section: 'sales_users', href: '/co/dashboard/Usuarios/ventas' },
      ]
     
    },
    {
      id: 'loterias',
      label: 'Loterías',
      icon: Ticket,
      submenu: [
        { id: 'loterias', label: 'Loterías', icon: Ticket, section: 'lotteries', href: '/co/dashboard/loterias/administrar' },
        { id: 'numeros-vendidos', label: 'Numeros Vendidos', icon: Ticket, section: 'numbers-sold', href: '/co/dashboard/loterias/numerosVendidos' }
      ]
    }
  ];