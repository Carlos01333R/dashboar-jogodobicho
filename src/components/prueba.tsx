"use client"

import { useState } from "react"
import { Search, ChevronDown, MoreVertical, Book, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import DialogDemo from "./modalPrueba"

interface DatabaseFunction {
  id: number
  name: string
  arguments: string
  returnType: string
  security: string
}

const mockFunctions: DatabaseFunction[] = [
  {
    id: 1,
    name: "verificar_duplicados",
    arguments: "fecha_desde_str text DEFAUL...",
    returnType: "json",
    security: "disabled",
  },
  {
    id: 2,
    name: "apuestas_por_rango_fechas_brasil",
    arguments: "fecha_desde_str text DEFAUL...",
    returnType: "json",
    security: "disabled",
  },
  {
    id: 3,
    name: "apuestas_por_rango_fechas_brasil",
    arguments: "fecha_desde_str text DEFAULT...",
    returnType: "json",
    security: "active",
  },
  {
    id: 4,
    name: "apuestas_resumen_json",
    arguments: "–",
    returnType: "json",
    security: "active",
  },
  {
    id: 5,
    name: "buscar_ganadores",
    arguments: "fecha_filtro date DEFAULT N...",
    returnType: "TABLE(apuesta_id uuid, usuar...",
    security: "active",
  },
  {
    id: 6,
    name: "buscar_ganadores_48horas",
    arguments: "fecha_filtro date DEFAULT N...",
    returnType: "json",
    security: "active",
  },
]

export default function DatabaseFunctions() {
  const [searchQuery, setSearchQuery] = useState("")
  const [schema, setSchema] = useState("public")

  return (
    <div className="p-6  bg-[#171717]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-white">Database Functions Edge </h1>
        <Button
          variant="outline"
          className="bg-transparent border-[#3a3a3a] text-muted-foreground hover:bg-[#2a2a2a] hover:text-white"
        >
          <Book className="w-4 h-4 mr-2" />
          Docs
        </Button>
      </div>

      {/* Filters and Actions */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {/* Schema Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="bg-[#323232] text-white border-[#3a3a3a] hover:bg-[#2a2a2a] hover:text-white h-7 font-light"
              >
                <p className="text-gray-400 ">schema</p> <span className="font-bold">{schema}</span>
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#2a2a2a] border-[#3a3a3a]">
              <DropdownMenuItem onClick={() => setSchema("public")} className="text-white hover:bg-[#3a3a3a]">
                public
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSchema("auth")} className="text-white hover:bg-[#3a3a3a]">
                auth
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSchema("storage")} className="text-white hover:bg-[#3a3a3a]">
                storage
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search for a function"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-64 bg-[#252525] border-[#3a3a3a] text-white placeholder:text-muted-foreground focus:border-[#4a4a4a] h-7 font-light"
            />
          </div>

          {/* Return Type Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="bg-[#171717] text-white border-dashed border-[#3a3a3a]  hover:bg-[#2a2a2a] hover:text-white h-7"
              >
                Return Type
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#2a2a2a] border-[#3a3a3a]">
              <DropdownMenuItem className="text-white hover:bg-[#3a3a3a]">json</DropdownMenuItem>
              <DropdownMenuItem className="text-white hover:bg-[#3a3a3a]">TABLE</DropdownMenuItem>
              <DropdownMenuItem className="text-white hover:bg-[#3a3a3a]">void</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Security Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="bg-[#171717] border-dashed border-[#3a3a3a] text-white hover:bg-[#2a2a2a] hover:text-white h-7"
              >
                asset
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#2a2a2a] border-[#3a3a3a]">
              <DropdownMenuItem className="text-white hover:bg-[#3a3a3a]">Invoker</DropdownMenuItem>
              <DropdownMenuItem className="text-white hover:bg-[#3a3a3a]">Definer</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Create Button */}
        <div className="flex items-center gap-2">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white h-9">Create a new function</Button>
          <Button
            variant="outline"
            size="icon"
            className="bg-transparent border-[#3a3a3a] text-muted-foreground hover:bg-[#2a2a2a] hover:text-white h-9 w-9"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border border-[#3a3a3a] rounded-lg overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[1fr_1fr_1fr_150px_50px] bg-[#1a1a1a] border-b border-[#3a3a3a] text-xs text-muted-foreground uppercase tracking-wider">
          <div className="px-4 py-3">Name</div>
          <div className="px-4 py-3">Arguments</div>
          <div className="px-4 py-3">Return Type</div>
          <div className="px-4 py-3">asset</div>
          <div className="px-4 py-3"></div>
        </div>

        {/* Table Body */}
        {mockFunctions.map((func) => (
          <div
            key={func.id}
            className="grid grid-cols-[1fr_1fr_1fr_150px_50px] border-b border-[#3a3a3a] last:border-b-0 hover:bg-[#222222] transition-colors"
          >
            <div className="px-4 py-4 text-gray-300 underline font-mono text-sm truncate">{func.name}</div>
            <div className="px-4 py-4 text-muted-foreground font-mono text-sm truncate">{func.arguments}</div>
            <div className="px-4 py-4 text-muted-foreground font-mono text-sm truncate">{func.returnType}</div>
            <div className="px-4 py-4 text-muted-foreground text-sm">{func.security}</div>
            <div className="px-4 py-4 flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-white hover:bg-[#3a3a3a]"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-[#2a2a2a] border-[#3a3a3a]">
                  <DropdownMenuItem className="text-white hover:bg-[#3a3a3a]">Edit</DropdownMenuItem>
                  <DropdownMenuItem className="text-white hover:bg-[#3a3a3a]">Duplicate</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-400 hover:bg-[#3a3a3a]">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
      <DialogDemo/>
    </div>
  )
}
