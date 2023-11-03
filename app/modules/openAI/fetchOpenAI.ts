import type { ActionResult } from '~/types';

export enum FetchOpenAIResState {
  outOfFunds = 'out_of_funds',
  internalError = 'internal_error',
  success = 'success',
}

export type Conversation = Array<{
  role: 'user' | 'system';
  content: string;
}>;

export async function fetchOpenAI({
  openAIKey,
  conversation,
  question,
}: {
  openAIKey: string;
  conversation: Conversation;
  question: string;
}): Promise<ActionResult<FetchOpenAIResState, Response>> {
  const messages = [...conversation, { role: 'user', content: question }];
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
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
