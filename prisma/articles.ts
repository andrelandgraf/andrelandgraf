import { getPrivateEnvVars } from '~/modules/env.server';
import { fetchEmbedding, FetchEmbeddingResState, MAX_CONTENT_LENGTH } from '~/modules/openAI/fetchOpenAI';

import { fetchMarkdownFilesFs, FetchMarkdownFilesResState } from '../app/modules/blog/fs/fetchMarkdownFiles.server';
import { validateFrontMatter } from '../app/modules/blog/validation.server';
import { db } from '../app/modules/db.server';

const OVERRIDE_EMBEDDINGS = true;

const { openAIKey } = getPrivateEnvVars();

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
  console.log(`upserting article ${file.slug} with content length ${file.markdown.length}...`);
  const article = await db.article.upsert({
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

  console.log(`creating article ${file.slug} embeddings...`);
  const prev = articles.find((article) => article.slug === file.slug);
  if (!prev || OVERRIDE_EMBEDDINGS || prev.markdown !== file.markdown) {
    // Split markdown into MAX_CONTENT_LENGTH (8191) chunks
    const chunks = [];
    let chunk = '';
    for (const char of file.markdown) {
      if (chunk.length === MAX_CONTENT_LENGTH['text-embedding-ada-002']) {
        chunks.push(chunk);
        chunk = '';
      }
      chunk += char;
    }

    // Delete all embeddings for this article
    await db.articleEmbedding.deleteMany({
      where: { articleId: article.id },
    });

    // Get embeddings for each chunk
    const embeddings = [];
    for (const chunk of chunks) {
      const [status, state, embedding] = await fetchEmbedding({
        content: chunk,
        openAIKey,
      });
      if (state !== FetchEmbeddingResState.success || !embedding) {
        throw new Error(`(${status}) fetchEmbeddings error: ${state}`);
      }
      embeddings.push(embedding);
    }

    for (let i = 0; i < embeddings.length; i++) {
      const embedding = embeddings[i];
      // Create then update to generate uuid via Prisma
      console.log(`creating article ${file.slug} embedding ${i}...`);
      const articleEmbedding = await db.articleEmbedding.create({
        data: { chunkIndex: i, article: { connect: { id: article.id } } },
      });
      console.log(`updating article ${file.slug} embedding ${i}...`);
      const vectorQuery = `[${embedding.join(',')}]`;
      await db.$executeRaw`
      UPDATE "ArticleEmbedding" SET "embedding" = ${vectorQuery}::vector WHERE "id" = ${articleEmbedding.id};
    `;
    }
  }
}

console.log('done');
