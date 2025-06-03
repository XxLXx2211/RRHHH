// SummarizeCandidateExperience.ts
'use server';
/**
 * @fileOverview Summarizes a candidate's work experience to quickly assess their suitability.
 *
 * - summarizeCandidateExperience - A function that summarizes a candidate's experience.
 * - SummarizeCandidateExperienceInput - The input type for the summarizeCandidateExperience function.
 * - SummarizeCandidateExperienceOutput - The return type for the summarizeCandidateExperience function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeCandidateExperienceInputSchema = z.object({
  experiencia: z.string().describe('The candidate\'s work experience description.'),
});
export type SummarizeCandidateExperienceInput = z.infer<typeof SummarizeCandidateExperienceInputSchema>;

const SummarizeCandidateExperienceOutputSchema = z.object({
  summary: z.string().describe('A short summary of the candidate\'s work experience in Spanish.'),
});
export type SummarizeCandidateExperienceOutput = z.infer<typeof SummarizeCandidateExperienceOutputSchema>;

export async function summarizeCandidateExperience(input: SummarizeCandidateExperienceInput): Promise<SummarizeCandidateExperienceOutput> {
  return summarizeCandidateExperienceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeCandidateExperiencePrompt',
  input: {schema: SummarizeCandidateExperienceInputSchema},
  output: {schema: SummarizeCandidateExperienceOutputSchema},
  prompt: `Eres un reclutador experto. Resume la siguiente experiencia laboral del candidato en un párrafo conciso y EN ESPAÑOL, destacando las habilidades y logros más relevantes para que un reclutador evalúe rápidamente su historial:\n\n{{{experiencia}}}`,
});

const summarizeCandidateExperienceFlow = ai.defineFlow(
  {
    name: 'summarizeCandidateExperienceFlow',
    inputSchema: SummarizeCandidateExperienceInputSchema,
    outputSchema: SummarizeCandidateExperienceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("El resumen de la experiencia del candidato no generó una respuesta válida de la IA.");
    }
    return output;
  }
);
