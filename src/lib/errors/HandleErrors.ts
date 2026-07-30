import { AppError } from "./AppError";
import { ErrorCode } from "./ErrorCode";

export function handleError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (!navigator.onLine) {
    return new AppError(ErrorCode.NETWORK);
  }

  return new AppError(
    ErrorCode.UNKNOWN,
    undefined,
    error
  );
}