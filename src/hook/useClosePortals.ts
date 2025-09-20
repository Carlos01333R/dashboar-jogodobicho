"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"

export function useClosePortals() {
  const pathname = usePathname()

  useEffect(() => {
    // Cerramos todos los portales de Radix al cambiar de ruta
    const portals = document.querySelectorAll("[data-radix-portal]")
    portals.forEach((el) => {
      if (el.parentNode) {
        el.parentNode.removeChild(el) // más seguro que el.remove()
      }
    })
  }, [pathname])
}
