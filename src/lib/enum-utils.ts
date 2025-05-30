import { Sexo, EstatusCandidato, AreaInteres, CanalRecepcion, TipoContacto } from '@/types';

/**
 * Utility functions for converting between enum display values and database keys
 */

// Función para convertir valores de display a claves de enum
export const getEnumKeyFromDisplayValue = <T extends Record<string, string>>(
  enumObj: T, 
  displayValue: string
): keyof T | null => {
  const entry = Object.entries(enumObj).find(([_, val]) => val === displayValue);
  return entry ? entry[0] as keyof T : null;
};

// Función para convertir claves de enum a valores de display
export const getDisplayValueFromEnumKey = <T extends Record<string, string>>(
  enumObj: T, 
  enumKey: keyof T
): string => {
  return enumObj[enumKey] || enumKey.toString();
};

// Función específica para filtros - maneja tanto claves como valores de display
export const normalizeEnumValueForFilter = <T extends Record<string, string>>(
  enumObj: T, 
  value: string,
  enumName: string = 'Unknown'
): string => {
  // Si el valor ya es una clave válida del enum, devolverlo
  if (Object.keys(enumObj).includes(value)) {
    console.log(`[${enumName}] Value "${value}" is already a valid enum key`);
    return value;
  }
  
  // Si es un valor de display, convertir a clave
  const enumKey = getEnumKeyFromDisplayValue(enumObj, value);
  if (enumKey) {
    console.log(`[${enumName}] Converted display value "${value}" to enum key "${enumKey}"`);
    return enumKey.toString();
  }
  
  // Si no se encuentra, log de error y devolver el valor original
  console.error(`[${enumName}] Could not normalize value "${value}".`);
  console.error(`Available enum keys:`, Object.keys(enumObj));
  console.error(`Available display values:`, Object.values(enumObj));
  return value;
};

// Funciones específicas para cada enum
export const normalizeSexoForFilter = (value: string): string => 
  normalizeEnumValueForFilter(Sexo, value, 'Sexo');

export const normalizeEstatusForFilter = (value: string): string => 
  normalizeEnumValueForFilter(EstatusCandidato, value, 'EstatusCandidato');

export const normalizeAreaInteresForFilter = (value: string): string => 
  normalizeEnumValueForFilter(AreaInteres, value, 'AreaInteres');

export const normalizeCanalRecepcionForFilter = (value: string): string => 
  normalizeEnumValueForFilter(CanalRecepcion, value, 'CanalRecepcion');

export const normalizeTipoContactoForFilter = (value: string): string => 
  normalizeEnumValueForFilter(TipoContacto, value, 'TipoContacto');

// Función para normalizar todos los filtros de enum de una vez
export const normalizeFiltersForApi = (filters: Record<string, any>): Record<string, any> => {
  const normalized = { ...filters };
  
  if (normalized.sexo && normalized.sexo !== 'Todos') {
    normalized.sexo = normalizeSexoForFilter(normalized.sexo);
  }
  
  if (normalized.estatus && normalized.estatus !== 'Todos') {
    normalized.estatus = normalizeEstatusForFilter(normalized.estatus);
  }
  
  if (normalized.area_interes && normalized.area_interes !== 'Todos') {
    normalized.area_interes = normalizeAreaInteresForFilter(normalized.area_interes);
  }
  
  return normalized;
};
