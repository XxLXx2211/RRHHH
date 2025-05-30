
"use client";

import React, { useState, useMemo } from 'react';
import { type Candidate, EstatusCandidato } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Edit2Icon, EyeIcon, MoreHorizontalIcon, Trash2Icon, ArrowUpDownIcon, SparklesIcon, FileTextIcon } from 'lucide-react';

// Mapeo COMPLETO para mostrar valores formateados en el listado
const PRISMA_TO_TYPESCRIPT_MAPPING: Record<string, string> = {
  // Sexo mappings (incluidos por completitud)
  'Masculino': 'Masculino',
  'Femenino': 'Femenino',

  // CanalRecepcion mappings - TODOS los valores
  'Web': 'Web',
  'Referido': 'Referido',
  'Oficina': 'Oficina',
  'RedesSociales': 'Redes Sociales',
  'BolsaEmpleo': 'Bolsa de Empleo',
  'EntregaCVPresencial': 'Entrega CV Presencial',
  'WhatsApp': 'WhatsApp',
  'PortalWeb': 'Portal Web',
  'LlamadaDirecta': 'Llamada Directa',
  'Facebook': 'Facebook',

  // TipoContacto mappings - TODOS los valores
  'Llamada': 'Llamada',
  'Correo': 'Email',
  'Presencial': 'Presencial',
  'Mensaje': 'Mensaje',
  'Entrevista': 'Entrevista',
  'EntrevistaTelefonica': 'Entrevista Telefónica',
  'WhatsApp': 'WhatsApp',

  // EstatusCandidato mappings - TODOS los valores
  'Asignado': 'Asignado',
  'NoElegible': 'No Elegible',
  'Elegible': 'Elegible',
  'Renuncia': 'Renuncia',
  'NoAsistio': 'No Asistió',
  'AConsiderar': 'A Considerar',
  'NoInteresado': 'No Interesado',
  'NoContesta': 'No Contesta',
  'Rechazado': 'Rechazado',
  'Nuevo': 'Nuevo',
  'EnProceso': 'En Proceso',
  'Entrevistado': 'Entrevistado',
  'Contratado': 'Contratado',
  'Descartado': 'Descartado',
  'EnEspera': 'En Espera',

  // AreaInteres mappings - TODOS los valores
  'OperarioMantenimiento': 'Operario de Mantenimiento',
  'ServiciosGenerales': 'Servicios Generales',
  'EncargadaDePDS': 'Encargada de PDS',
  'OperarioMantenimientoServiciosGenerales': 'Operario de Mantenimiento / Servicios Generales',
  'Ventas': 'Ventas',
  'Administracion': 'Administración',
  'Marketing': 'Marketing',
  'TecnologiaInformacion': 'Tecnología e Información',
  'RecursosHumanos': 'Recursos Humanos',
  'Finanzas': 'Finanzas',
  'Operaciones': 'Operaciones',
  'AtencionCliente': 'Atención al Cliente',
  'Logistica': 'Logística',
  'Produccion': 'Producción',
  'Otro': 'Otro',
};

// Función para convertir valores de Prisma a valores formateados para display
const formatEnumValue = (value: string): string => {
  return PRISMA_TO_TYPESCRIPT_MAPPING[value] || value;
};

interface CandidateListProps {
  candidates: Candidate[];
  onEdit: (candidate: Candidate) => void;
  onViewDetails: (candidate: Candidate) => void;
  onAssessSuitability: (candidate: Candidate) => void;
  onDelete: (candidateId: string) => void;
  hasActiveFilters?: boolean;
}

type SortKey = keyof Candidate | '';
type SortOrder = 'asc' | 'desc';

const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};


export const CandidateList = React.memo(function CandidateList({ candidates, onEdit, onViewDetails, onAssessSuitability, onDelete, hasActiveFilters = false }: CandidateListProps) {
  const [sortKey, setSortKey] = useState<SortKey>('nombres_apellidos');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const sortedCandidates = useMemo(() => {
    if (!sortKey) return candidates;

    return [...candidates].sort((a, b) => {
      const valA = getNestedValue(a, sortKey as string);
      const valB = getNestedValue(b, sortKey as string);

      if (valA === undefined || valA === null) return 1;
      if (valB === undefined || valB === null) return -1;

      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      }
      if (valA instanceof Date && valB instanceof Date) {
        return sortOrder === 'asc' ? valA.getTime() - valB.getTime() : valB.getTime() - valA.getTime();
      }
      if (typeof valA === 'boolean' && typeof valB === 'boolean') {
        return sortOrder === 'asc' ? (valA === valB ? 0 : valA ? -1 : 1) : (valA === valB ? 0 : valA ? 1 : -1);
      }
      // Fallback for other types
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [candidates, sortKey, sortOrder]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const renderSortIcon = (key: SortKey) => {
    if (sortKey !== key) {
      return <ArrowUpDownIcon className="ml-2 h-4 w-4 opacity-50" />;
    }
    return sortOrder === 'asc' ?
      <ArrowUpDownIcon className="ml-2 h-4 w-4 opacity-100 transform rotate-0 transition-transform" /> :
      <ArrowUpDownIcon className="ml-2 h-4 w-4 opacity-100 transform rotate-180 transition-transform" />;
  };


  if (candidates.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-12">
        <div className="text-lg font-medium mb-2">
          {hasActiveFilters ? 'No se encontraron candidatos con los filtros aplicados' : 'No hay candidatos registrados'}
        </div>
        <p className="text-sm">
          {hasActiveFilters
            ? 'Intenta ajustar los filtros para obtener más resultados'
            : 'Comienza agregando tu primer candidato'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => handleSort('nombres_apellidos')} className="cursor-pointer hover:bg-muted/50">
              <div className="flex items-center">Nombre {renderSortIcon('nombres_apellidos')}</div>
            </TableHead>
            <TableHead onClick={() => handleSort('cedula')} className="cursor-pointer hover:bg-muted/50 hidden md:table-cell">
              <div className="flex items-center">Cédula {renderSortIcon('cedula')}</div>
            </TableHead>
            <TableHead onClick={() => handleSort('edad')} className="cursor-pointer hover:bg-muted/50 hidden lg:table-cell">
              <div className="flex items-center">Edad {renderSortIcon('edad')}</div>
            </TableHead>
            <TableHead onClick={() => handleSort('sexo')} className="cursor-pointer hover:bg-muted/50 hidden md:table-cell">
               <div className="flex items-center">Sexo {renderSortIcon('sexo')}</div>
            </TableHead>
            <TableHead onClick={() => handleSort('ubicacion')} className="cursor-pointer hover:bg-muted/50 hidden lg:table-cell">
               <div className="flex items-center">Ubicación {renderSortIcon('ubicacion')}</div>
            </TableHead>
            <TableHead onClick={() => handleSort('area_interes')} className="cursor-pointer hover:bg-muted/50">
              <div className="flex items-center">Área Interés {renderSortIcon('area_interes')}</div>
            </TableHead>
            <TableHead onClick={() => handleSort('estatus')} className="cursor-pointer hover:bg-muted/50">
              <div className="flex items-center">Estatus {renderSortIcon('estatus')}</div>
            </TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedCandidates.map((candidate) => (
            <TableRow key={candidate.id}>
              <TableCell className="font-medium">{candidate.nombres_apellidos}</TableCell>
              <TableCell className="hidden md:table-cell">{candidate.cedula}</TableCell>
              <TableCell className="hidden lg:table-cell">{candidate.edad || 'N/A'}</TableCell>
              <TableCell className="hidden md:table-cell">{formatEnumValue(candidate.sexo)}</TableCell>
              <TableCell className="hidden lg:table-cell">{candidate.ubicacion}</TableCell>
              <TableCell>{formatEnumValue(candidate.area_interes)}</TableCell>
              <TableCell>
                <Badge variant={candidate.estatus === EstatusCandidato.Contratado ? 'default' : (candidate.estatus === EstatusCandidato.Descartado ? 'destructive' : 'secondary')}>
                  {formatEnumValue(candidate.estatus)}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menú</span>
                      <MoreHorizontalIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onViewDetails(candidate)}>
                      <FileTextIcon className="mr-2 h-4 w-4" /> Ver Detalles
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(candidate)}>
                      <Edit2Icon className="mr-2 h-4 w-4" /> Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onAssessSuitability(candidate)}>
                      <SparklesIcon className="mr-2 h-4 w-4" /> Evaluar Idoneidad (IA)
                    </DropdownMenuItem>
                     {/* If AI summary functionality is ever re-added, this could be useful:
                     <DropdownMenuItem onClick={() => {
                        // Logic for opening summary dialog.
                        // For now, we assume candidate.experiencia_summary might still exist.
                        // You might need a specific handler like openSummaryDialog from HomePage
                     }} disabled={!candidate.experiencia_summary}>
                      <EyeIcon className="mr-2 h-4 w-4" /> Ver Resumen Experiencia (IA)
                    </DropdownMenuItem>
                    */}
                    <DropdownMenuSeparator />
                     <DropdownMenuItem onClick={() => onDelete(candidate.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                      <Trash2Icon className="mr-2 h-4 w-4" /> Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
});
CandidateList.displayName = 'CandidateList';

