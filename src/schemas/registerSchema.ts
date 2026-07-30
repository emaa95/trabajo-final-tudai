import { z } from "zod";

import {
  passwordWithConfirmationSchema,
} from "./passwordSchema";


export const registerSchema = z
  .object({
    nombre: z
      .string()
      .trim()
      .min(1, "El nombre es requerido."),

    apellido: z
      .string()
      .trim()
      .min(1, "El apellido es requerido."),

    dni: z
      .string()
      .trim()
      .min(1, "El DNI es requerido."),

    telefono: z
      .string()
      .trim()
      .min(1, "El teléfono es requerido."),

    email: z
      .email("Ingresá un email válido.")
      .trim(),

    taller_nombre: z
      .string()
      .trim()
      .min(
        1,
        "El nombre del taller es requerido."
      ),

    taller_direccion: z
      .string()
      .trim()
      .min(
        1,
        "La dirección es requerida."
      ),

    taller_telefono: z
      .string()
      .trim()
      .min(
        1,
        "El teléfono es requerido."
      ),
  })
  .extend(
    passwordWithConfirmationSchema.shape
  )
  .refine(
    (data) =>
      data.password === data.confirmPassword,
    {
      path: ["confirmPassword"],
      message:
        "Las contraseñas no coinciden.",
    }
  );


export type RegisterSchema =
  z.infer<typeof registerSchema>;