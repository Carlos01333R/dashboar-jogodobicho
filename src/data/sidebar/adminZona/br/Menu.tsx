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
      href: '/AdminZona/br/dashboard/'
    },
    {
      id: 'cartera',
      label: 'Cartera',
      icon: Settings,
      section: 'wallet',
      href: '/AdminZona/br/dashboard/cartera'
     
    },
    {
      id: 'winners',
      label: 'Ganadores',
      icon: Trophy,
      section: 'winners-history',
      href: '/AdminZona/br/dashboard/ganadores'
   
    },
    {
      id: 'zona',
      label: 'Zonas',
      icon: MapPin,
      section: 'zones',
      href: '/AdminZona/br/dashboard/zonas'
     
      
    },
   
    {
      id: 'usuarios',
      label: 'Usuarios',
      icon: Users,
    section: 'users',
    href: '/AdminZona/br/dashboard/usuario'
     
    },
    
  ];