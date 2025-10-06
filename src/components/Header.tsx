import React from 'react';
import { useAuth } from '@/context/AuthContext';
import SheetNewAdminZona from './adminzona/SeetNew';
import { usePathname } from "next/navigation";
import SheetNew from './SeetNew';

interface HeaderProps {
  title: string;
  activeSection: string;
  onSectionChange: (section: string) => void;
  Menu: any;
}

const Header: React.FC<HeaderProps> = ({ title, activeSection,
  onSectionChange,
  Menu }) => {
  const { user, selectedCountry } = useAuth();
    const pathname = usePathname();

const activePaths = [
  "/AdminZona/br/dashboard",
  "/AdminZona/co/dashboard",
  "/AdminZona/br/dashboard/cartera",
  "/AdminZona/co/dashboard/cartera",
  "/AdminZona/br/dashboard/ganadores",
  "/AdminZona/co/dashboard/ganadores",
  "/AdminZona/br/dashboard/usuario",
  "/AdminZona/co/dashboard/usuario",
  "/AdminZona/br/dashboard/zonas",
  "/AdminZona/co/dashboard/zonas",
 
];

const isActive = activePaths.includes(pathname);



  return (
    <header className="bg-white shadow-sm border-b border-gray-200 p-4 sticky top-0 flex-shrink-0 z-20">
      <div className="flex items-center justify-between">
        <div>
          <article className='flex items-center gap-x-2'>
          <section className='md:hidden'>
            {isActive ? <SheetNewAdminZona activeSection={activeSection} onSectionChange={onSectionChange} MenuArry={Menu} />: <SheetNew activeSection={activeSection} onSectionChange={onSectionChange} MenuArry={Menu} />}
          
          </section>
          <span>
               <h1 className="text-base md:text-2xl font-bold text-gray-800">{title}</h1>
              <p className="text-sm text-gray-600">
            {selectedCountry === 'brazil' ? 'Sistema Brasil' : 'Sistema Colombia'}
          </p>
          </span>
       
          </article>
          
        
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}

          {/* User Avatar */}
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-100 text-emerald-800 rounded-full w-8 h-8 flex items-center justify-center font-semibold">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;