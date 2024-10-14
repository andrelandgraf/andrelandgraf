import { db } from '../app/modules/db/db.server.ts';
import { articlesTable } from '~/modules/db/schema.server.ts';

await db.delete(articlesTable);
