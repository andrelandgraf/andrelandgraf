import { configSchema, server } from './schema.ts';

export const databaseConfig = configSchema('Database', {
  url: server({
    env: 'DATABASE_URL',
  }),
});
