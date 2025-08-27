'use client'
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useLoteriasAdministrador } from "@/hook/co/useLoterias";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function LotteryAnalysis() {
  const [selectedLottery, setSelectedLottery] = useState("");
  const [topNumbers, setTopNumbers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { loterias } = useLoteriasAdministrador()

  useEffect(() => {
    if (selectedLottery) {
      analyzeNumbers(selectedLottery);
    }
  }, [selectedLottery]);

  async function analyzeNumbers(lottery: string) {
    setLoading(true);

    const { data, error } = await supabase.rpc("get_combined_frequency", {
      lottery_name: lottery,
    });

    if (error) {
      console.error("Error fetching top numbers:", error);
      setLoading(false);
      return;
    }

    setTopNumbers(data || []);
    setLoading(false);
  }

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader className="flex justify-center">
        <h2 className="text-2xl font-bold">Análisis de Lotería</h2>
      </CardHeader>
      <CardContent className="w-full flex flex-col items-center">
        <Select value={selectedLottery} onValueChange={setSelectedLottery}>
          <SelectTrigger className="max-w-xs mb-4">
            <SelectValue placeholder="Selecciona una lotería" />
          </SelectTrigger>
          <SelectContent>
            {loterias.map((lottery: any) => (
              <SelectItem key={lottery.name} value={lottery.name}>
                <div className="flex items-center gap-2">
                  <img
                    src={lottery.logo || "/placeholder.svg"}
                    alt={`Logo de ${lottery.name}`}
                    className="w-6 h-6 rounded"
                  />
                  <span>{lottery.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-solid border-current border-r-transparent" />
            <div className="mt-2 text-center">Cargando...</div>
          </div>
        ) : selectedLottery ? (
          <div className="w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>NÚMERO</TableHead>
                  <TableHead>FRECUENCIA</TableHead>
                  <TableHead>PREMIADOS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topNumbers.map(({ numero, frecuencia_ventas, frecuencia_win }) => (
                  <TableRow key={numero}>
                    <TableCell>{numero}</TableCell>
                    <TableCell>{frecuencia_ventas} veces</TableCell>
                    <TableCell>{frecuencia_win} premios</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">
            Selecciona una lotería para ver los números más repetidos.
          </p>
        )}
      </CardContent>
    </Card>
  );
}