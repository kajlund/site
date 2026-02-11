import { getSiteController } from '../controllers/site.controller.js';

export function getSiteRoutes(cnf, log) {
  const ctrl = getSiteController(cnf, log);

  return {
    group: {
      prefix: '',
      middleware: [],
    },
    routes: [
      {
        method: 'get',
        path: '/',
        middleware: [],
        handler: ctrl.showHomeView,
      },
      {
        method: 'get',
        path: '/sitemap.xml',
        middleware: [],
        handler: ctrl.generateSiteMap,
      },
      {
        method: 'get',
        path: '/demos',
        middleware: [],
        handler: ctrl.showDemosView,
      },
      {
        method: 'get',
        path: '/about',
        middleware: [],
        handler: ctrl.showAboutView,
      },
    ],
  };
}
