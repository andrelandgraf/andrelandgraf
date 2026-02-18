import { Suspense } from 'react';
import { fetchArticles } from '~/modules/blog/db/fetchArticles.server.ts';
import { buildMetadata } from '~/next/lib/metadata.ts';
import { BlogPageClient, BlogPageFallback } from './blog-page-client.tsx';

export async function generateMetadata() {
  return buildMetadata({
    title: 'Blog',
    description: 'Hey there! I write about all things web development. Check out my blog posts.',
  });
}

export default async function BlogPage() {
  const articles = await fetchArticles();
  return (
    <Suspense fallback={<BlogPageFallback articles={articles} />}>
      <BlogPageClient articles={articles} />
    </Suspense>
  );
}
