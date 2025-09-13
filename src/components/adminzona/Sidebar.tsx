'use client';

import React, { useState } from 'react';
import {
  Users,
  Ticket,
  ChevronDown,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { useAuthAdminZona } from '@/context/AuthContextAdminZona';
import Link from 'next/link'

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  Menu: any;
  logout: () => void;
}

const SidebarAdminZona: React.FC<SidebarProps> = ({
  activeSection,
  onSectionChange,
  Menu,
  logout
}) => {
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const { user, selectedCountry } = useAuthAdminZona();

  const toggleMenu = (menu: string) => {
    setExpandedMenus((prev) =>
      prev.includes(menu)
        ? prev.filter((m) => m !== menu)
        : [...prev, menu]
    );
  };

  return (
    <div className="bg-gray-900 text-white w-64 h-full flex flex-col overflow-y-scroll scrollbar-webkit scrollbar-firefox "> 
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-emerald-500 to-blue-600 p-2 rounded-lg">
            <Ticket className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg">LottoAdmin</h2>
            <p className="text-xs text-gray-400">
              {selectedCountry === 'brazil' ? '🇧🇷 Brasil' : '🇨🇴 Colombia'}
            </p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-center space-x-3">
          <div className="bg-emerald-600 rounded-full p-2">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-semibold">{user?.email}</p>
          </div>
        </div>
        <div className='w-full flex justify-center items-center py-2'>
          <Link href="/AdminZona" className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ">
             Ir a menu
          </Link>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {Menu.map((item: any) => (
            <li key={item.id}>
              {item.submenu ? (
                <>
                  {/* Botón principal para menú con subitems */}
                  <button
                    onClick={() => toggleMenu(item.id)}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                    {expandedMenus.includes(item.id) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>

                  {/* Subitems */}
                  {expandedMenus.includes(item.id) && (
                    <ul className="ml-4 mt-2 space-y-1">
                      {item.submenu.map((subItem: any) => (
                        <li key={subItem.id}>
                          <Link
                            href={subItem.href}
                            onClick={() =>
                              onSectionChange(subItem.section)
                            }
                            className={`w-full flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                              activeSection === subItem.section
                                ? 'bg-emerald-600 text-white'
                                : 'hover:bg-gray-800'
                            }`}
                          >
                            <subItem.icon className="w-4 h-4" />
                            <span className="text-sm">{subItem.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : item.href ? (
                // Ítems sin submenu pero con href
                <Link
                  href={item.href}
                  onClick={() => onSectionChange(item.section!)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    activeSection === item.section
                      ? 'bg-emerald-600 text-white'
                      : 'hover:bg-gray-800'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              ) : (
                // Ítems sin submenu y sin href
                <button
                  onClick={() => onSectionChange(item.section!)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    activeSection === item.section
                      ? 'bg-emerald-600 text-white'
                      : 'hover:bg-gray-800'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-600 transition-colors text-red-400 hover:text-white"
        >
          <LogOut className="w-5 h-5" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};

export default SidebarAdminZona;
