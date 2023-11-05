import { fetchMarkdownFilesFs, FetchMarkdownFilesResState } from '../app/modules/blog/fs/fetchMarkdownFiles.server';
import { validateFrontMatter } from '../app/modules/blog/validation.server';
import { db } from '../app/modules/db.server';

console.log('reading articles from fs...');
const [status, state, files] = await fetchMarkdownFilesFs(`./contents/articles`, validateFrontMatter);
if (state !== FetchMarkdownFilesResState.success || !files) {
  throw new Error(`(${status}) fetchMarkdownFilesFs error: ${state}`);
}

console.log('fetching articles from database...');
const articles = await db.article.findMany();

const deletedArticles = articles.filter((article) => !files.find((file) => file.slug === article.slug));
console.log(`deleting ${deletedArticles.length} articles from database...`);
for (const article of deletedArticles) {
  await db.article.delete({
    where: {
      slug: article.slug,
    },
  });
}

console.log('looping over fs articles...');
for (const file of files) {
  if (!file.content) {
    throw new Error(`file ${file.slug} has no content`);
  }
  if (typeof file.content !== 'object') {
    throw new Error(`file ${file.slug} content must be of type JSON`);
  }
  console.log(`upserting article ${file.slug}...`);
  await db.article.upsert({
    create: {
      slug: file.slug,
      title: file.frontmatter.title,
      description: file.frontmatter.description,
      date: file.frontmatter.date,
      categories: file.frontmatter.categories,
      imageUrl: file.frontmatter.imageUrl,
      imageAltText: file.frontmatter.imageAltText,
      markdown: file.markdown,
    },
    update: {
      title: file.frontmatter.title,
      description: file.frontmatter.description,
      date: file.frontmatter.date,
      categories: file.frontmatter.categories,
      imageUrl: file.frontmatter.imageUrl,
      imageAltText: file.frontmatter.imageAltText,
      markdown: file.markdown,
    },
    where: {
      slug: file.slug,
    },
  });
}

console.log('done');
