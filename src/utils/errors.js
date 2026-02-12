export class AppError extends Error {
  constructor(
    statusCode = 500,
    message = 'Internal Server Error',
    detail = '',
    errors = [],
    stack = '',
  ) {
    super(message);
    this.name = this.constructor.name;
    this.isAppError = true;
    this.statusCode = statusCode;
    this.detail = detail;
    this.errors = errors;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
