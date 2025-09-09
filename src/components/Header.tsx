import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { SheetMovil } from './Seet';
import { SheetMovilAdminZona } from './adminzona/Seet';
import { usePathname } from "next/navigation";
import { is } from 'date-fns/locale';

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
  const isActive = pathname === "/AdminZona/co/dashboard/zonas";


  return (
    <header className="bg-white shadow-sm border-b border-gray-200 p-4 sticky top-0 flex-shrink-0 z-50">
      <div className="flex items-center justify-between">
        <div>
          <article className='flex items-center gap-x-2'>
          <section className='md:hidden'>
            {isActive ? <SheetMovilAdminZona activeSection={activeSection} onSectionChange={onSectionChange} MenuArry={Menu} /> : <SheetMovil activeSection={activeSection} onSectionChange={onSectionChange} MenuArry={Menu} />}
          
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