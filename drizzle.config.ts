import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite',
  schema: './app/modules/db/schema.server.ts',
  dbCredentials: {
    url: 'data/main.db',
  },
});
