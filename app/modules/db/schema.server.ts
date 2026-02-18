import { InferSelectModel } from 'drizzle-orm';
import { AnyPgColumn, jsonb, pgTable as table, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

export const articlesTable = table(
  'articles',
  {
    slug: text('slug').primaryKey(),
    date: timestamp('date', { mode: 'date' }).notNull(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    categories: jsonb('categories').$type<string[]>().notNull(),
    imageUrl: text('img_url'),
    imageAltText: text('img_alt_text'),
    markdown: text('markdown').notNull(),
    newVersionSlug: text('new_version_slug').references((): AnyPgColumn => articlesTable.slug),
  },
  (table) => {
    return {
      slugIndex: uniqueIndex('slug_idx').on(table.slug),
    };
  },
);

export type Article = InferSelectModel<typeof articlesTable>;
