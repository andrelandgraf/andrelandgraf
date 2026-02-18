import { defineConfig } from 'drizzle-kit';
import { loadEnvConfig } from '@next/env';

loadEnvConfig(process.cwd());

import { databaseConfig } from './app/modules/config/database.ts';

export default defineConfig({
  dialect: 'postgresql',
  schema: './app/modules/db/schema.server.ts',
  out: './drizzle-pg',
  dbCredentials: {
    url: databaseConfig.server.url,
  },
});
