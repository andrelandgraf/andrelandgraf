import { InferSelectModel } from 'drizzle-orm';
import { sqliteTable as table } from 'drizzle-orm/sqlite-core';
import * as t from 'drizzle-orm/sqlite-core';

export const articlesTable = table(
  'articles',
  {
    slug: t.text('slug').primaryKey(),
    date: t.int('date', { mode: 'timestamp' }).notNull(),
    title: t.text('title').notNull(),
    description: t.text('description').notNull(),
    categories: t.text('categories', { mode: 'json' }).notNull(),
    imageUrl: t.text('img_url'),
    imageAltText: t.text('img_alt_text'),
    markdown: t.text('markdown').notNull(),
    newVersionSlug: t.text('new_version_slug').references((): t.AnySQLiteColumn => articlesTable.slug),
  },
  (table) => {
    return {
      slugIndex: t.uniqueIndex('slug_idx').on(table.slug),
    };
  },
);

export type Article = InferSelectModel<typeof articlesTable>;
