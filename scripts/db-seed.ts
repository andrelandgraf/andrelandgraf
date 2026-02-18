import process from 'node:process';
import { loadEnvConfig } from '@next/env';

async function main() {
  loadEnvConfig(process.cwd());
  const [{ generateArticles }, { closeDbConnection }] = await Promise.all([
    import('~/modules/db/articles.server.ts'),
    import('~/modules/db/db.server.ts'),
  ]);
  try {
    await generateArticles();
  } finally {
    await closeDbConnection();
  }
}

main().catch((error: unknown) => {
  console.error('Failed to seed database', error);
  process.exit(1);
});
