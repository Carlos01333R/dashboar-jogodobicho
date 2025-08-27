'use client'
import React, {useEffect, useState} from "react";
import { useRouter } from "next/navigation"
import Sidebar from "@/components/sidebar";
import Header from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner"
import { MenuItems } from "@/data/sidebar/Menu";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const [activeSection, setActiveSection] = useState('home');
  const router = useRouter();
  
  // Efecto para cargar el estado desde localStorage al inicializar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSection = localStorage.getItem('activeSection');
      if (savedSection) {
        setActiveSection(savedSection);
      }
    }
  }, []);
  
  // Efecto para guardar en localStorage cuando activeSection cambie
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('activeSection', activeSection);
    }
  }, [activeSection]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  const getSectionTitle = (section: string) => {
    switch (section) {
      case 'home': return 'Dashboard Principal';
      case 'sales': return 'Gestión de Ventas';
      case 'wallet': return 'Gestión de Cartera';
      case 'winners-today': return 'Ganadores de Hoy';
      case 'winners-history': return 'Historial de Ganadores';
      case 'zones': return 'Gestión de Zonas';
      case 'admins-zonas': return 'Administradores de Zonas';
      case 'blocked-numbers': return 'Números Bloqueados';
      case 'users': return 'Gestión de Usuarios';
      case 'sales_users': return 'Ventas de Usuarios';
      case 'lotteries': return 'Gestión de Loterias';
      case 'numbers-sold': return 'Numeros Vendidos';
      default: return 'Dashboard';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-yellow-50 flex items-center justify-center p-4">
        <div className="text-gray-600">Cargando...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="w-full text-black flex flex-row">
        <section className="h-screen sticky top-0 bg-red-500 w-64 flex-shrink-0 hidden md:block overflow-y-hidden overflow-x-hidden">
          <Sidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            Menu={MenuItems}
          />
        </section>
    
        <article className="flex-1">
          <Header 
            title={getSectionTitle(activeSection)} 
            activeSection={activeSection} 
            onSectionChange={setActiveSection} 
            Menu={MenuItems} 
          />
          <section className="overflow-y-auto p-4">
            {children}
            <Toaster position="top-right" />
          </section>
        </article>
      </main>
    </div>
  );
}