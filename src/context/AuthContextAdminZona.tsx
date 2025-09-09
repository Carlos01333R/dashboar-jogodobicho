"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabase"

type Country = "brazil" | "colombia"

interface User {
  id: string
  email: string
  nombre: string
  telefono: string
  sector: string
  is_active: boolean
  // Agrega otros campos según tu tabla
}

interface AuthContextType {
  user: User | null
  selectedCountry: Country | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  setCountry: (country: Country) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuthAdminZona(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return ctx
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Restaurar sesión y país desde localStorage
  useEffect(() => {
    try {
      // Restaurar país
      const savedCountry = localStorage.getItem("selected-country")
      if (savedCountry === "brazil" || savedCountry === "colombia") {
        setSelectedCountry(savedCountry)
      }
      
      // Restaurar usuario
      const savedUser = localStorage.getItem("admin-user")
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
    } catch {
      // Ignorar errores de acceso a localStorage
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Persistir datos en localStorage
  useEffect(() => {
    try {
      if (selectedCountry) {
        localStorage.setItem("selected-country", selectedCountry)
      } else {
        localStorage.removeItem("selected-country")
      }
      
      if (user) {
        localStorage.setItem("admin-user", JSON.stringify(user))
      } else {
        localStorage.removeItem("admin-user")
      }
    } catch {
      // Ignorar errores de localStorage
    }
  }, [selectedCountry, user])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Consultar directamente la tabla de usuarios
      const { data, error } = await supabase
        .from('admin_zona') // Reemplaza con el nombre real de tu tabla
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .eq('is_active', true)
        .single()

      if (error || !data) {
        console.error("Error de autenticación:", error)
        return false
      }

      setUser(data)
      return true
    } catch (error) {
      console.error("Error en login:", error)
      return false
    }
  }

  const logout = async (): Promise<void> => {
    setUser(null)
    setSelectedCountry(null)
    localStorage.removeItem("admin-user")
      localStorage.removeItem("selected-country")
      
  }

  const setCountry = (country: Country) => setSelectedCountry(country)

  const value = useMemo(
    () => ({
      user,
      selectedCountry,
      isLoading,
      login,
      logout,
      setCountry,
    }),
    [user, selectedCountry, isLoading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}