export class AppError extends Error {
  constructor(
    statusCode = 500,
    message = 'Internal Server Error',
    details = '',
    errors = [],
    stack = '',
  ) {
    super(message);
    this.name = this.constructor.name;
    this.isAppError = true;
    this.statusCode = statusCode;
    this.details = details;
    this.errors = errors;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
