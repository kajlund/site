import { asyncHandler } from '../utils/async-handler.js';
import { getSiteService } from '../services/site.service.js';

export function getSiteController(cnf, log) {
  const svc = getSiteService(cnf, log);

  return {
    generateSiteMap: asyncHandler(async (req, res) => {
      const xml = await svc.generateSiteMap();
      res.header('Content-Type', 'application/xml');
      res.send(xml);
    }),
    showHomeView: asyncHandler(async (req, res) => {
      const quote = await svc.fetchRandomQuote();
      res.render('index', {
        title: 'Home',
        page: 'home',
        message: 'Welcome to kajlund.com',
        quote,
      });
    }),
    showDemosView: asyncHandler(async (req, res) => {
      res.render('demos', {
        title: 'Demos',
        page: 'demos',
      });
    }),
    showAboutView: asyncHandler(async (req, res) => {
      res.render('about', {
        title: 'About',
        page: 'about',
      });
    }),
  };
}
