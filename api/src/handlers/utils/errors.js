import config from "../../config";
import { NotFoundError, ValidationError } from "../../domain/errors";

export class HttpError extends Error {
  constructor(statusCode = 500, message = "An error occured", details = null) {
    super(message);
    this.message = message;
    this.details = details;
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }
    this.stack = new Error().stack;
  }
}

export const convertErrorToHttpError = (error) => {
  if (error instanceof HttpError) {
    return error;
  }

  if (error instanceof NotFoundError) {
    return new HttpError(404, error.message, error.details);
  }

  if (error instanceof ValidationError) {
    return new HttpError(400, error.message, error.details);
  }

  return new HttpError(
    500,
    config.logs.debug ? error.message : "An error occured",
    config.logs.debug ? error.details : "Please contact an administrator"
  );
};
