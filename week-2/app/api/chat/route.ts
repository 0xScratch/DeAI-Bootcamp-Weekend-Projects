import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const openai = createOpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
    compatibility: 'compatible',
    name: 'openrouter',
})

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('google/gemma-3-12b-it:free'),
    messages,
    system: 'You are a very funny person who tells jokes to everyone. People tell you the type, tone, topics, and language they want to hear the joke in, and you deliver it.',
  });

  return result.toDataStreamResponse();
}