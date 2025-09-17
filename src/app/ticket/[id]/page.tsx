"use client"
import { useVentasRifas } from "@/hook/br/rifas/use-ventas-rifas"
import { TicketDisplay } from "@/components/rifas/ticket-display"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowLeft, RefreshCw } from "lucide-react"
import Link from "next/link"

interface TicketPageProps {
  params: {
    id: string
  }
}

export default function TicketPage({ params }: TicketPageProps) {
  const { data, loading, error, refetch } = useVentasRifas(params.id)

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">


        {loading && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mr-2" />
                <p>Cargando información del ticket...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <div className="text-destructive text-center space-y-2">
                <p className="font-medium">Error al cargar el ticket</p>
                <p className="text-sm">{error}</p>
                <Button variant="outline" onClick={refetch} className="mt-4 bg-transparent">
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Intentar de nuevo
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {data && <TicketDisplay data={data} />}
      </div>
    </div>
  )
}
