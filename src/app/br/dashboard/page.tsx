'use client'
import React from "react"
import { useAuth } from "@/context/AuthContext"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import DataHomeBr from "@/lib/br/DataHome"
import DashboardHome from "@/components/Home"
export  default function dashboardBR(){
    const { user, isLoading, selectedCountry } = useAuth()
    const router = useRouter()
    const {items, data, loading, error} = DataHomeBr();

    

    useEffect(() => {
        if (!isLoading && !user) {
            router.replace("/login")
        }
    }, [isLoading, user, router])

    if (isLoading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-emerald-50 via-blue-50 to-yellow-50 flex items-center justify-center p-4">
                <div className="text-gray-600">Cargando...</div>
            </div>
        )
    }
    if (!user) {
        return null
    }
    return (
        <section>  
          {!loading && (
              <DashboardHome data={items} />
          )}    
           
            </section>
    )
} 