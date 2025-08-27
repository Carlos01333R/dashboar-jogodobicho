"use client";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { useUsuarios } from "@/hook/co/User";
import { useState } from "react";
import { ChevronDownIcon } from "lucide-react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import VistaInfo from "@/components/usuarios/VentasUser";
import { useAuth } from "@/context/AuthContext";

export default function VistaUsuario() {
  const { usuarios, loading } = useUsuarios();
  const [selectUser, setSelectUser] = useState<string>("");
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>('');
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const { selectedCountry } = useAuth()

  const handleFechaChange = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
    
      const formattedDate = `${selectedDate.getDate()}/${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()}`;
      setFechaSeleccionada(formattedDate);
    } else {
      setFechaSeleccionada('');
    }
    setOpen(false);
  };

  const handleUserChange = (value: string) => {
    setSelectUser(value);
  };

  const selectedUserData = usuarios.find((u) => u.email === selectUser);

  if(loading) {
    return (
      <section className="w-full flex flex-col px-3 py-2 justify-center items-center">
       <p>Cargando datos...</p>
      </section>
    );
  }
  return (
    <>
      <section className="w-full flex flex-col px-3 py-2 justify-center items-center">
        <Card className="w-full md:w-1/2 justify-center items-center ">
          <CardHeader className="w-full flex justify-center">
            <h2 className="text-2xl font-bold">Análisis de usuarios</h2>
          </CardHeader>
          <CardContent className="w-full justify-center items-center">
         
            {usuarios && (
              <section className="w-full flex flex-col md:flex-row px-3 py-2 justify-center items-center gap-4">
                {/* Select de usuarios */}
                <div className="w-full ">
                  <Select value={selectUser} onValueChange={handleUserChange}>
                    <SelectTrigger className="w-full md:w-[200px]">
                      <SelectValue placeholder="Seleccione un usuario" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Usuarios</SelectLabel>
                        {usuarios.map((user: any) => (
                          <SelectItem value={user.email} key={user.email}>
                            {user.email} - {user.sector}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {/* DatePicker */}
                <div className="w-full md:w-1/2">
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full md:w-48 justify-between font-normal"
                      >
                        {date ? `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}` : "Seleccione fecha"}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleFechaChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </section>
            )}
          </CardContent>
        </Card>

        {selectedUserData && fechaSeleccionada ? (
        <VistaInfo
          selectUser={selectedUserData.email}
          fechaSeleccionada={fechaSeleccionada}
          sector={selectedUserData.sector}
          country={selectedCountry}
        />
      ) : (
        <p className="text-center py-4 text-xs text-gray-500"> Selecciona el usuario y la fecha</p>
      )}
      </section>
    </>
  );
}