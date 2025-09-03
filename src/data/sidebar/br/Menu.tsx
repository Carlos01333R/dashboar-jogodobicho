  import { hr, id } from 'date-fns/locale';
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
      href: '/br/dashboard'
    },
    {
      id: 'admin',
      label: 'Administrador',
      icon: Settings,
      submenu: [
        { id: 'ventas', label: 'Ventas', icon: BarChart3, section: 'sales', href: '/br/dashboard/administrador/ventas' },
        { id: 'cartera', label: 'Cartera', icon: Wallet, section: 'wallet', href: '/br/dashboard/administrador/cartera' },
        {id: 'ventaszonas', label: 'Ventas Zonas', icon: Trophy, section: 'ventas-zonas', href: '/br/dashboard/administrador/ventaszonas'},
      ]
    },
    {
      id: 'winners',
      label: 'Ganadores',
      icon: Trophy,
      submenu: [
        { id: 'ganadores-hoy', label: 'Ganadores Hoy', icon: Calendar, section: 'winners-today', href: '/br/dashboard/ganadores/hoy' },
        { id: 'historial-ganadores', label: 'Historial', icon: History, section: 'winners-history', href: '/br/dashboard/ganadores/historial' },
      ]
    },
    {
      id: 'zona',
      label: 'Zonas',
      icon: MapPin,
      submenu: [
        { id: 'zonas', label: 'Zonas', icon: MapPin, section: 'zones', href: '/br/dashboard/zona/zonas' },
        { id: 'administradores', label: 'Administradores', icon: Users, section: 'admins-zonas', href: '/br/dashboard/zona/administradores' },
      ]
      
    },
    {
      id: 'bloquear',
      label: 'Bloquear Números',
      icon: Ban,
      section: 'blocked-numbers',
      href: '/br/dashboard/bloquearNumero'
    },
    {
      id: 'usuarios',
      label: 'Usuarios',
      icon: Users,
      submenu: [
        { id: 'Usuarios', label: 'Usuarios', icon: Users, section: 'users', href: '/br/dashboard/usuarios/users' },
        { id: 'Ventas usuarios', label: 'Ventas usuarios', icon: BarChart3, section: 'sales_users', href: '/br/dashboard/usuarios/ventas' },
      ]
     
    },
    {
      id: 'loterias',
      label: 'Loterías',
      icon: Ticket,
  
      submenu: [
        { id: 'loterias', label: 'Loterías', icon: Ticket, section: 'lotteries', href: '/br/dashboard/loterias/administrar' },
        { id: 'resultados', label: 'Resultados', icon: Ticket, section: 'resultado', href: '/br/dashboard/loterias/resultados' },
      ]
    }
  ];