'use client'
import React from "react"
import { useAuth } from "@/context/AuthContext"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardHome from "@/components/Home"
import DataHome from "@/lib/DataHome"
export  default function dashboardCO(){
    const { user, isLoading } = useAuth()
    const router = useRouter()
    const { items, loading, error } = DataHome();
    useEffect(() => {
        if (!isLoading && !user) {
            router.replace("/login")
        }
    }, [isLoading, user, router])


    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-yellow-50 flex items-center justify-center p-4">
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