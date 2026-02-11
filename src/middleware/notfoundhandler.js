import { AppError } from '../utils/errors.js';

export function getNotFoundHandler() {
  return (req, res, next) => {
    next(
      new AppError(404, 'Not Found', `Route ${req.originalUrl} was not found`),
    );
  };
}
