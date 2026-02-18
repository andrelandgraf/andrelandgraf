import { z } from 'zod';
import { configSchema, server } from './schema.ts';

export const mainConfig = configSchema('Main', {
  nodeEnv: server({
    env: 'NODE_ENV',
    schema: z.enum(['development', 'production', 'test']).default('development'),
  }),
  origin: server({
    env: 'ORIGIN',
    optional: true,
  }),
  posthogPublicApiKey: server({
    env: 'POSTHOG_PUBLIC_API_KEY',
    optional: true,
  }),
});
