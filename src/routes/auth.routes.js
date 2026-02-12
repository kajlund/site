import { getAuthController } from '../controllers/auth.controller.js';

export function getAuthRoutes(cnf, log) {
  const ctrl = getAuthController(cnf, log);

  return {
    group: {
      prefix: '/auth',
      middleware: [],
    },
    routes: [
      {
        method: 'post',
        path: '/login',
        middleware: [],
        handler: ctrl.logon,
      },
      {
        method: 'get',
        path: '/logout',
        middleware: [],
        handler: ctrl.logoff,
      },
    ],
  };
}
