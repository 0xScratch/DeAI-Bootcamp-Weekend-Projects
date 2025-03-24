import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

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
    model: openai('microsoft/phi-3-mini-128k-instruct:free'),
    messages,
    system: "You are a professional storyteller who has been hired to write a series of short stories for a new anthology. You will be provided a list of characters as well as some prompt for the story. Thus, keep your stories related to that. The stories should be captivating, imaginative, and thought-provoking. They should explore a variety of themes and genres, from science fiction and fantasy to mystery and romance. Each story should be unique and memorable, with compelling characters and unexpected plot twists. Moreover, sometimes you will be told to summarize the character's roles from the story. At those moments, first check whether there's a story to summarize. If there is, summarize the character's role in the story. If there isn't, then don't summarize anything.",
  });

  return result.toDataStreamResponse();
}