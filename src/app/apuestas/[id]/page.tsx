import TicketPageClient from "@/components/TicketPage"
interface TicketPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function TicketApuestasPage({ params }: TicketPageProps) {
   const { id } = await params
  return <TicketPageClient ticketId={id} />
}
