import cookieParser from 'cookie-parser';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import nunjucks from 'nunjucks';
import httpLogger from 'pino-http';

import { getRouter } from './routes/index.js';
import { getErrorHandler } from './middleware/errorhandler.js';
import { getNotFoundHandler } from './middleware/notfoundhandler.js';

dayjs.extend(relativeTime);

export function getApp(cnf, log) {
  const app = express();

  // Add middleware
  app.disable('x-powered-by');
  app.set('trust proxy', 1); // trust first proxy
  app.use(cookieParser());
  app.use(express.json({ limit: '100kb' }));
  app.use(express.urlencoded({ extended: true, limit: '1000kb' }));
  app.use(express.static('public'));

  app.use(
    rateLimit({
      windowMs: 5 * 60 * 1000, // 5 minutes
      limit: 1000, // Limit each IP to 100 requests per `window` (here, per 5 minutes).
      standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
      // store: ... , // Redis, Memcached, etc. See below.
    }),
  );

  // Set view engine
  const nj = nunjucks.configure('views', {
    autoescape: true,
    express: app,
    noCache: cnf.isDev,
  });
  app.set('view engine', 'njk'); // set as default

  nj.addFilter('formatDate', (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-EN', {
      weekday: 'short',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  });

  nj.addFilter('dateIso', function (date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0]; // Returns "2025-12-21"
  });

  nj.addFilter('date', (date, formatStr = 'YYYY-MM-DD') => {
    const d = dayjs(date, formatStr, true); // strict parsing
    if (!d.isValid()) return date; // Return original if invalid

    return d.format(formatStr);
  });

  // Logging Middleware
  if (cnf.logHttp) {
    app.use(httpLogger({ logger: log }));
  }

  // Add routes
  app.use(getRouter(cnf, log));

  // Add 404 handler
  app.use(getNotFoundHandler());

  // Add Generic Error handler
  app.use(getErrorHandler(log));

  return app;
}
