// Configuración específica para Supabase
// Este archivo detecta automáticamente si estamos usando PostgreSQL (Supabase) o SQLite

export const isSupabaseEnabled = () => {
  const databaseUrl = process.env.DATABASE_URL || '';
  return databaseUrl.includes('postgresql://') || databaseUrl.includes('postgres://');
};

export const getDatabaseProvider = () => {
  return isSupabaseEnabled() ? 'postgresql' : 'sqlite';
};

export const getSearchMode = () => {
  // PostgreSQL soporta mode: 'insensitive', SQLite no
  return isSupabaseEnabled() ? 'insensitive' : undefined;
};

// Configuración de consultas que se adapta al proveedor de base de datos
export const createSearchFilter = (field: string, searchTerm: string) => {
  const mode = getSearchMode();
  
  if (mode) {
    return { contains: searchTerm, mode };
  } else {
    return { contains: searchTerm };
  }
};

// Log de configuración para debugging
export const logDatabaseConfig = () => {
  const provider = getDatabaseProvider();
  const url = process.env.DATABASE_URL?.replace(/:[^:@]*@/, ':***@') || 'No configurada';
  
  console.log(`[Database] Provider: ${provider}`);
  console.log(`[Database] URL: ${url}`);
  console.log(`[Database] Search mode: ${getSearchMode() || 'none'}`);
};
