
'use server';
/**
 * @fileOverview Assesses a candidate's suitability using AI, providing an explanation and recommendation in Spanish.
 *
 * - assessCandidateSuitability - Function to assess candidate suitability.
 * - AssessCandidateSuitabilityInput - Input type for the assessment.
 * - AssessCandidateSuitabilityOutput - Output type for the assessment.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define Input Schema
const AssessCandidateSuitabilityInputSchema = z.object({
  nombres_apellidos: z.string().describe("Nombre completo del candidato."),
  edad: z.number().optional().describe("Edad del candidato (opcional)."),
  experiencia: z.string().describe("Descripción de la experiencia laboral del candidato."),
  area_interes: z.string().describe("Área de interés profesional del candidato."),
  expectativa_salarial: z.number().optional().describe("Expectativa salarial del candidato en Dólares USD (opcional). Este dato se provee pero no debe ser un factor principal en la explicación o recomendación generada."),
  ubicacion: z.string().describe("Ubicación general del candidato."),
  estatus_actual: z.string().describe("Estatus actual del candidato en el proceso de selección (ej. 'En Proceso', 'Activo')."),
  // Consider adding more fields like 'educacion' if available and relevant
});
export type AssessCandidateSuitabilityInput = z.infer<typeof AssessCandidateSuitabilityInputSchema>;

// Define Output Schema
const AssessCandidateSuitabilityOutputSchema = z.object({
  esApto: z.boolean().describe("Indica si el candidato es considerado apto (true) o no apto (false) para una oportunidad laboral general o alineada con su perfil."),
  explicacion: z.string().describe("Explicación detallada en español de por qué el candidato es o no es apto, considerando su perfil, experiencia, y área de interés. No se debe mencionar la expectativa salarial en esta explicación."),
  recomendacion: z.string().describe("Recomendación clara en español sobre los próximos pasos a seguir con este candidato (ej. 'Considerar para entrevista técnica', 'Agendar una primera entrevista', 'Archivar para futuras oportunidades en el área de X', 'No adecuado para las necesidades actuales'). No se debe basar la recomendación en la expectativa salarial."),
});
export type AssessCandidateSuitabilityOutput = z.infer<typeof AssessCandidateSuitabilityOutputSchema>;

// Exported wrapper function
export async function assessCandidateSuitability(input: AssessCandidateSuitabilityInput): Promise<AssessCandidateSuitabilityOutput> {
  return assessCandidateSuitabilityFlow(input);
}

// Define Genkit Prompt
const prompt = ai.definePrompt({
  name: 'assessCandidateSuitabilityPrompt',
  input: { schema: AssessCandidateSuitabilityInputSchema },
  output: { schema: AssessCandidateSuitabilityOutputSchema },
  prompt: `Eres un especialista experto en Recursos Humanos y reclutamiento. Tu tarea es evaluar la idoneidad de un candidato basándote en la información proporcionada. Debes responder COMPLETAMENTE EN ESPAÑOL.

Información del Candidato:
- Nombre: {{{nombres_apellidos}}}
{{#if edad}}- Edad: {{{edad}}} años{{/if}}
- Experiencia Laboral: {{{experiencia}}}
- Área de Interés: {{{area_interes}}}
- Ubicación: {{{ubicacion}}}
- Estatus Actual en Proceso: {{{estatus_actual}}}
{{#if expectativa_salarial}}
(Nota: El candidato ha indicado una expectativa salarial de {{{expectativa_salarial}}} USD, pero NO debes mencionar ni basar tu explicación o recomendación en este dato.)
{{/if}}

Por favor, evalúa al candidato y proporciona la siguiente información en el formato JSON especificado:
1.  **esApto**: Un valor booleano (true/false) indicando si consideras al candidato apto para una oportunidad laboral generalista o una que se alinee con su área de interés y experiencia.
2.  **explicacion**: Una explicación detallada y concisa (2-3 frases) de tu evaluación. Considera únicamente su experiencia, habilidades y área de interés, y cómo estos factores se alinean con posibles roles. Si la edad es particularmente relevante para tu evaluación, menciónala. NO menciones la expectativa salarial. Justifica tu decisión de apto/no apto.
3.  **recomendacion**: Una recomendación clara y accionable sobre los próximos pasos a seguir con este candidato, basada en su perfil profesional y experiencia. NO bases tu recomendación en la expectativa salarial. Por ejemplo: "Agendar entrevista inicial para explorar afinidad cultural.", "Revisar portafolio y considerar para prueba técnica.", "Archivar para futuras vacantes en el área de {{{area_interes}}}.", "No parece encajar con los perfiles buscados actualmente, considerar reevaluar si surgen roles administrativos."

Asegúrate de que TODA tu respuesta esté en español y siga la estructura JSON requerida por el esquema de salida. NO incluyas ninguna referencia a la expectativa salarial en los campos 'explicacion' o 'recomendacion'.
`,
});

// Define Genkit Flow
const assessCandidateSuitabilityFlow = ai.defineFlow(
  {
    name: 'assessCandidateSuitabilityFlow',
    inputSchema: AssessCandidateSuitabilityInputSchema,
    outputSchema: AssessCandidateSuitabilityOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error("La evaluación de idoneidad del candidato no generó una respuesta válida de la IA.");
    }
    return output;
  }
);

