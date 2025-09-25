"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export function useClosePortals() {
  const pathname = usePathname()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    const closePortals = () => {
      const portals = document.querySelectorAll("[data-radix-portal]")
      portals.forEach((portal) => {
        if (portal.parentNode) {
          portal.parentNode.removeChild(portal)
        }
      })

      // Alternative: Cerrar via eventos si los componentes Radix están escuchando
      document.dispatchEvent(new CustomEvent('routeChange', { 
        detail: { action: 'closeModals' } 
      }))
    }

    // Pequeño delay para asegurar que la navegación se complete
    const timer = setTimeout(closePortals, 10)
    
    return () => clearTimeout(timer)
  }, [pathname, isClient])
}