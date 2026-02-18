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
  const articles = await db.select({ slug: articlesTable.slug }).from(articlesTable);

  const deletedArticles = articles.filter((article) => !files.find((file) => file.slug === article.slug)).map((a) => a.slug);
  console.log(`deleting ${deletedArticles.length} articles from database...`);
  for (const slug of deletedArticles) {
    await db.delete(articlesTable).where(eq(articlesTable.slug, slug));
  }

  const availableSlugs = new Set(files.map((file) => file.slug));
  for (const file of files) {
    const targetSlug = file.frontmatter.newVersionSlug;
    if (targetSlug && !availableSlugs.has(targetSlug)) {
      throw new Error(`file ${file.slug} references missing newVersionSlug ${targetSlug}`);
    }
  }

  console.log('upserting base article rows...');
  for (const file of files) {
    if (!file.content) {
      throw new Error(`file ${file.slug} has no content`);
    }
    if (typeof file.content !== 'object') {
      throw new Error(`file ${file.slug} content must be of type JSON`);
    }
    await db
      .insert(articlesTable)
      .values({
        slug: file.slug,
        title: file.frontmatter.title,
        description: file.frontmatter.description,
        date: new Date(file.frontmatter.date),
        categories: file.frontmatter.categories,
        imageUrl: file.frontmatter.imageUrl,
        imageAltText: file.frontmatter.imageAltText,
        markdown: file.markdown,
        newVersionSlug: null,
      })
      .onConflictDoUpdate({
        target: articlesTable.slug,
        set: {
          title: file.frontmatter.title,
          description: file.frontmatter.description,
          date: new Date(file.frontmatter.date),
          categories: file.frontmatter.categories,
          imageUrl: file.frontmatter.imageUrl,
          imageAltText: file.frontmatter.imageAltText,
          markdown: file.markdown,
          newVersionSlug: null,
        },
      });
  }

  console.log('updating newVersionSlug links...');
  for (const file of files) {
    if (!file.frontmatter.newVersionSlug) {
      continue;
    }

    console.log(`setting newVersionSlug for ${file.slug} -> ${file.frontmatter.newVersionSlug}...`);
    await db
      .update(articlesTable)
      .set({
        newVersionSlug: file.frontmatter.newVersionSlug,
      })
      .where(eq(articlesTable.slug, file.slug));
  }

  console.log('done');
}
