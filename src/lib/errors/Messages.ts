import { ErrorCode } from "./ErrorCode";

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.UNKNOWN]: "Ocurrió un error inesperado.",

  [ErrorCode.NETWORK]: "No hay conexión a Internet.",

  [ErrorCode.SERVER]: "Error interno del servidor.",

  [ErrorCode.TIMEOUT]:
    "La operación tardó demasiado en responder.",

  [ErrorCode.INVALID_CREDENTIALS]:
    "Usuario o contraseña incorrectos.",

  [ErrorCode.EMAIL_ALREADY_EXISTS]:
    "El email ya está registrado.",

  [ErrorCode.SESSION_EXPIRED]:
    "La sesión expiró. Iniciá sesión nuevamente.",

  [ErrorCode.VALIDATION]:
    "Los datos ingresados no son válidos.",

  [ErrorCode.SUPABASE_ERROR]:
    "Ocurrió un error en la base de datos.",
};