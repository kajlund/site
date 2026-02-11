import { AppError } from '../utils/errors.js';

export function getErrorHandler(log) {
  // eslint-disable-next-line no-unused-vars
  return (err, req, res, next) => {
    if (err.isAppError) {
      return res.render('error', { title: 'Error', page: 'error', error: err });
    }

    // Generic error
    log.error(err);
    const genericError = new AppError(500, 'An Error Occurred');
    return res.render('error', {
      title: 'Error',
      page: 'error',
      error: genericError,
    });
  };
}
