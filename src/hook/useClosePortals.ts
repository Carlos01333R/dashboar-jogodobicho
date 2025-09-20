"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"

export function useClosePortals() {
  const pathname = usePathname()

  useEffect(() => {
    // Cuando cambie la ruta, limpiamos portales abiertos
    document.querySelectorAll("[data-radix-portal]").forEach((el) => {
      el.remove()
    })
  }, [pathname])
}
