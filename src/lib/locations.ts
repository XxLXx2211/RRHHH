import type { LocationData } from '@/types';

export const UBICACIONES_VENEZUELA: LocationData = {
  "Caracas": [
    "Petare", "El Paraíso", "Propatria", "Junquito", "El Hatillo",
    "Caricuao", "Altagracia", "El Junquito (Parroquia)", "Libertador", "Santa Rosalía", "Catia", "Otro"
  ],
  "Los Teques (Altos Mirandinos)": [
    "Los Teques Centro", "Carrizal", "San Antonio de los Altos", "El Jarillo", "Otro"
  ],
  "Valles del Tuy": [
    "Charallave", "Ocumare del Tuy", "Santa Teresa del Tuy", "Cúa", "Otro"
  ],
  "Barlovento": [
    "Higuerote", "Río Chico", "Caucagua", "Tacarigua", "Otro"
  ],
  "Guarenas-Guatire": [
    "Guarenas", "Guatire", "Araira", "Otro"
  ],
  "La Guaira (Litoral Central)": [
    "Catia La Mar", "Caraballeda", "Macuto", "Naiguatá", "Maiquetía", "Otro"
  ],
  "Otro": [] // Allows for a free text input for zona if "Otro" ubicacion is chosen
};

export const getUbicacionesPrincipales = (): string[] => Object.keys(UBICACIONES_VENEZUELA);

export const getZonasByUbicacion = (ubicacion: string): string[] => {
  return UBICACIONES_VENEZUELA[ubicacion] || [];
};
