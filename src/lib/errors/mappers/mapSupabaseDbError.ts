import { AppError } from "../AppError";
import { ErrorCode } from "../ErrorCode";

export function mapSupabaseDbError(error: { message: string }): AppError {
  const msg = error.message.toLowerCase();

  if (msg.includes("unique") || msg.includes("duplicate")) {
    return new AppError(
      ErrorCode.VALIDATION,
      "Ya existe un registro con esos datos.",
      error
    );
  }

  return new AppError(ErrorCode.SUPABASE_ERROR, undefined, error);
}