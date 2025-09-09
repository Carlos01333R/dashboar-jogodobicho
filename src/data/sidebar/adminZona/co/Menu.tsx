  import { hr, id } from 'date-fns/locale';
import { 
  Home, 
  Settings, 
  Trophy, 
  MapPin, 
  Users, 
} from 'lucide-react';

  export const MenuItems = [
    {
      id: 'home',
      label: 'Inicio',
      icon: Home,
      section: 'home',
      href: '/AdminZona/co/dashboard/'
    },
    {
      id: 'cartera',
      label: 'Cartera',
      icon: Settings,
      section: 'wallet',
      href: '/AdminZona/co/dashboard/cartera'
     
    },
    {
      id: 'winners',
      label: 'Ganadores',
      icon: Trophy,
      section: 'winners-history',
      href: '/AdminZona/co/dashboard/ganadores'
   
    },
    {
      id: 'zona',
      label: 'Zonas',
      icon: MapPin,
      section: 'zones',
      href: '/AdminZona/co/dashboard/zonas'
     
      
    },
   
    {
      id: 'usuarios',
      label: 'Usuarios',
      icon: Users,
    section: 'users',
    href: '/AdminZona/co/dashboard/usuario'
     
    },
    
  ];