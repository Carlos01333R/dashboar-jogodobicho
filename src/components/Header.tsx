import React from 'react';
import { Bell, Search, Settings, ArrowLeftIcon, Menu } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { SheetMovil } from './Seet';

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

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 p-4 sticky top-0 flex-shrink-0 z-50">
      <div className="flex items-center justify-between">
        <div>
          <article className='flex items-center gap-x-2'>
          <section className=' md:hidden'>
            <SheetMovil activeSection={activeSection} onSectionChange={onSectionChange} MenuArry={Menu} />
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
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:text-emerald-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </button>

          {/* Settings */}
          <button className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
          </button>

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