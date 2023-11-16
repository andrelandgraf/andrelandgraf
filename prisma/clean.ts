import { db } from '../app/modules/db.server';

await db.articleEmbedding.deleteMany({});
await db.article.deleteMany({});
