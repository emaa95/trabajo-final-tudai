import { AppError } from "../AppError";
import { ErrorCode } from "../ErrorCode";

export function mapSupabaseAuthError(error: { message: string }): AppError {
  const msg = error.message.toLowerCase();

  if (msg.includes("invalid login credentials")) {
    return new AppError(ErrorCode.INVALID_CREDENTIALS, undefined, error);
  }

  if (msg.includes("email not confirmed")) {
    return new AppError(
      ErrorCode.VALIDATION,
      "Confirmá tu email antes de ingresar.",
      error
    );
  }

  if (
    msg.includes("already registered") ||
    msg.includes("user already exists")
  ) {
    return new AppError(ErrorCode.EMAIL_ALREADY_EXISTS, undefined, error);
  }

  return new AppError(ErrorCode.SUPABASE_ERROR, undefined, error);
}