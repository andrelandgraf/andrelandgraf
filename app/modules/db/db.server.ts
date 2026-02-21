import { attachDatabasePool } from '@vercel/functions';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.server.ts';
import { databaseConfig } from './config.ts';

const pool = new Pool({
  connectionString: databaseConfig.server.url,
});
attachDatabasePool(pool);
const db = drizzle(pool, { casing: 'snake_case', schema });

async function closeDbConnection() {
  await pool.end();
}

export { closeDbConnection, db };
