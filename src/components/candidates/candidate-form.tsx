
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CandidateFormValues, candidateFormSchema } from '@/lib/zod-schemas';
import type { CandidateFormData } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { UBICACIONES_VENEZUELA, getUbicacionesPrincipales, getZonasByUbicacion } from '@/lib/locations';
import { SEXO_OPTIONS, CANAL_RECEPCION_OPTIONS, TIPO_CONTACTO_OPTIONS, ESTATUS_CANDIDATO_OPTIONS, AREA_INTERES_OPTIONS } from '@/lib/constants';

interface CandidateFormProps {
  onSubmit: (data: CandidateFormValues) => void;
  initialData?: CandidateFormData | null;
  isSubmitting?: boolean;
}

export function CandidateForm({ onSubmit, initialData, isSubmitting }: CandidateFormProps) {
  const form = useForm<CandidateFormValues>({
    resolver: zodResolver(candidateFormSchema),
    defaultValues: (initialData ? {
      ...initialData,
      edad: initialData.edad ?? undefined,
      num_hijos: initialData.num_hijos ?? undefined,
      expectativa_salarial: initialData.expectativa_salarial ?? undefined,
      fuente: initialData.fuente ?? undefined,
      referido: initialData.referido ?? undefined,
      fecha_entrevista: initialData.fecha_entrevista ?? undefined,
      entrevistador_telefonico: initialData.entrevistador_telefonico ?? undefined,
      entrevistador_presencial: initialData.entrevistador_presencial ?? undefined,
      cuenta_bancaria: initialData.cuenta_bancaria ?? undefined,
      seguridad_bancaria: initialData.seguridad_bancaria ?? undefined,
      pds_asignado: initialData.pds_asignado ?? undefined,
      comentarios: initialData.comentarios ?? undefined,
    } : {
      nombres_apellidos: '',
      cedula: '',
      telefonos: '',
      direccion: '',
      experiencia: '',
      citado_entrevista: false,
      solicitud_empleo: false,
      guia_entrevista: false,
      fecha_contacto: new Date(),
      sexo: undefined,
      canal_recepcion: undefined,
      tipo_contacto: undefined,
      area_interes: undefined,
      estatus: undefined,
      ubicacion: '',
      zona_reside: '',
    }),
  });

  const [selectedUbicacion, setSelectedUbicacion] = useState<string>(initialData?.ubicacion || '');
  const [zonasOptions, setZonasOptions] = useState<string[]>(initialData?.ubicacion ? getZonasByUbicacion(initialData.ubicacion) : []);

  useEffect(() => {
    if (initialData) {
      const resetData = {
        ...initialData,
        fecha_contacto: initialData.fecha_contacto ? new Date(initialData.fecha_contacto) : new Date(),
        fecha_entrevista: initialData.fecha_entrevista ? new Date(initialData.fecha_entrevista) : null,
        edad: initialData.edad ?? undefined,
        num_hijos: initialData.num_hijos ?? undefined,
        expectativa_salarial: initialData.expectativa_salarial ?? undefined,
      };

      form.reset(resetData as CandidateFormValues);
      setSelectedUbicacion(initialData.ubicacion || '');
      setZonasOptions(getZonasByUbicacion(initialData.ubicacion || ''));
    } else {
      form.reset({
        nombres_apellidos: '',
        cedula: '',
        telefonos: '',
        direccion: '',
        experiencia: '',
        citado_entrevista: false,
        solicitud_empleo: false,
        guia_entrevista: false,
        fecha_contacto: new Date(),
        sexo: undefined,
        canal_recepcion: undefined,
        tipo_contacto: undefined,
        area_interes: undefined,
        estatus: undefined,
        ubicacion: '',
        zona_reside: '',
        edad: undefined,
        num_hijos: undefined,
        fuente: '',
        referido: '',
        fecha_entrevista: null,
        entrevistador_telefonico: '',
        entrevistador_presencial: '',
        expectativa_salarial: undefined,
        cuenta_bancaria: '',
        seguridad_bancaria: '',
        pds_asignado: '',
        comentarios: '',
      });
      setSelectedUbicacion('');
      setZonasOptions([]);
    }
  }, [initialData, form]);

  const handleUbicacionChange = (value: string) => {
    setSelectedUbicacion(value);
    form.setValue('ubicacion', value);
    const newZonas = getZonasByUbicacion(value);
    setZonasOptions(newZonas);
    if (newZonas.length > 0) {
      form.setValue('zona_reside', '');
    } else {
      form.setValue('zona_reside', 'N/A');
    }
  };

  const onFormSubmit = (data: CandidateFormValues) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
        <Accordion type="multiple" defaultValue={['personal', 'contacto', 'ubicacion', 'profesional', 'estatus']} className="w-full">
          {/* Información Personal */}
          <AccordionItem value="personal" className="border bg-card rounded-lg shadow-lg mb-4">
            <AccordionTrigger className="w-full flex flex-1 items-center justify-between px-6 py-5 text-lg font-semibold hover:bg-muted/50 transition-colors data-[state=open]:border-b [&[data-state=open]>svg]:rotate-180 rounded-t-lg data-[state=open]:rounded-b-none">
              Información Personal
            </AccordionTrigger>
            <AccordionContent className="space-y-6 p-6">
              <FormField control={form.control} name="nombres_apellidos" render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombres y Apellidos</FormLabel>
                  <FormControl><Input placeholder="Ej: Ana María Pérez López" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="cedula" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cédula</FormLabel>
                    <FormControl><Input placeholder="Ej: 12345678" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="sexo" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sexo</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ''}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Seleccione sexo" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {SEXO_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="edad" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Edad</FormLabel>
                    <FormControl><Input type="number" placeholder="Ej: 28" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} value={field.value ?? ''} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="num_hijos" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Hijos</FormLabel>
                    <FormControl><Input type="number" placeholder="Ej: 2" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} value={field.value ?? ''} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Información de Contacto */}
          <AccordionItem value="contacto" className="border bg-card rounded-lg shadow-lg mb-4">
            <AccordionTrigger className="w-full flex flex-1 items-center justify-between px-6 py-5 text-lg font-semibold hover:bg-muted/50 transition-colors data-[state=open]:border-b [&[data-state=open]>svg]:rotate-180 rounded-t-lg data-[state=open]:rounded-b-none">
            Información de Contacto
            </AccordionTrigger>
            <AccordionContent className="space-y-6 p-6">
              <FormField control={form.control} name="telefonos" render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfonos</FormLabel>
                  <FormControl><Input placeholder="Ej: 0412-1234567, 0212-9876543" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField control={form.control} name="canal_recepcion" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Canal de Recepción</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ''}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Seleccione canal" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {CANAL_RECEPCION_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="fuente" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fuente (si aplica)</FormLabel>
                    <FormControl><Input placeholder="Ej: Computrabajo, LinkedIn" {...field} value={field.value ?? ''} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={form.control} name="referido" render={({ field }) => (
                <FormItem>
                  <FormLabel>Referido por (si aplica)</FormLabel>
                  <FormControl><Input placeholder="Nombre de quien refiere" {...field} value={field.value ?? ''} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="tipo_contacto" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Contacto Inicial</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ''}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Seleccione tipo" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {TIPO_CONTACTO_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="fecha_contacto" render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha de Contacto Inicial</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                            {field.value ? format(new Date(field.value), "PPP", { locale: es }) : <span>Seleccione fecha</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value ? new Date(field.value) : undefined} onSelect={(date) => field.onChange(date || null)} initialFocus locale={es} />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Proceso de Entrevista */}
          <AccordionItem value="entrevista" className="border bg-card rounded-lg shadow-lg mb-4">
            <AccordionTrigger className="w-full flex flex-1 items-center justify-between px-6 py-5 text-lg font-semibold hover:bg-muted/50 transition-colors data-[state=open]:border-b [&[data-state=open]>svg]:rotate-180 rounded-t-lg data-[state=open]:rounded-b-none">
              Proceso de Entrevista
            </AccordionTrigger>
            <AccordionContent className="space-y-6 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <FormField control={form.control} name="citado_entrevista" render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3 shadow-sm">
                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    <FormLabel className="font-normal">¿Citado a Entrevista?</FormLabel>
                  </FormItem>
                )} />
                {form.watch('citado_entrevista') && (
                  <FormField control={form.control} name="fecha_entrevista" render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Fecha de Entrevista</FormLabel>
                       <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                              {field.value ? format(new Date(field.value), "PPP", { locale: es }) : <span>Seleccione fecha</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={field.value ? new Date(field.value) : undefined} onSelect={(date) => field.onChange(date || null)} initialFocus locale={es} />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )} />
                )}
              </div>
              <FormField control={form.control} name="entrevistador_telefonico" render={({ field }) => (
                <FormItem>
                  <FormLabel>Entrevistador Telefónico</FormLabel>
                  <FormControl><Input placeholder="Nombre del entrevistador" {...field} value={field.value ?? ''} /></FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name="entrevistador_presencial" render={({ field }) => (
                <FormItem>
                  <FormLabel>Entrevistador Presencial</FormLabel>
                  <FormControl><Input placeholder="Nombre del entrevistador" {...field} value={field.value ?? ''} /></FormControl>
                </FormItem>
              )} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="solicitud_empleo" render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3 shadow-sm">
                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    <FormLabel className="font-normal">¿Entregó Solicitud de Empleo?</FormLabel>
                  </FormItem>
                )} />
                <FormField control={form.control} name="guia_entrevista" render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3 shadow-sm">
                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    <FormLabel className="font-normal">¿Se usó Guía de Entrevista?</FormLabel>
                  </FormItem>
                )} />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Información de Ubicación */}
          <AccordionItem value="ubicacion" className="border bg-card rounded-lg shadow-lg mb-4">
            <AccordionTrigger className="w-full flex flex-1 items-center justify-between px-6 py-5 text-lg font-semibold hover:bg-muted/50 transition-colors data-[state=open]:border-b [&[data-state=open]>svg]:rotate-180 rounded-t-lg data-[state=open]:rounded-b-none">
            Información de Ubicación
            </AccordionTrigger>
            <AccordionContent className="space-y-6 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="ubicacion" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ubicación General</FormLabel>
                    <Select onValueChange={handleUbicacionChange} value={field.value || ''}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Seleccione ubicación" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {getUbicacionesPrincipales().map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="zona_reside" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zona Donde Reside</FormLabel>
                    {selectedUbicacion === "Otro" || (UBICACIONES_VENEZUELA[selectedUbicacion]?.includes("Otro") && field.value === "Otro") || zonasOptions.length === 0 ? (
                      <FormControl><Input placeholder="Especifique zona" {...field} value={field.value ?? ''} /></FormControl>
                    ) : (
                      <Select onValueChange={field.onChange} value={field.value || ''} disabled={!selectedUbicacion || zonasOptions.length === 0}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Seleccione zona" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {zonasOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    )}
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={form.control} name="direccion" render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección Detallada</FormLabel>
                  <FormControl><Textarea placeholder="Dirección completa del candidato" {...field} value={field.value ?? ''} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </AccordionContent>
          </AccordionItem>

          {/* Información Profesional */}
          <AccordionItem value="profesional" className="border bg-card rounded-lg shadow-lg mb-4">
            <AccordionTrigger className="w-full flex flex-1 items-center justify-between px-6 py-5 text-lg font-semibold hover:bg-muted/50 transition-colors data-[state=open]:border-b [&[data-state=open]>svg]:rotate-180 rounded-t-lg data-[state=open]:rounded-b-none">
            Información Profesional
            </AccordionTrigger>
            <AccordionContent className="space-y-6 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="area_interes" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Área de Interés Profesional</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ''}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Seleccione área" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {AREA_INTERES_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="expectativa_salarial" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expectativa Salarial (Dólares USD, Opcional)</FormLabel>
                    <FormControl><Input type="number" placeholder="Ej: 500" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} value={field.value ?? ''} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={form.control} name="experiencia" render={({ field }) => (
                <FormItem>
                  <FormLabel>Experiencia Laboral</FormLabel>
                  <FormControl><Textarea placeholder="Describa la experiencia laboral del candidato" {...field} rows={6} value={field.value ?? ''}/></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </AccordionContent>
          </AccordionItem>

          {/* Información Bancaria */}
          <AccordionItem value="bancaria" className="border bg-card rounded-lg shadow-lg mb-4">
            <AccordionTrigger className="w-full flex flex-1 items-center justify-between px-6 py-5 text-lg font-semibold hover:bg-muted/50 transition-colors data-[state=open]:border-b [&[data-state=open]>svg]:rotate-180 rounded-t-lg data-[state=open]:rounded-b-none">
            Información Bancaria (Opcional)
            </AccordionTrigger>
            <AccordionContent className="space-y-6 p-6">
              <FormField control={form.control} name="cuenta_bancaria" render={({ field }) => (
                <FormItem>
                  <FormLabel>Cuenta Bancaria</FormLabel>
                  <FormControl><Input placeholder="Número de cuenta" {...field} value={field.value ?? ''} /></FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name="seguridad_bancaria" render={({ field }) => (
                <FormItem>
                  <FormLabel>Información de Seguridad Bancaria</FormLabel>
                  <FormControl><Input placeholder="Información adicional" {...field} value={field.value ?? ''} /></FormControl>
                  <FormDescription>Maneje esta información con cuidado.</FormDescription>
                </FormItem>
              )} />
            </AccordionContent>
          </AccordionItem>

          {/* Seguimiento y Estatus */}
          <AccordionItem value="estatus" className="border bg-card rounded-lg shadow-lg mb-4">
            <AccordionTrigger className="w-full flex flex-1 items-center justify-between px-6 py-5 text-lg font-semibold hover:bg-muted/50 transition-colors data-[state=open]:border-b [&[data-state=open]>svg]:rotate-180 rounded-t-lg data-[state=open]:rounded-b-none">
            Seguimiento y Estatus
            </AccordionTrigger>
            <AccordionContent className="space-y-6 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="estatus" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estatus del Candidato</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ''}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Seleccione estatus" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {ESTATUS_CANDIDATO_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="pds_asignado" render={({ field }) => (
                  <FormItem>
                    <FormLabel>PDS Asignado (si aplica)</FormLabel>
                    <FormControl><Input placeholder="Punto de servicio" {...field} value={field.value ?? ''} /></FormControl>
                  </FormItem>
                )} />
              </div>
              <FormField control={form.control} name="comentarios" render={({ field }) => (
                <FormItem>
                  <FormLabel>Comentarios Adicionales</FormLabel>
                  <FormControl><Textarea placeholder="Notas sobre el candidato" {...field} value={field.value ?? ''} /></FormControl>
                </FormItem>
              )} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isSubmitting ? 'Guardando...' : (initialData ? 'Actualizar Candidato' : 'Agregar Candidato')}
        </Button>
      </form>
    </Form>
  );
}

