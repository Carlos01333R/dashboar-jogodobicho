'use client'
import React, { useEffect, useState } from 'react';
import { Trophy, Calendar, DollarSign, MapPin, User, Clock, Filter, Download, View } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import useZonas from '@/hook/co/useZonas';
import { FormatCurrencyCO } from '@/utils/Format';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ModalDetail } from '@/components/ganadores/ModalDetall';
import useLoteriaComparisonNew from '@/hook/co/useLoteryWin';
import Link from 'next/link';

interface Winner {
  lottery: string;
  boleto: string;
  result: string;
  match2: boolean;
  match3: boolean;
  match4: boolean;
  premio: number;
  combi: string;
  nombre: string;
  celular: string;
  fecha: string;
  hora: string;
  fecha_hora: string;
  numero_venta: string;
  zona: string;
  email: string;
  venta: string;
  boletos: string[];
}

const WinnersToday: React.FC = () => {
  const { selectedCountry } = useAuth();
  const [numeto_ticket, setNumTicket] = useState('');
  const [filterZona, setFilterZona] = useState('all');
  const { zonas } = useZonas();
  const { resultados, refrescar, loading, error } = useLoteriaComparisonNew();
  const [estado, setEstado] = useState({
    mensaje: "Cargando...",
    insertados: 0,
    total: 0,
  });

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!data.session) {
        window.location.href = "/";
      }
    };
    checkSession();
  }, []);


  const procesarYGuardarResultados = async (resultadosArray : any) => {
    try {
      if (!resultadosArray || !Array.isArray(resultadosArray)) {
        console.error("Datos no válidos:", resultadosArray);
        return [];
      }

      const datosAgrupados = {} as any;

      // Iterar sobre cada resultado en el array
      resultadosArray.forEach((resultado) => {
        if (!resultado.boletos || !Array.isArray(resultado.boletos)) {
          console.warn("Resultado sin boletos válidos:", resultado);
          return;
        }

        const numeroVenta = resultado.numero_venta || "";

        if (!datosAgrupados[numeroVenta]) {
          datosAgrupados[numeroVenta] = {
            match4: "false",
            match3: "false",
            match2: "false",
            hora: resultado.hora || "",
            fecha: resultado.fecha || "",
            celular: resultado.celular || "",
            nombre: resultado.nombre || "",
            result: "",
            boleto: "",
            lottery: "",
            email: resultado.vendedor || "",
            zona: resultado.zona || "",
            premio: 0,
            numero_venta: numeroVenta,
            fecha_hora: resultado.fecha_hora || new Date().toISOString(),
            boletosArray: [],
            lotteriesArray: [],
            resultsArray: [],
          };
        }

        // Procesar cada boleto de este resultado
        resultado.boletos.forEach((boleto : any) => {
          const grupo = datosAgrupados[numeroVenta];

          grupo.premio += boleto.premio || 0;

          if (boleto.numero && !grupo.boletosArray.includes(boleto.numero)) {
            grupo.boletosArray.push(boleto.numero);
          }

          if (
            boleto.lottery &&
            !grupo.lotteriesArray.includes(boleto.lottery)
          ) {
            grupo.lotteriesArray.push(boleto.lottery);
          }

          if (
            boleto.resultado &&
            !grupo.resultsArray.includes(boleto.resultado)
          ) {
            grupo.resultsArray.push(boleto.resultado);
          }

          if (boleto.match4) grupo.match4 = "true";
          if (boleto.match3) grupo.match3 = "true";
          if (boleto.match2) grupo.match2 = "true";
        });
      });

      // Convertir a array formateado
      const datosParaInsertar = Object.values(datosAgrupados).map((grupo : any) => ({
        match4: grupo.match4,
        match3: grupo.match3,
        match2: grupo.match2,
        hora: grupo.hora,
        fecha: grupo.fecha,
        celular: grupo.celular,
        nombre: grupo.nombre,
        result: grupo.resultsArray.join(", "),
        boleto: grupo.boletosArray.join(", "),
        lottery: grupo.lotteriesArray.join(", "),
        email: grupo.email,
        zona: grupo.zona,
        premio: grupo.premio.toString(),
        numero_venta: grupo.numero_venta,
        fecha_hora: grupo.fecha_hora,
      }));

      console.log("Datos agrupados para insertar:", datosParaInsertar);
      return datosParaInsertar;
    } catch (error) {
      console.error("Error en procesarYGuardarResultados:", error);
      return [];
    }
  };

  // Función para verificar y insertar solo registros nuevos
  const insertarSoloNuevosGanadores = async (datos : any) => {
    if (!datos || datos.length === 0) {
      console.log("No hay datos para insertar");
      return [];
    }

    const resultadosInsertados = [];

    for (const dato of datos) {
      try {
        // Verificar si ya existe un registro con el mismo numero_venta
        const { data: existente, error: errorConsulta } = await supabase
          .from("win")
          .select("numero_venta")
          .eq("numero_venta", dato.numero_venta)
          .maybeSingle();

        if (errorConsulta) {
          console.error(
            `Error al verificar numero_venta ${dato.numero_venta}:`,
            errorConsulta
          );
          continue;
        }

        // Si no existe, insertar
        if (!existente) {
          const { data: nuevoRegistro, error: errorInsercion } = await supabase
            .from("win")
            .insert(dato)
            .select()
            .single();

          if (errorInsercion) {
            console.error(
              `Error al insertar numero_venta ${dato.numero_venta}:`,
              errorInsercion
            );
          } else {
            console.log(`Insertado: ${dato.numero_venta}`);
            resultadosInsertados.push(nuevoRegistro);
          }
        } else {
          console.log(`Ya existe: ${dato.numero_venta} - Saltando inserción`);
        }
      } catch (error) {
        console.error(
          `Error procesando numero_venta ${dato.numero_venta}:`,
          error
        );
      }
    }

    return resultadosInsertados;
  };

  // Función principal para procesar e insertar

  // Uso

  useEffect(() => {
    const ejecutarProceso = async () => {
      if (loading || error || !resultados || !Array.isArray(resultados)) {
        return;
      }

      setEstado({ mensaje: "Procesando datos...", insertados: 0, total: 0 });

      try {
        const datosProcesados = await procesarYGuardarResultados(resultados);
        console.log("Datos procesados:", datosProcesados);
        const total = datosProcesados.length;

        if (total === 0) {
          setEstado({
            mensaje: "No hay datos para procesar",
            insertados: 0,
            total: 0,
          });
          return;
        }

        const resultadosInsertados = await insertarSoloNuevosGanadores(
          datosProcesados
        );

        setEstado({
          mensaje:
            resultadosInsertados.length === 0
              ? "Todos los registros ya existían"
              : "Proceso completado",
          insertados: resultadosInsertados.length,
          total: total,
        });
      } catch (err: any) {
        setEstado({
          mensaje: `Error: ${err.message}`,
          insertados: 0,
          total: 0,
        });
      }
    };

    ejecutarProceso();
  }, [resultados, loading, error]);

// filtrar resultados por zona y numero_de_ticket
const FilterResult = resultados.filter((result: any) => {
  // Filtrar por zona
  const zonaMatch = filterZona === 'all' || result.zona === filterZona;
  
  // Filtrar por número de ticket (si se ingresó)
  const ticketMatch = !numeto_ticket || 
                     result.numero_venta.toLowerCase().includes(numeto_ticket.toLowerCase());
  
  return zonaMatch && ticketMatch;
});


 const totalPrizes = resultados.reduce((sum : any, winner : any) => sum + winner.premio_total, 0);
const TotalWinner = resultados.length;


  if(loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        <p className="font-bold text-xl ml-4">Cargando datos...</p>
      </div>
    );

  if(error)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="font-bold text-xl text-red-600">{error}</p>
        </div>
      </div>
    );
  return (
    <div className="p-2 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base md:text-3xl font-bold text-gray-900">Ganadores de Hoy</h2>
          <p className="text-gray-600 mt-1">
            Premios del día {new Date().toLocaleDateString('es-ES')}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link href="/co/dashboard/loterias/resultados" className='bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors '>
            <View className="w-4 h-4" />
            <span>Ver resultadas</span>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar por #Ticket 
            </label>
            <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="Ingrese el número de ticket" onChange={(e) => setNumTicket(e.target.value)} />
        </div>
         

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zona
            </label>
             <Select name="sector" required onValueChange={(value) => setFilterZona(value)}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Seleccione un sector" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                <SelectLabel>Sector</SelectLabel>
                {zonas.map((sector: any) => (
                  <SelectItem value={sector.nombre} key={sector.id} > 
                    {sector.nombre}
                  </SelectItem>
                ))}
                <SelectItem value="all">Todas las zonas</SelectItem>
                </SelectGroup>
            </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Ganadores</p>
              <p className="text-2xl font-bold text-gray-900">{TotalWinner}</p>
            </div>
            <div className="p-3 rounded-lg bg-emerald-500">
              <Trophy className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Premios</p>
              <p className="text-xl font-bold text-gray-900 truncate">{FormatCurrencyCO(totalPrizes)}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {FilterResult.map((winner : any) => (
          <div key={winner.numero_venta} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-full bg-green-100`}>
                  <Trophy className={`w-6 h-6 text-gren-500`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{winner.nombre}</h3>
                  <p className="text-sm text-gray-500">Ticket #{winner.numero_venta}</p>
                </div>
              </div>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800 `}>
                Premiado
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Premio:</span>
                <span className="text-lg font-bold text-emerald-600">{FormatCurrencyCO(winner.premio_total)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Lotería:</span>
                <span className="text-xs font-medium text-gray-900">  
              {Array.from(winner.loterias).join(", ")}

             </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  Zona:
                </span>
                <span className="text-sm font-medium text-gray-900">{winner.zona}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  fecha y Hora:
                </span>
                <span className="text-sm font-medium text-gray-900">{winner.fecha} - {winner.hora}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  Contacto:
                </span>
                <span className="text-sm font-medium text-gray-900">{winner.celular}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex space-x-3">
              <ModalDetail lottery={winner.loterias} boleto={winner.boletos}  premio={winner.premio_total} nombre={winner.nombre} celular={winner.celular} fecha={winner.fecha} hora={winner.hora}  numero_venta={winner.numero_venta} zona={winner.zona} email={winner.vendedor} venta_total={winner.venta_total} />
             
               
              </div>
            </div>
          </div>
        ))}
      </div>

 
    </div>
  );
};

export default WinnersToday;