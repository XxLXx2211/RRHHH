
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
import type { Candidate } from "@/types";

interface CandidateSummaryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  candidate?: Candidate | null;
}

export const CandidateSummaryDialog = React.memo(function CandidateSummaryDialog({ isOpen, onClose, candidate }: CandidateSummaryDialogProps) {
  if (!candidate || !isOpen) return null; // Also check isOpen here to prevent rendering if not open

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Resumen de Experiencia (IA) - {candidate.nombres_apellidos}</DialogTitle>
          <DialogDescription>
            Este es un resumen generado por IA basado en la experiencia laboral del candidato.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {candidate.experiencia ? (
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{candidate.experiencia}</p>
          ) : (
            <p className="text-sm text-muted-foreground">No hay información de experiencia disponible.</p>
          )}
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
CandidateSummaryDialog.displayName = 'CandidateSummaryDialog';

