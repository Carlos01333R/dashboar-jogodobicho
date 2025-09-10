"use client"
import { useAuthAdminZona } from "@/context/AuthContextAdminZona"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const { user, isLoading, setCountry } = useAuthAdminZona()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/AdminZona/login")
    }
  }, [isLoading, user, router])

  useEffect(() => {
   localStorage.removeItem('activeSection')
  },
  [])


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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-blue-600 p-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Seleccione el País (Admin zona)</h1>
          <p className="text-white/90">Elija el sistema de lotería que desea administrar</p>
        </div>

        {/* Opciones de países */}
        <div className="p-8 grid md:grid-cols-2 gap-8">
          {/* Brasil */}
          <div
            onClick={() => {
              setCountry("brazil")
              router.push("/AdminZona/br/dashboard")
            }}
            className="group cursor-pointer bg-gradient-to-br from-green-50 to-yellow-50 border-2 border-green-200 rounded-xl p-8 hover:border-green-400 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <div className="text-center">
              {/* Bandera de Brasil */}
              <div className="mx-auto mb-6 w-32 h-20 bg-gradient-to-b from-green-500 via-yellow-400 to-blue-600 rounded-lg shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-green-500" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-12 bg-yellow-400 rounded-full" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-8 bg-blue-600 rounded-full" />
              </div>

              <h3 className="text-2xl font-bold text-green-700 mb-3 group-hover:text-green-800 transition-colors">
                Lotería de Brasil
              </h3>
              <p className="text-gray-600 mb-4">Administrar Mega-Sena, Quina, Lotofácil y más loterías brasileñas</p>

              <div className="text-sm text-green-600 space-y-1">
                <div>{"•"} Mega-Sena</div>
                <div>{"•"} Quina</div>
                <div>{"•"} Lotofácil</div>
                <div>{"•"} Timemania</div>
              </div>
              <div className="mt-6 bg-green-500 text-white py-3 px-6 rounded-lg font-semibold group-hover:bg-green-600 transition-colors">
                Seleccionar Brasil
              </div>
            </div>
          </div>

          {/* Colombia */}
          <div
            onClick={() => {
              setCountry("colombia")
              router.push("/AdminZona/co/dashboard")
            }}
            className="group cursor-pointer bg-gradient-to-br from-yellow-50 to-red-50 border-2 border-yellow-200 rounded-xl p-8 hover:border-yellow-400 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <div className="text-center">
              {/* Bandera de Colombia */}
              <div className="mx-auto mb-6 w-32 h-20 bg-gradient-to-b from-yellow-400 via-blue-600 to-red-500 rounded-lg shadow-lg relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2/4 bg-yellow-400" />
                <div className="absolute top-2/4 left-0 right-0 h-1/4 bg-blue-600" />
                <div className="absolute top-3/4 left-0 right-0 h-1/4 bg-red-500" />
              </div>

              <h3 className="text-2xl font-bold text-yellow-700 mb-3 group-hover:text-yellow-800 transition-colors">
                Lotería de Colombia
              </h3>
              <p className="text-gray-600 mb-4">Administrar Baloto, Loto y loterías tradicionales colombianas</p>

              <div className="text-sm text-yellow-600 space-y-1">
                <div>{"•"} Baloto</div>
                <div>{"•"} Loto Colombia</div>
                <div>{"•"} Lotería de Bogotá</div>
                <div>{"•"} Chance</div>
              </div>
              <div className="mt-6 bg-yellow-500 text-white py-3 px-6 rounded-lg font-semibold group-hover:bg-yellow-600 transition-colors">
                Seleccionar Colombia
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 text-center text-sm text-gray-600">
          Puede cambiar el país en cualquier momento desde el menú principal
        </div>
      </div>
    </div>
  )
}
