"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"

type Country = "brazil" | "colombia"

interface AuthContextType {
  user: User | null
  selectedCountry: Country | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  setCountry: (country: Country) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth(): AuthContextType {
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

  // Restaurar país desde localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("selected-country")
      if (saved === "brazil" || saved === "colombia") {
        setSelectedCountry(saved)
      }
    } catch {
      // Ignorar errores de acceso a localStorage (modo SSR/prerender)
    }
  }, [])

  // Persistir país en localStorage
  useEffect(() => {
    try {
      if (selectedCountry) {
        localStorage.setItem("selected-country", selectedCountry)
      } else {
        localStorage.removeItem("selected-country")
      }
    } catch {
      // Ignorar
    }
  }, [selectedCountry])

  // Inicializar sesión de Supabase y escuchar cambios
  useEffect(() => {
    let mounted = true

    async function init() {
      const { data } = await supabase.auth.getSession()
      if (!mounted) return
      setUser(data.session?.user ?? null)
      setIsLoading(false)
    }
    init()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error || !data.user) return false
    setUser(data.user)
    return true
  }

  const logout = async (): Promise<void> => {
    await supabase.auth.signOut()
    setUser(null)
    setSelectedCountry(null)
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
