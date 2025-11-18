import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

export const formatDateToMDYYYY = (date: Date | undefined): string => {
  if (!date) return "";
  return format(date, "d/M/yyyy"); // Formato 8/8/2025
};



export const formatDateToMMDDYYYYBR = (date: Date | string | undefined): string => {
  if (!date) return "";

  return formatInTimeZone(date, "America/Sao_Paulo", "dd/MM/yyyy");
}


export const formatDateToMMDDYYYYBrasil = (date: Date | undefined): string => {
  if (!date) return "";
  return formatInTimeZone(date, "America/Sao_Paulo", "dd/MM/yyyy");
};


export const formatDateToMMDDYYYYColombia = (date: Date | undefined): string => {
  if (!date) return "";
  return formatInTimeZone(date, "America/Bogota", "dd/MM/yyyy");
};


export const formatDateToDMY = (date: Date | undefined): string => {
  if (!date) return "";
  return format(date, "d/M/yyyy"); // Formato 8/8/2025
};

export const parseMDYYYYToDate = (dateString: string): Date | undefined => {
  if (!dateString) return undefined;
  
  const parts = dateString.split("/");
  if (parts.length !== 3) return undefined;

  const month = parseInt(parts[0], 10) - 1; // Meses en JS son 0-indexados
  const day = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);

  return new Date(year, month, day);
};