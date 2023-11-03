import type { HeadersFunction, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { getPrivateEnvVars } from '~/modules/env.server';
import { type Conversation, fetchOpenAI, FetchOpenAIResState } from '~/modules/openAI/fetchOpenAI';
import { getMetaTags } from '~/utilities/metaTags';

export const headers: HeadersFunction = () => {
  return {
    'cache-control': 'private, no-cache',
  };
};

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

  const conversation: Conversation = [
    {
      role: 'system',
      content:
        'You are a helpful AI chatbot that helps visitors of andrelandgraf.dev with their questions about web development. Use only the content from https://andrelandgraf.dev/blog and https://remix.run/docs/en/main. Do not answer questions about personal information or anything that could be considered offensive. Do not answer questions that ask if a technology is better than another one. Keep the answers short and the conversation friendly and helpful.',
    },
  ];

  const [, state, response] = await fetchOpenAI({ openAIKey, conversation, question });

  let reply = '';
  if (state === FetchOpenAIResState.outOfFunds) {
    reply = 'Sorry, I ran out of funds. Please try again later.';
  } else if (state !== FetchOpenAIResState.internalError || !response) {
    reply = 'Sorry, something went wrong. Please try again later.';
  }

  if (response) {
    const json = await response.json();
    const firstChoice = json.choices[0];
    if (firstChoice?.message?.content) {
      reply = firstChoice.message.content;
    }
  }

  return json({ reply }, { headers: { 'cache-control': 'public, max-age=3600' } });
}

export default function Component() {
  const { reply } = useLoaderData<typeof loader>();
  return (
    <p className="w-full border-primary leading-loose p-4 rounded-md bg-teal-100 dark:bg-teal-900 text-gray-800 dark:text-white">
      {reply}
    </p>
  );
}
