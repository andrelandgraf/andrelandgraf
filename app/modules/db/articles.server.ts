import { eq } from 'drizzle-orm';
import { fetchMarkdownFilesFs, FetchMarkdownFilesResState } from '~/modules/blog/fs/fetchMarkdownFiles.server.ts';
import { validateFrontMatter } from '~/modules/blog/validation.server.ts';
import { db } from '~/modules/db/db.server.ts';
import { articlesTable } from '~/modules/db/schema.server.ts';

export async function generateArticles() {
  console.log('reading articles from fs...');
  const [status, state, files] = await fetchMarkdownFilesFs(`./contents/articles`, validateFrontMatter);
  if (state !== FetchMarkdownFilesResState.success || !files) {
    throw new Error(`(${status}) fetchMarkdownFilesFs error: ${state}`);
  }

  console.log('fetching articles from database...');
  const articles = await db.select().from(articlesTable);

  const deletedArticles = articles.filter((article) => !files.find((file) => file.slug === article.slug));
  console.log(`deleting ${deletedArticles.length} articles from database...`);
  for (const article of deletedArticles) {
    await db.delete(articlesTable).where(eq(articlesTable.slug, article.slug));
  }

  console.log('looping over fs articles...');
  for (const file of files) {
    if (!file.content) {
      throw new Error(`file ${file.slug} has no content`);
    }
    if (typeof file.content !== 'object') {
      throw new Error(`file ${file.slug} content must be of type JSON`);
    }
    console.log(`upserting article ${file.slug} with content length ${file.markdown.length}...`);
    if (articles.find((a) => a.slug === file.slug)) {
      await db.update(articlesTable).set({
        slug: file.slug,
        title: file.frontmatter.title,
        description: file.frontmatter.description,
        date: new Date(file.frontmatter.date),
        categories: JSON.stringify(file.frontmatter.categories),
        imageUrl: file.frontmatter.imageUrl,
        imageAltText: file.frontmatter.imageAltText,
        markdown: file.markdown,
      }).where(eq(articlesTable.slug, file.slug));
    } else {
      await db.insert(articlesTable).values({
        slug: file.slug,
        title: file.frontmatter.title,
        description: file.frontmatter.description,
        date: new Date(file.frontmatter.date),
        categories: JSON.stringify(file.frontmatter.categories),
        imageUrl: file.frontmatter.imageUrl,
        imageAltText: file.frontmatter.imageAltText,
        markdown: file.markdown,
      });
    }
  }

  console.log('done');
}
