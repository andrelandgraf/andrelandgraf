// Import needed packages
import { neonConfig, Pool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';
import ws from 'ws';

import { getPrivateEnvVars } from './env.server';

let db: PrismaClient;

declare global {
  // eslint-disable-next-line no-var
  var __db: PrismaClient | undefined;
}

function buildPrismaClient() {
  const { databaseUrl } = getPrivateEnvVars();
  neonConfig.webSocketConstructor = ws;

  const pool = new Pool({ connectionString: databaseUrl });
  const adapter = new PrismaNeon(pool);
  return new PrismaClient({ adapter });
}

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
if (process.env.NODE_ENV === 'production') {
  db = buildPrismaClient();
} else {
  if (!global.__db) {
    global.__db = buildPrismaClient();
  }
  db = global.__db;
}

export { db };
