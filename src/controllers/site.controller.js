import { asyncHandler } from '../utils/async-handler.js';
import { getSiteService } from '../services/site.service.js';
import { getApiService } from '../services/api.service.js';
import { getAuthUtils } from '../utils/auth.utils.js';

export function getSiteController(cnf, log) {
  const svcSite = getSiteService(cnf, log);
  const svcApi = getApiService(cnf, log);
  const auth = getAuthUtils(cnf, log);

  return {
    generateSiteMap: asyncHandler(async (req, res) => {
      const xml = await svcSite.generateSiteMap();
      res.header('Content-Type', 'application/xml');
      res.send(xml);
    }),
    showHomeView: asyncHandler(async (req, res) => {
      const user = auth.getAuthUser(req);
      const quote = await svcApi.fetchRandomQuote();

      res.render('index', {
        title: 'Home',
        page: 'home',
        message: 'Welcome to kajlund.com',
        quote,
        user,
      });
    }),
    showDemosView: asyncHandler(async (req, res) => {
      const user = auth.getAuthUser(req);
      res.render('demos', {
        title: 'Demos',
        page: 'demos',
        user,
      });
    }),
    showAboutView: asyncHandler(async (req, res) => {
      const user = auth.getAuthUser(req);
      res.render('about', {
        title: 'About',
        page: 'about',
        user,
      });
    }),
  };
}
