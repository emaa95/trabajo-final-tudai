import { z } from "zod";

import {
  ESTADOS_TRABAJO,
  PRIORIDADES_TRABAJO,
  TIPOS_TRABAJO,
  TRABAJOS_SOLICITADOS,
} from "@/types";


export const tareaTrabajoSchema = z.object({
  titulo: z
    .string()
    .trim()
    .min(1, "Ingrese el nombre de la tarea"),

  costo: z
    .number()
    .min(0, "El costo no puede ser negativo"),

  realizada: z
    .boolean()
    .default(false),
});


export const seguroTrabajoSchema = z.object({

  aseguradora_id: z
    .string()
    .optional(),

  numero_poliza: z
    .string()
    .trim()
    .optional(),

  numero_denuncia: z
    .string()
    .trim()
    .optional(),

  numero_siniestro: z
    .string()
    .trim()
    .optional(),

  monto_aprobado: z.preprocess(
    (value) => {
      if (
        value === "" ||
        value === null ||
        value === undefined
      ) {
        return undefined;
      }

      return Number(value);
    },
    z.number()
      .min(
        0,
        "El monto aprobado no puede ser negativo"
      )
      .optional()
  ),

});


export const trabajoSchema = z
  .object({

    cliente_id: z
      .string()
      .min(
        1,
        "Debe seleccionar un cliente"
      ),

    vehiculo_id: z
      .string()
      .min(
        1,
        "Debe seleccionar un vehículo"
      ),


    tipo: z.enum(TIPOS_TRABAJO),


    estado: z
      .enum(ESTADOS_TRABAJO)
      .default("Pendiente"),


    prioridad: z
      .enum(PRIORIDADES_TRABAJO)
      .default("Baja"),


    fecha_ingreso: z
      .string()
      .min(
        1,
        "Seleccione una fecha"
      ),


    trabajos_solicitados: z
      .array(
        z.enum(TRABAJOS_SOLICITADOS)
      )
      .min(
        1,
        "Seleccione al menos un trabajo solicitado"
      ),


    tareas: z
      .array(tareaTrabajoSchema)
      .min(
        1,
        "Debe agregar al menos una tarea"
      ),


    notas: z
      .string()
      .trim()
      .optional(),


    asignado_a: z
      .string()
      .nullable()
      .optional()
      .transform(
        (value) => value || undefined
      ),


    seguro: seguroTrabajoSchema.optional(),

  })


  .superRefine((data, ctx) => {

    if (data.tipo !== "Seguro") {
      return;
    }


    if (!data.seguro?.aseguradora_id) {

      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [
          "seguro",
          "aseguradora_id",
        ],
        message:
          "Seleccione una aseguradora",
      });

    }


    if (!data.seguro?.numero_siniestro) {

      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [
          "seguro",
          "numero_siniestro",
        ],
        message:
          "Ingrese el número de siniestro",
      });

    }

  });


export type TrabajoFormData =
  z.infer<typeof trabajoSchema>;