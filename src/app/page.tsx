
"use client";

import React, { useState, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import type { Candidate, CandidateFormData } from '@/types';
import { CandidateFilters, FiltersState } from '@/components/candidates/candidate-filters';
import { CandidateList } from '@/components/candidates/candidate-list';
import { AppHeader } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { PlusCircleIcon, Loader2 } from 'lucide-react';
import { assessCandidateSuitability, AssessCandidateSuitabilityInput, AssessCandidateSuitabilityOutput } from '@/ai/flows/assess-candidate-suitability';
import { PaginationControls } from '@/components/ui/pagination-controls';
import { useCandidates, useCreateCandidate, useUpdateCandidate, useDeleteCandidate } from '@/hooks/use-candidates';
import { normalizeFiltersForApi } from '@/lib/enum-utils';
import { mapCandidateToFormData } from '@/lib/candidate-form-utils';

const DynamicCandidateForm = dynamic(() => import('@/components/candidates/candidate-form').then(mod => mod.CandidateForm), {
  loading: () => <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /> <p className="ml-2">Cargando formulario...</p></div>,
  ssr: false
});

const DynamicCandidateAssessmentDialog = dynamic(() => import('@/components/candidates/candidate-assessment-dialog').then(mod => mod.CandidateAssessmentDialog), {
  loading: () => <p>Cargando evaluación...</p>,
  ssr: false
});
const DynamicCandidateDetailsDialog = dynamic(() => import('@/components/candidates/candidate-details-dialog').then(mod => mod.CandidateDetailsDialog), {
  loading: () => <p>Cargando detalles...</p>,
  ssr: false
});


const INITIAL_FILTERS: FiltersState = {
  searchInput: '',
  sexo: 'Todos',
  edad: 'Todos',
  estatus: 'Todos',
  ubicacion: 'Todas',
  zona: 'Todas',
  area: 'Todos',
};

const ITEMS_PER_PAGE = 10;


export default function HomePage() {
  // Estados para UI
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [candidateForDetails, setCandidateForDetails] = useState<Candidate | null>(null);
  const [isAssessmentDialogOpen, setIsAssessmentDialogOpen] = useState(false);
  const [candidateForAssessment, setCandidateForAssessment] = useState<Candidate | null>(null);
  const [assessmentResult, setAssessmentResult] = useState<AssessCandidateSuitabilityOutput | null>(null);
  const [isAssessingCandidate, setIsAssessingCandidate] = useState(false);
  const [filters, setFilters] = useState<FiltersState>(INITIAL_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);

  const { toast } = useToast();



  // Mapear filtros del frontend al formato que espera el backend
  const apiFilters = useMemo(() => {
    const mapped: Record<string, any> = {};

    // Búsqueda general
    if (filters.searchInput && filters.searchInput.trim()) {
      mapped.search = filters.searchInput.trim();
    }

    // Filtros de select
    if (filters.sexo && filters.sexo !== 'Todos') {
      mapped.sexo = filters.sexo;
    }

    if (filters.estatus && filters.estatus !== 'Todos') {
      mapped.estatus = filters.estatus;
    }

    if (filters.ubicacion && filters.ubicacion !== 'Todas') {
      mapped.ubicacion = filters.ubicacion;
    }

    if (filters.area && filters.area !== 'Todos') {
      mapped.area_interes = filters.area;
    }

    if (filters.zona && filters.zona !== 'Todas') {
      mapped.zona = filters.zona;
    }

    // Debug logging para ver qué filtros se están enviando
    console.log('[Frontend] Sending filters to API (before normalization):', mapped);
    console.log('[Frontend] Original filters state:', filters);

    // Normalizar los filtros de enum para asegurar compatibilidad con la base de datos
    const normalizedMapped = normalizeFiltersForApi(mapped);
    console.log('[Frontend] Sending filters to API (after normalization):', normalizedMapped);

    // Filtro de edad - convertir rango a min/max
    if (filters.edad && filters.edad !== 'Todos') {
      switch (filters.edad) {
        case '18-25':
          normalizedMapped.edad_min = 18;
          normalizedMapped.edad_max = 25;
          break;
        case '26-30':
          normalizedMapped.edad_min = 26;
          normalizedMapped.edad_max = 30;
          break;
        case '31-35':
          normalizedMapped.edad_min = 31;
          normalizedMapped.edad_max = 35;
          break;
        case '36-40':
          normalizedMapped.edad_min = 36;
          normalizedMapped.edad_max = 40;
          break;
        case '41-50':
          normalizedMapped.edad_min = 41;
          normalizedMapped.edad_max = 50;
          break;
        case '51+':
          normalizedMapped.edad_min = 51;
          break;
      }
    }

    return normalizedMapped;
  }, [
    filters.searchInput,
    filters.sexo,
    filters.estatus,
    filters.ubicacion,
    filters.area,
    filters.zona,
    filters.edad
  ]);

  // Hooks para base de datos
  const { data: candidates = [], isLoading, error } = useCandidates(apiFilters);
  const createCandidateMutation = useCreateCandidate();
  const updateCandidateMutation = useUpdateCandidate();
  const deleteCandidateMutation = useDeleteCandidate();

  const handleAddCandidate = useCallback(async (data: CandidateFormData) => {
    try {
      await createCandidateMutation.mutateAsync(data);
      setIsFormOpen(false);
      setCurrentPage(1);
    } catch (error) {
      // El error ya se maneja en el hook
    }
  }, [createCandidateMutation]);

  const handleUpdateCandidate = useCallback(async (data: CandidateFormData) => {
    if (!editingCandidate) return;
    try {
      await updateCandidateMutation.mutateAsync({
        id: editingCandidate.id,
        data
      });
      setIsFormOpen(false);
      setEditingCandidate(null);
    } catch (error) {
      // El error ya se maneja en el hook
    }
  }, [editingCandidate, updateCandidateMutation]);

  const handleDeleteCandidate = useCallback(async (candidateId: string) => {
    if (window.confirm("¿Está seguro de que desea eliminar este candidato?")) {
      try {
        await deleteCandidateMutation.mutateAsync(candidateId);
        // Ajustar página si es necesario
        const newTotalPages = Math.max(1, Math.ceil((candidates.length - 1) / ITEMS_PER_PAGE));
        if (currentPage > newTotalPages) {
          setCurrentPage(newTotalPages);
        }
      } catch (error) {
        // El error ya se maneja en el hook
      }
    }
  }, [deleteCandidateMutation, candidates.length, currentPage]);

  const openFormForEdit = useCallback((candidate: Candidate) => {
    setEditingCandidate(candidate);
    setIsFormOpen(true);
  }, []);

  const openFormForAdd = useCallback(() => {
    setEditingCandidate(null);
    setIsFormOpen(true);
  }, []);

  const openDetailsDialog = useCallback((candidate: Candidate) => {
    setCandidateForDetails(candidate);
    setIsDetailsDialogOpen(true);
  }, []);

  const handleAssessSuitability = useCallback(async (candidate: Candidate) => {
    setCandidateForAssessment(candidate);
    setIsAssessmentDialogOpen(true);
    setIsAssessingCandidate(true);
    setAssessmentResult(null);

    try {
      const input: AssessCandidateSuitabilityInput = {
        nombres_apellidos: candidate.nombres_apellidos,
        edad: candidate.edad || undefined,
        experiencia: candidate.experiencia,
        area_interes: candidate.area_interes,
        expectativa_salarial: candidate.expectativa_salarial || undefined,
        ubicacion: candidate.ubicacion,
        estatus_actual: candidate.estatus,
      };
      const result = await assessCandidateSuitability(input);
      setAssessmentResult(result);
    } catch (error) {
      console.error("Error assessing candidate suitability:", error);
      toast({
        title: "Error de Evaluación IA",
        description: "No se pudo obtener la evaluación de idoneidad del candidato.",
        variant: "destructive",
      });
      setAssessmentResult(null);
    } finally {
      setIsAssessingCandidate(false);
    }
  }, [toast]);

  const handleFilterChange = useCallback((newFilters: FiltersState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  // Verificar si hay filtros activos
  const hasActiveFilters = useMemo(() => {
    return Object.entries(filters).some(([key, value]) => {
      if (key === 'searchInput') return value && value.trim() !== '';
      return value && value !== 'Todos' && value !== 'Todas';
    });
  }, [filters]);

  // Los filtros ahora se aplican en el servidor a través del hook useCandidates
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(candidates.length / ITEMS_PER_PAGE));
  }, [candidates.length]);

  const paginatedCandidates = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return candidates.slice(startIndex, endIndex);
  }, [candidates, currentPage]);


  const candidateFormData = useMemo((): CandidateFormData | null => {
    if (!editingCandidate) return null;
    console.log('[Page] Editing candidate data:', editingCandidate);
    const formData = mapCandidateToFormData(editingCandidate);
    console.log('[Page] Mapped form data being passed:', formData);
    return formData;
  }, [editingCandidate]);

  // Mostrar estado de carga
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <AppHeader />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2">Cargando candidatos...</p>
          </div>
        </main>
      </div>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <AppHeader />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <p className="text-red-500 mb-4">Error al cargar candidatos</p>
              <Button onClick={() => window.location.reload()}>
                Reintentar
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Gestión de Candidatos</h1>
          <Button onClick={openFormForAdd} size="lg">
            <PlusCircleIcon className="mr-2 h-5 w-5" />
            Agregar Candidato
          </Button>
        </div>

        <CandidateFilters onFilterChange={handleFilterChange} initialFilters={INITIAL_FILTERS} currentFilters={filters} />

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2 text-muted-foreground">Cargando candidatos...</p>
          </div>
        ) : error ? (
          <div className="text-center text-destructive py-12">
            <p className="text-lg font-medium mb-2">Error al cargar candidatos</p>
            <p className="text-sm">{error.message}</p>
          </div>
        ) : (
          <CandidateList
            candidates={paginatedCandidates}
            onEdit={openFormForEdit}
            onViewDetails={openDetailsDialog}
            onAssessSuitability={handleAssessSuitability}
            onDelete={handleDeleteCandidate}
            hasActiveFilters={hasActiveFilters}
          />
        )}

        {candidates.length > 0 && (
           <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={ITEMS_PER_PAGE}
            totalItems={candidates.length}
          />
        )}
      </main>

      <Dialog open={isFormOpen} onOpenChange={(open) => { if(!open) { setIsFormOpen(false); setEditingCandidate(null); } else { setIsFormOpen(true); }}}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCandidate ? 'Editar Candidato' : 'Agregar Nuevo Candidato'}</DialogTitle>
            <DialogDescription>
              {editingCandidate ? 'Modifique los datos del candidato.' : 'Complete el formulario para agregar un nuevo candidato.'}
            </DialogDescription>
          </DialogHeader>
          {isFormOpen && (
            <DynamicCandidateForm
              onSubmit={editingCandidate ? handleUpdateCandidate : handleAddCandidate}
              initialData={candidateFormData}
              isSubmitting={createCandidateMutation.isPending || updateCandidateMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {isDetailsDialogOpen && (
        <DynamicCandidateDetailsDialog
          isOpen={isDetailsDialogOpen}
          onClose={() => {
            setIsDetailsDialogOpen(false);
            setCandidateForDetails(null);
          }}
          candidate={candidateForDetails}
        />
      )}

      {isAssessmentDialogOpen && (
        <DynamicCandidateAssessmentDialog
          isOpen={isAssessmentDialogOpen}
          onClose={() => {
            setIsAssessmentDialogOpen(false);
            setCandidateForAssessment(null);
            setAssessmentResult(null);
          }}
          candidateName={candidateForAssessment?.nombres_apellidos}
          assessment={assessmentResult}
          isLoading={isAssessingCandidate}
        />
      )}
    </div>
  );
}
