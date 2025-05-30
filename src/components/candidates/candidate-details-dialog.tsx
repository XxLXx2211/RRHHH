
"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { Candidate } from "@/types";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface CandidateDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  candidate?: Candidate | null;
}

const DetailItem: React.FC<{ label: string; value?: string | number | boolean | Date | null }> = ({ label, value }) => {
  // Hide the item if value is undefined, null, or an empty/whitespace string.
  // Boolean 'false' should still be shown.
  if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
    return null;
  }

  let displayValue: string | React.ReactNode;
  if (typeof value === 'boolean') {
    displayValue = value ? 'Sí' : 'No';
  } else if (value instanceof Date) {
    displayValue = format(value, 'PPP', { locale: es });
  } else {
    displayValue = String(value); // Handles numbers and non-empty strings
  }

  return (
    <div className="grid grid-cols-3 gap-2 py-1.5">
      <dt className="text-sm font-medium text-muted-foreground col-span-1">{label}:</dt>
      <dd className="text-sm text-foreground col-span-2">{displayValue}</dd>
    </div>
  );
};

export const CandidateDetailsDialog = React.memo(function CandidateDetailsDialog({ isOpen, onClose, candidate }: CandidateDetailsDialogProps) {
  if (!candidate || !isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Detalles del Candidato - {candidate.nombres_apellidos}</DialogTitle>
          <DialogDescription>
            Información completa registrada para este candidato.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[65vh] p-1 pr-4">
          <div className="space-y-4 py-4">
            
            <section>
              <h3 className="text-lg font-semibold mb-2 text-primary">Información Personal</h3>
              <dl className="space-y-1">
                <DetailItem label="Nombres y Apellidos" value={candidate.nombres_apellidos} />
                <DetailItem label="Cédula" value={candidate.cedula} />
                <DetailItem label="Sexo" value={candidate.sexo} />
                <DetailItem label="Edad" value={candidate.edad} />
                <DetailItem label="Número de Hijos" value={candidate.num_hijos} />
              </dl>
            </section>
            <Separator />
            <section>
              <h3 className="text-lg font-semibold mb-2 text-primary">Información de Contacto</h3>
              <dl className="space-y-1">
                <DetailItem label="Teléfonos" value={candidate.telefonos} />
                <DetailItem label="Canal de Recepción" value={candidate.canal_recepcion} />
                <DetailItem label="Fuente" value={candidate.fuente} />
                <DetailItem label="Referido por" value={candidate.referido} />
                <DetailItem label="Tipo de Contacto Inicial" value={candidate.tipo_contacto} />
                <DetailItem label="Fecha de Contacto Inicial" value={candidate.fecha_contacto} />
              </dl>
            </section>
            <Separator />
            <section>
              <h3 className="text-lg font-semibold mb-2 text-primary">Proceso de Entrevista</h3>
              <dl className="space-y-1">
                <DetailItem label="¿Citado a Entrevista?" value={candidate.citado_entrevista} />
                <DetailItem label="Fecha de Entrevista" value={candidate.fecha_entrevista} />
                <DetailItem label="Entrevistador Telefónico" value={candidate.entrevistador_telefonico} />
                <DetailItem label="Entrevistador Presencial" value={candidate.entrevistador_presencial} />
                <DetailItem label="¿Entregó Solicitud de Empleo?" value={candidate.solicitud_empleo} />
                <DetailItem label="¿Se usó Guía de Entrevista?" value={candidate.guia_entrevista} />
              </dl>
            </section>
            <Separator />
            <section>
              <h3 className="text-lg font-semibold mb-2 text-primary">Información de Ubicación</h3>
              <dl className="space-y-1">
                <DetailItem label="Ubicación General" value={candidate.ubicacion} />
                <DetailItem label="Zona Donde Reside" value={candidate.zona_reside} />
                <DetailItem label="Dirección Detallada" value={candidate.direccion} />
              </dl>
            </section>
            <Separator />
            <section>
              <h3 className="text-lg font-semibold mb-2 text-primary">Información Profesional</h3>
              <dl className="space-y-1">
                <DetailItem label="Área de Interés" value={candidate.area_interes} />
                <DetailItem label="Expectativa Salarial (USD)" value={candidate.expectativa_salarial} />
                {candidate.experiencia && candidate.experiencia.trim() !== '' && (
                  <div className="grid grid-cols-3 gap-2 py-1.5">
                      <dt className="text-sm font-medium text-muted-foreground col-span-1">Experiencia:</dt>
                      <dd className="text-sm text-foreground col-span-2 whitespace-pre-wrap">{candidate.experiencia}</dd>
                  </div>
                )}
              </dl>
            </section>
            <Separator />
            <section>
              <h3 className="text-lg font-semibold mb-2 text-primary">Información Bancaria</h3>
              <dl className="space-y-1">
                <DetailItem label="Cuenta Bancaria" value={candidate.cuenta_bancaria} />
                <DetailItem label="Seguridad Bancaria" value={candidate.seguridad_bancaria} />
              </dl>
            </section>
            <Separator />
            <section>
              <h3 className="text-lg font-semibold mb-2 text-primary">Seguimiento y Estatus</h3>
              <dl className="space-y-1">
                <DetailItem label="Estatus del Candidato" value={candidate.estatus} />
                <DetailItem label="PDS Asignado" value={candidate.pds_asignado} />
                {candidate.comentarios && candidate.comentarios.trim() !== '' && (
                   <div className="grid grid-cols-3 gap-2 py-1.5">
                      <dt className="text-sm font-medium text-muted-foreground col-span-1">Comentarios:</dt>
                      <dd className="text-sm text-foreground col-span-2 whitespace-pre-wrap">{candidate.comentarios}</dd>
                  </div>
                )}
              </dl>
            </section>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
CandidateDetailsDialog.displayName = 'CandidateDetailsDialog';

    