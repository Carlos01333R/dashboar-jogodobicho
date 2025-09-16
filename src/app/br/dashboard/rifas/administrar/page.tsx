"use client"

import { useState } from "react"
import { CrearRifaForm } from "@/components/rifas/crear-rifa-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trophy, Ticket, Users } from "lucide-react"
import { DashboardStatsRifas } from "@/components/rifas/dashboard-stats"
import { RifasActivasList } from "@/components/rifas/rifas-activas-list"
import { RaffleDashboard } from "@/components/rifas/raffle-dashboard"

export default function HomePage() {
  const [showCreateForm, setShowCreateForm] = useState(false)

  
  const handleRifaCreated = () => {
    setShowCreateForm(false)
    // Aquí podrías refrescar la lista de rifas
  }

  return (
    <div className="min-h-screen bg-background rounded-2xl">
      {/* Header */}
      <header className="border-b bg-card rounded-2xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Sistema de Rifas</h1>
              <p className="text-muted-foreground mt-1">Gestiona tus rifas de manera fácil y segura</p>
            </div>
            <Button onClick={() => setShowCreateForm(!showCreateForm)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nueva Rifa
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {showCreateForm ? (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Crear Nueva Rifa</h2>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancelar
              </Button>
            </div>
            <CrearRifaForm onSuccess={handleRifaCreated} />
          </div>
        ) : (
          <Tabs defaultValue="dashboard" className="w-full ">
            <TabsList className="w-full flex justify-center items-center">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="ventas">Ventas</TabsTrigger>
              <TabsTrigger value="ganadores" className="hidden">Ganadores</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              <DashboardStatsRifas />
              <RifasActivasList />
           
            </TabsContent>

         

            <TabsContent value="ventas">
              <RaffleDashboard />
            </TabsContent>


            <TabsContent value="ganadores" className="hidden">
              <Card>
                <CardHeader>
                  <CardTitle>Ganadores</CardTitle>
                  <CardDescription>Lista de todos los ganadores de rifas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No hay ganadores registrados aún</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  )
}
