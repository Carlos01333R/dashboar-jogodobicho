
"use client"
import { useClosePortals } from "@/hook/useClosePortals"

export function PortalCleaner() {
  useClosePortals()
  return null
}
