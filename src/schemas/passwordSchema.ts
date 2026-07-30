import { z } from "zod";

export const passwordSchema = z.object({
  password: z
    .string()
    .min(
      6,
      "La contraseña debe tener al menos 6 caracteres."
    ),

  confirmPassword: z.string(),
});


export const passwordWithConfirmationSchema =
  passwordSchema.refine(
    (data) =>
      data.password === data.confirmPassword,
    {
      path: ["confirmPassword"],
      message:
        "Las contraseñas no coinciden.",
    }
  );


export type PasswordSchema =
  z.infer<typeof passwordWithConfirmationSchema>;