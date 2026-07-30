import { ErrorCode } from "./ErrorCode";
import { ERROR_MESSAGES } from "./Messages";

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly cause?: unknown;

  constructor(
    code: ErrorCode,
    message?: string,
    cause?: unknown
  ) {
    super(message ?? ERROR_MESSAGES[code]);

    this.name = "AppError";
    this.code = code;
    this.cause = cause;
  }
}