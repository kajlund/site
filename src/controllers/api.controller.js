import { asyncHandler } from '../utils/async-handler.js';
import { getApiService } from '../services/api.service.js';

export function getApiController(cnf, log) {
  const svc = getApiService(cnf, log);

  return {
    getRandomQuote: asyncHandler(async (req, res) => {
      const quote = await svc.fetchRandomQuote();
      res.json(quote);
    }),
  };
}
