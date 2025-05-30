
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FilterIcon, SearchIcon, RotateCcwIcon, Loader2 } from 'lucide-react';
import { getUbicacionesPrincipales, getZonasByUbicacion } from '@/lib/locations';
import { SEXO_OPTIONS, ESTATUS_CANDIDATO_OPTIONS, AREA_INTERES_OPTIONS, EDAD_FILTER_OPTIONS } from '@/lib/constants';

export interface FiltersState {
  searchInput: string;
  sexo: string;
  edad: string;
  estatus: string;
  ubicacion: string;
  zona: string;
  area: string;
}

interface CandidateFiltersProps {
  onFilterChange: (filters: FiltersState) => void;
  initialFilters: FiltersState;
  currentFilters?: FiltersState;
}

const CandidateFiltersComponent = function CandidateFilters({ onFilterChange, initialFilters, currentFilters }: CandidateFiltersProps) {
  const [filters, setFilters] = useState<FiltersState>(currentFilters || initialFilters);
  const [zonasOptions, setZonasOptions] = useState<string[]>([]);

  // Sincronizar estado interno con filtros externos
  useEffect(() => {
    if (currentFilters) {
      setFilters(currentFilters);
      setSearchValue(currentFilters.searchInput || '');
    }
  }, [currentFilters]);

  // Separar el efecto de zonas del efecto de filtros
  useEffect(() => {
    if (filters.ubicacion && filters.ubicacion !== 'Todas') {
      setZonasOptions(getZonasByUbicacion(filters.ubicacion));
    } else {
      setZonasOptions([]);
    }
  }, [filters.ubicacion]);



  // Debounce solo para búsqueda de texto
  const [searchValue, setSearchValue] = useState(filters.searchInput || '');

  useEffect(() => {
    if (searchValue !== filters.searchInput) {
      const timeoutId = setTimeout(() => {
        const newFilters = { ...filters, searchInput: searchValue };
        setFilters(newFilters);
        onFilterChange(newFilters);
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [searchValue, filters, onFilterChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'searchInput') {
      setSearchValue(value);
    } else {
      const newFilters = { ...filters, [name]: value };
      setFilters(newFilters);
      onFilterChange(newFilters);
    }
  };

  const handleSelectChange = (name: keyof FiltersState, value: string) => {
    console.log(`[CandidateFilters] Changing ${name} to:`, value);
    const newFilters = { ...filters, [name]: value };
    if (name === 'ubicacion') {
      newFilters.zona = 'Todas';
    }
    console.log('[CandidateFilters] New filters state:', newFilters);
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    setFilters(initialFilters);
    setSearchValue(initialFilters.searchInput || '');
    onFilterChange(initialFilters);
  };

  // Contar filtros activos
  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'searchInput') return value && value.trim() !== '';
    return value && value !== 'Todos' && value !== 'Todas';
  }).length;

  const ubicacionesPrincipales = ["Todas", ...getUbicacionesPrincipales()];
  const sexoOptions = ["Todos", ...SEXO_OPTIONS];
  const estatusOptions = ["Todos", ...ESTATUS_CANDIDATO_OPTIONS];
  const areaOptions = ["Todos", ...AREA_INTERES_OPTIONS];
  const edadOptions = EDAD_FILTER_OPTIONS;

  // Debug: Log para verificar que los valores están en las opciones
  console.log('[CandidateFilters] Current filters:', filters);
  console.log('[CandidateFilters] Sexo options:', sexoOptions);
  console.log('[CandidateFilters] Estatus options:', estatusOptions);
  console.log('[CandidateFilters] Area options:', areaOptions);

  return (
    <Card className="mb-6 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <FilterIcon className="mr-2 h-5 w-5 text-primary" />
            Filtrar Candidatos
          </div>
          {activeFiltersCount > 0 && (
            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
              {activeFiltersCount} filtro{activeFiltersCount !== 1 ? 's' : ''} activo{activeFiltersCount !== 1 ? 's' : ''}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="searchInput">Búsqueda General</Label>
              <div className="relative">
                <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="searchInput"
                  name="searchInput"
                  type="text"
                  placeholder="Nombre o Cédula..."
                  value={searchValue}
                  onChange={handleInputChange}
                  className="pl-8"
                />
              </div>
            </div>
             <div>
              <Label htmlFor="filterSexo">Sexo</Label>
              <Select name="sexo" value={filters.sexo} onValueChange={(value) => handleSelectChange('sexo', value)}>
                <SelectTrigger id="filterSexo">
                  <SelectValue placeholder="Seleccionar sexo" />
                </SelectTrigger>
                <SelectContent>
                  {sexoOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="filterEdad">Edad</Label>
              <Select name="edad" value={filters.edad} onValueChange={(value) => handleSelectChange('edad', value)}>
                <SelectTrigger id="filterEdad"><SelectValue placeholder="Todas" /></SelectTrigger>
                <SelectContent>
                  {edadOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="filterEstatus">Estatus</Label>
              <Select name="estatus" value={filters.estatus} onValueChange={(value) => handleSelectChange('estatus', value)}>
                <SelectTrigger id="filterEstatus"><SelectValue placeholder="Todos" /></SelectTrigger>
                <SelectContent>
                  {estatusOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="filterUbicacion">Ubicación</Label>
              <Select name="ubicacion" value={filters.ubicacion} onValueChange={(value) => handleSelectChange('ubicacion', value)}>
                <SelectTrigger id="filterUbicacion"><SelectValue placeholder="Todas" /></SelectTrigger>
                <SelectContent>
                  {ubicacionesPrincipales.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="filterZona">Zona</Label>
              <Select
                name="zona"
                value={filters.zona}
                onValueChange={(value) => handleSelectChange('zona', value)}
                disabled={!filters.ubicacion || filters.ubicacion === 'Todas' || zonasOptions.length === 0}
              >
                <SelectTrigger id="filterZona"><SelectValue placeholder="Todas" /></SelectTrigger>
                <SelectContent>
                   <SelectItem value="Todas">Todas</SelectItem>
                  {zonasOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
             <div>
              <Label htmlFor="filterArea">Área de Interés</Label>
              <Select name="area" value={filters.area} onValueChange={(value) => handleSelectChange('area', value)}>
                <SelectTrigger id="filterArea"><SelectValue placeholder="Todas" /></SelectTrigger>
                <SelectContent>
                  {areaOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              title="Restablecer filtros"
              disabled={activeFiltersCount === 0}
            >
              <RotateCcwIcon className="mr-2 h-4 w-4" />
              Limpiar {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const CandidateFilters = React.memo(CandidateFiltersComponent, (prevProps, nextProps) => {
  // Comparación profunda de currentFilters
  const currentFiltersEqual = JSON.stringify(prevProps.currentFilters) === JSON.stringify(nextProps.currentFilters);
  const initialFiltersEqual = JSON.stringify(prevProps.initialFilters) === JSON.stringify(nextProps.initialFilters);

  return (
    initialFiltersEqual &&
    currentFiltersEqual &&
    prevProps.onFilterChange === nextProps.onFilterChange
  );
});

