import type { ActionResult } from '~/types';

export enum FetchOpenAIResState {
  outOfFunds = 'out_of_funds',
  exceedsMaxTokens = 'exceeds_max_tokens',
  internalError = 'internal_error',
  success = 'success',
}

export type Conversation = Array<{
  role: 'user' | 'system';
  content: string;
}>;

type Model = 'gpt-4o' | 'gpt-3.5-turbo-16k' | 'gpt-3.5-turbo' | 'text-embedding-ada-002';

export const MAX_CONTENT_LENGTH: Record<Model, number> = {
  'gpt-4o': 128_000,
  'gpt-3.5-turbo-16k': 16_384,
  'gpt-3.5-turbo': 8_192,
  'text-embedding-ada-002': 8_191,
} as const;

export async function fetchOpenAI({
  openAIKey,
  conversation,
  question,
  model = 'gpt-3.5-turbo',
}: {
  openAIKey: string;
  conversation: Conversation;
  question: string;
  model?: Model;
}): Promise<ActionResult<FetchOpenAIResState, Response>> {
  const messages = [...conversation, { role: 'user', content: question }];

  const currentContentSize = messages.reduce((acc, message) => acc + message.content.length, 0);
  if (currentContentSize > MAX_CONTENT_LENGTH[model]) {
    return [400, FetchOpenAIResState.exceedsMaxTokens, undefined];
  }

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    body: JSON.stringify({
      model,
      messages,
      //stream: true,
    }),
    headers: {
      Authorization: `Bearer ${openAIKey}`,
      'Content-Type': 'application/json',
    },
  });

  if (res.status === 402) {
    return [res.status, FetchOpenAIResState.outOfFunds, undefined];
  }

  if (!res.ok || res.status !== 200) {
    console.error(`${res.status}: ${res.statusText}`);
    return [res.status, FetchOpenAIResState.internalError, undefined];
  }

  return [200, FetchOpenAIResState.success, res];
}

export enum FetchEmbeddingResState {
  outOfFunds = 'out_of_funds',
  exceedsMaxTokens = 'exceeds_max_tokens',
  internalError = 'internal_error',
  success = 'success',
}

export async function fetchEmbedding({
  content,
  openAIKey,
}: {
  content: string;
  openAIKey: string;
}): Promise<ActionResult<FetchEmbeddingResState, number[]>> {
  if (content.length > MAX_CONTENT_LENGTH['text-embedding-ada-002']) {
    return [400, FetchEmbeddingResState.exceedsMaxTokens, undefined];
  }
  // OpenAI recommends replacing newlines with spaces for best results
  const input = content.replace(/\n/g, ' ');

  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    body: JSON.stringify({
      model: 'text-embedding-ada-002',
      input,
    }),
    headers: {
      Authorization: `Bearer ${openAIKey}`,
      'Content-Type': 'application/json',
    },
  });
  if (response.status === 402) {
    return [response.status, FetchEmbeddingResState.outOfFunds, undefined];
  }
  if (!response.ok || response.status !== 200) {
    console.error(`${response.status}: ${response.statusText}`);
    return [response.status, FetchEmbeddingResState.internalError, undefined];
  }
  const { data } = await response.json();
  if (!data || !Array.isArray(data) || !data[0].embedding || !Array.isArray(data[0].embedding)) {
    console.error(`${response.status}: ${response.statusText}`, data);
    return [response.status, FetchEmbeddingResState.internalError, undefined];
  }
  const embedding = data[0].embedding;
  return [200, FetchEmbeddingResState.success, embedding];
}
