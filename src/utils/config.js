import { z } from 'zod';

const configSchema = z.strictObject({
  env: z
    .enum(['development', 'production', 'test'])
    .optional()
    .default('development'),
  port: z.coerce.number().int().positive().gte(80).lte(65000),
  logLevel: z
    .enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'silent'])
    .optional()
    .default('info'),
  logHttp: z.coerce.boolean().optional().default(false),
  randomQuoteUrl: z.string().trim(),
});

function getEnvConfig() {
  return {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    logLevel: process.env.LOG_LEVEL,
    logHttp: process.env.LOG_HTTP,
    randomQuoteUrl: process.env.RANDOM_QUOTE_URL,
  };
}

export function getConfig(config = {}) {
  const candidate = { ...getEnvConfig(), ...config };
  const result = configSchema.safeParse(candidate);
  if (!result.success) {
    console.log(result.error);
    throw new Error('Configuration faulty');
  }
  const cnf = { ...result.data, isDev: result.data.env === 'development' };
  return cnf;
}
