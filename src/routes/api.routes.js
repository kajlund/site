import { getApiController } from '../controllers/api.controller.js';

export function getApiRoutes(cnf, log) {
  const ctrl = getApiController(cnf, log);

  return {
    group: {
      prefix: '/api',
      middleware: [],
    },
    routes: [
      {
        method: 'get',
        path: '/quotes/random',
        middleware: [],
        handler: ctrl.getRandomQuote,
      },
    ],
  };
}
