import { getAuthToken } from "@/data/services/get-token";
import { getUserMeLoader } from "@/data/services/get-user-me-loader";
import { fetchTranscript } from "@/lib/youtube-transcript";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { NextRequest } from "next/server";

const TEMPLATE = `
INSTRUCTIONS: 
  For this {text}, complete the following steps. Ensure all outputs are in the same language as the provided content.
  
  Generate the title based on the content provided.
  Summarize the following content and include 5 key topics, writing in first person using a natural tone of voice.
  
  Write a YouTube video description:
    - Include headings and sections.
    - Incorporate keywords and key takeaways.
    - Use the original language of the provided content.

  Generate a bulleted list of key points and benefits, maintaining the original language.

  Return possible and best recommended keywords in the original language.
`;

async function generateSummary(content: string, template: string) {
  const prompt = PromptTemplate.fromTemplate(template);

  const model = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: process.env.OPENAI_MODEL ?? "gpt-4-turbo-preview",
    temperature: process.env.OPENAI_TEMPERATURE
      ? parseFloat(process.env.OPENAI_TEMPERATURE)
      : 0.7,
    maxTokens: process.env.OPENAI_MAX_TOKENS
      ? parseInt(process.env.OPENAI_MAX_TOKENS)
      : 1000,
  });

  const outputParser = new StringOutputParser();

  try {
    // Виклик PromptTemplate для генерації підсумку
    const inputValues = { text: content };

    // Створюємо інстанцію ланцюга (chain)
    const chain = prompt.pipe(model).pipe(outputParser);

    // Виклик ланцюга з підготовленими даними
    const summary = await chain.invoke(inputValues);

    // Повертаємо підсумок
    return summary;
  } catch (error) {
    console.error("Error generating summary:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Failed to generate summary." };
  }
}

function transformData(data: any[]) {
  let text = "";

  data.forEach((item) => {
    text += item.text + " ";
  });

  return {
    data: data,
    text: text.trim(),
  };
}

export async function POST(req: NextRequest) {
  const user = await getUserMeLoader();
  const token = await getAuthToken();

  if (!user.ok || !token)
    return new Response(
      JSON.stringify({ data: null, error: "Not authenticated" }),
      { status: 401 }
    );

  if (user.data.credits < 1)
    return new Response(
      JSON.stringify({
        data: null,
        error: "Insufficient credits",
      }),
      { status: 402 }
    );

  const body = await req.json();
  console.log("Received body:", body);
  const videoId = body.videoId;

  let transcript: Awaited<ReturnType<typeof fetchTranscript>>;

  try {
    transcript = await fetchTranscript(videoId);
  } catch (error) {
    console.error("Error processing request:", error);
    if (error instanceof Error)
      return new Response(JSON.stringify({ error: error.message }));
    return new Response(JSON.stringify({ error: "Error getting transcript." }));
  }

  const transformedData = transformData(transcript);

  let summary: Awaited<ReturnType<typeof generateSummary>>;

  try {
    summary = await generateSummary(transformedData.text, TEMPLATE);

    return new Response(JSON.stringify({ data: summary, error: null }));
  } catch (error) {
    console.error("Error processing request:", error);
    if (error instanceof Error)
      return new Response(JSON.stringify({ error: error.message }));
    return new Response(JSON.stringify({ error: "Error generating summary." }));
  }
}
