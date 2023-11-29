import Markdoc from '@markdoc/markdoc';
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';

import { ButtonLink } from '~/components/buttons';
import { BlogMarkdownContainer } from '~/modules/blog/components';
import { config } from '~/modules/blog/config';
import { articleToMarkdocFile } from '~/modules/blog/db/fetchArticle.server';
import { fetchClosestArticles, getContentOfChunkIndex } from '~/modules/blog/db/fetchArticles.server';
import type { BlogArticleFrontmatter } from '~/modules/blog/validation.server';
import { db } from '~/modules/db.server';
import { getPrivateEnvVars } from '~/modules/env.server';
import {
  type Conversation,
  FetchEmbeddingResState,
  fetchOpenAI,
  FetchOpenAIResState,
} from '~/modules/openAI/fetchOpenAI';
import type { MarkdocFile } from '~/types';
import { getFocusClasses } from '~/utilities/ariaClasses';
import { getMetaTags } from '~/utilities/metaTags';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return getMetaTags({
    title: 'Ask | Blog',
    description: 'Ask me anything about all things web development.',
  });
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { openAIKey } = getPrivateEnvVars();
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const question = searchParams.get('question');

  if (!question || typeof question !== 'string') {
    return redirect('/blog');
  }

  const questionAndAnswer = await db.questionAndAnswer.findUnique({
    where: { question },
    include: {
      recommendedArticles: true,
    },
  });
  if (questionAndAnswer) {
    const replyAst = Markdoc.parse(questionAndAnswer.answerMarkdown);
    const markdownReply = Markdoc.transform(replyAst, config);

    const matches: MarkdocFile<BlogArticleFrontmatter>[] = questionAndAnswer.recommendedArticles.map((article) =>
      articleToMarkdocFile(article, markdownReply),
    );

    return json({ markdownReply, matches }, { headers: { 'cache-control': 'public, max-age=7200' } });
  }

  const [, embedsState, matches] = await fetchClosestArticles({ openAIKey, content: question });
  if (embedsState !== FetchEmbeddingResState.success || !matches) {
    console.error('Failed to fetch closest articles');

    let reply = 'Sorry, something went wrong. Please try again later.';
    if (embedsState === FetchEmbeddingResState.outOfFunds) {
      reply = 'Sorry, I ran out of funds. Please try again later.';
    } else if (embedsState === FetchEmbeddingResState.exceedsMaxTokens) {
      console.error('Exceeded max tokens');
      reply = 'Sorry, I exceeded the max tokens. Please try again later.';
    }

    return json({ markdownReply: reply, matches }, { headers: { 'cache-control': 'public, max-age=7200' } });
  }

  const conversation: Conversation = [
    {
      role: 'system',
      content: `
        You are a helpful and friendly AI assistant for andrelandgraf.dev.
        Andre Landgraf is a web developer from Germany who currently
        works for LinkedIn and lives in Cupertino, California.
        Andre is passionate about web development, open source, and
        loves to speak, write, and teach about all things web development.
        In his free time, Andre tutors aspiring web developers and
        enjoys writing blog articles and coding on side projects.

        Here are a few helpful links folks can use to learn more about Andre:
        - Tutoring: https://andrelandgraf.dev/tutoring
        - Twitter: https://twitter.com/andrelandgraf94

        Your job is to answer questions about Andre and his blog. You may only
        answer questions that are related to Andre, web development, and his blog
        post articles. You may not answer questions about other topics.

        Keep your answers short and concise. You may use markdown to format your
        answers.
        
        You may also include links to the following external resources in your answers:
        - The remix.run documentation: https://remix.run/docs/en/main
        - The MDN Web Docs: https://developer.mozilla.org/en-US/

        You may not include any other links in your answers. You may not include
        any images or other media in your answers. Please remain respectful and
        professional at all times. If you aren't sure how to answer a question,
        it is better to not answer it at all and apologize for not being able to
        answer it.
        
        ${
          matches.length
            ? `Based on an embedding of the question, the following content from the blog articles
          seems to be relevant to the question: ${getContentOfChunkIndex(
            matches[0].markdown,
            matches[0].chunks[0].chunkIndex,
          )}`
            : 'Based on an embedding of the question, no content from the blog articles seems to be relevant to the question.'
        }`,
    },
  ];

  const [, state, response] = await fetchOpenAI({ openAIKey, conversation, question, model: 'gpt-3.5-turbo-16k' });
  if (state !== FetchOpenAIResState.success || !response) {
    console.error('Failed to fetch response from OpenAI');

    let reply = 'Sorry, something went wrong. Please try again later.';
    if (state === FetchOpenAIResState.outOfFunds) {
      reply = 'Sorry, I ran out of funds. Please try again later.';
    } else if (state === FetchOpenAIResState.exceedsMaxTokens) {
      console.error('Exceeded max tokens');
      reply = 'Sorry, I exceeded the max tokens. Please try again later.';
    }

    return json({ markdownReply: reply, matches }, { headers: { 'cache-control': 'public, max-age=7200' } });
  }

  const data = await response.json();
  const firstChoice = data.choices[0];
  const content = firstChoice?.message?.content;
  if (!content || typeof content !== 'string') {
    return json(
      { markdownReply: 'Sorry, something went wrong. Please try again later.', matches },
      { headers: { 'cache-control': 'public, max-age=7200' } },
    );
  }

  await db.questionAndAnswer.create({
    data: {
      question,
      answerMarkdown: content,
      recommendedArticles: { connect: matches.map((match) => ({ id: match.articleId })) },
    },
  });

  const replyAst = Markdoc.parse(content);
  const markdownReply = Markdoc.transform(replyAst, config);

  return json({ markdownReply, matches }, { headers: { 'cache-control': 'public, max-age=7200' } });
}

export default function Component() {
  const { markdownReply, matches } = useLoaderData<typeof loader>();
  return (
    <div className="w-full flex flex-col items-center lg:flex-row lg:items-stretch wide:flex-col gap-10">
      <article className="w-full lg:max-w-3xl wide:max-w-5xl border-primary leading-loose p-4 rounded-md bg-teal-100 dark:bg-teal-900 text-gray-800 dark:text-white">
        <BlogMarkdownContainer className="w-full flex flex-col gap-4" content={markdownReply} />
      </article>
      {!!matches?.length && (
        <aside className="w-full lg:max-w-3xl wide:max-w-5xl">
          <h2 className="text-xl lg:text-2lx font-bold mb-4">Related Blog Posts</h2>
          <ul className="flex flex-col gap-10" title="Related articles">
            {matches.map(({ frontmatter, slug }) => (
              <li key={slug}>
                <article className="flex flex-col gap-3 w-full">
                  <Link to={`/blog/${slug}`} prefetch="intent" className={getFocusClasses(true)}>
                    <h3 className="text-primaryDark dark:text-primary font-bold">{frontmatter.title}</h3>
                  </Link>
                  <p>{frontmatter.description}</p>
                  <ButtonLink to={`/blog/${slug}`} aria-label={`View Article ${frontmatter.title}`} prefetch="intent">
                    View Article
                  </ButtonLink>
                </article>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </div>
  );
}
