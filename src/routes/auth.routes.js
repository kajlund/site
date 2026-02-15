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
      {
        method: 'get',
        path: '/profile',
        handler: ctrl.showProfile,
      },
      {
        method: 'get',
        path: '/profile/edit',
        handler: ctrl.showEditProfile,
      },
      {
        method: 'post',
        path: '/profile/update',
        handler: ctrl.updateProfile,
      },
    ],
  };
}
