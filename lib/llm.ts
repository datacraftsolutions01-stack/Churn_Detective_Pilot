import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

type Driver = { title: string; quickFix: string };
type Output = { summary?: string; drivers: Driver[] };

const SYSTEM_RULES = `
You are Churn Detective. Analyze customer feedback and output concise, skimmable insights.
Constraints:
- Total response <= 150 words.
- Return ONLY valid JSON with this exact shape:
  {
    "summary": string (<= 25 words),
    "drivers": [
      { "title": string, "quickFix": string },
      { "title": string, "quickFix": string },
      { "title": string, "quickFix": string }
    ]
  }
- "drivers" must contain up to 3 items, ranked by impact. Keep phrasing tight; avoid fluff.
- If fewer than 3 distinct issues exist, still return up to 3 based on strongest signals.
`;

const USER_PREFIX = `Feedback:\n`;

function buildPrompt(feedback: string) {
  return `${SYSTEM_RULES}\n${USER_PREFIX}${feedback}`;
}

function parseJson<T>(text: string): T {
  // Extract JSON block if model adds extra characters
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  const candidate = start >= 0 && end >= start ? text.slice(start, end + 1) : text;
  return JSON.parse(candidate);
}

export async function analyzeChurn(feedback: string): Promise<Output> {
  const provider = (process.env.LLM_PROVIDER || "GEMINI").toUpperCase();
  const prompt = buildPrompt(feedback);

  if (provider === "OPENAI") {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY missing");
    const client = new OpenAI({ apiKey });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a precise JSON-only assistant." },
        { role: "user", content: prompt }
      ],
      temperature: 0.2,
    });

    const text = completion.choices[0]?.message?.content || "{}";
    const parsed = parseJson<Output>(text);
    return {
      summary: parsed.summary?.slice(0, 200),
      drivers: (parsed.drivers || []).slice(0, 3).map(d => ({
        title: d.title?.slice(0, 80) || "Driver",
        quickFix: d.quickFix?.slice(0, 120) || "Quick fix"
      }))
    };
  }

  if (provider === "GEMINI") {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY missing");
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = parseJson<Output>(text);
    return {
      summary: parsed.summary?.slice(0, 200),
      drivers: (parsed.drivers || []).slice(0, 3).map(d => ({
        title: d.title?.slice(0, 80) || "Driver",
        quickFix: d.quickFix?.slice(0, 120) || "Quick fix"
      }))
    };
  }

  throw new Error(`Unsupported LLM_PROVIDER: ${provider}`);
}