import express from 'express';

import { getApiRoutes } from './api.routes.js';
import { getAuthRoutes } from './auth.routes.js';
import { getSiteRoutes } from './site.routes.js';

export function getRouter(cnf, log) {
  const apiRoutes = getApiRoutes(cnf, log);
  const authRoutes = getAuthRoutes(cnf, log);
  const siteRoutes = getSiteRoutes(cnf, log);

  const groups = [apiRoutes, authRoutes, siteRoutes];
  const router = express.Router();

  groups.forEach(({ group, routes }) => {
    routes.forEach(({ method, path, middleware = [], handler }) => {
      log.info(`Route: ${method} ${group.prefix}${path}`);
      router[method](
        group.prefix + path,
        [...(group.middleware || []), ...middleware],
        handler,
      );
    });
  });

  return router;
}
