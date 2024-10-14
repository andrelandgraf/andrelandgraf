import fs from 'node:fs';
import path from 'node:path';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import Database from 'better-sqlite3';
import { env } from '../env.server.ts';
import { generateArticles } from '~/modules/db/articles.server.ts';

// Recursively create path to DB file on volume
const dir = path.dirname(env.db.path);
fs.mkdirSync(dir, { recursive: true });

const sqlite = new Database(env.db.path);
const db = drizzle(sqlite, { casing: 'snake_case' });

// This will automatically run needed migrations on the database
migrate(db, { migrationsFolder: './drizzle' });
// Generate articles
generateArticles();

export { db };
