
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
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import type { AssessCandidateSuitabilityOutput } from "@/ai/flows/assess-candidate-suitability";

interface CandidateAssessmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName?: string | null;
  assessment?: AssessCandidateSuitabilityOutput | null;
  isLoading: boolean;
}

export const CandidateAssessmentDialog = React.memo(function CandidateAssessmentDialog({ 
  isOpen, 
  onClose, 
  candidateName, 
  assessment,
  isLoading 
}: CandidateAssessmentDialogProps) {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Evaluación de Idoneidad (IA)</DialogTitle>
          <DialogDescription>
            {candidateName ? `Análisis para ${candidateName}` : 'Analizando candidato...'}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          {isLoading && (
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-muted-foreground">Evaluando con IA...</p>
            </div>
          )}
          {!isLoading && assessment && (
            <>
              <div>
                <h3 className="font-semibold mb-1">Resultado:</h3>
                <Badge variant={assessment.esApto ? "default" : "destructive"}>
                  {assessment.esApto ? "Apto" : "No Apto"}
                </Badge>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Explicación:</h3>
                <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">{assessment.explicacion}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Recomendación:</h3>
                <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">{assessment.recomendacion}</p>
              </div>
            </>
          )}
          {!isLoading && !assessment && (
             <p className="text-sm text-destructive text-center">No se pudo obtener la evaluación.</p>
          )}
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
CandidateAssessmentDialog.displayName = 'CandidateAssessmentDialog';

    