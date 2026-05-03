import {ErrorCode} from './error-codes';

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.INSUFFICIENT_BALANCE]: "Insufficient Balance",
  [ErrorCode.INTERNAL_SERVER_ERROR]: "Internal Server Error",
  [ErrorCode.INVALID_PASSWORD]: "Invalid Password",
  [ErrorCode.USER_ALREADY_EXISTS]: "User Already Exists",
  [ErrorCode.USER_CANNOT_BE_SAME]: "Can't send yourself money",
  [ErrorCode.USER_NOT_FOUND]: "User Not Found",
};

export const FALLBACK_ERROR_MESSAGE = "An unexpected error occurred. Please try again later.";
