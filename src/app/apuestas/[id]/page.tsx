// ❌ Quita "use client" aquí (este archivo será un Server Component)
import TicketPageClient from "@/components/TicketPage"

interface TicketPageProps {
  params: {
    id: string
  }
}

export default async function TicketApuestasPage({ params }: TicketPageProps) {
  const { id } = params
  return <TicketPageClient ticketId={id} />
}
