# Churn Detective

Paste customer feedback → get a free snapshot: top 3 churn drivers + a quick fix each.

## Stack
- Next.js 14 (App Router), TypeScript
- Tailwind CSS
- LLM: Gemini 1.5 Flash (default) or OpenAI gpt-4o-mini (via env)

## Setup
1. `cp .env.example .env.local` and set:
   - `LLM_PROVIDER` = `GEMINI` or `OPENAI`
   - `OPENAI_API_KEY` or `GEMINI_API_KEY`
   - `NEXT_PUBLIC_GUMROAD_LINK`, `NEXT_PUBLIC_CONTACT_EMAIL`
2. `pnpm i` (or `npm i`, `yarn`)
3. `pnpm dev` and open http://localhost:3000

## Deploy (Vercel)
- Import repo, set the same env vars in Project Settings → Environment Variables.
- Build output: Next.js defaults; no extra config required.

## API
POST `/api/generate` with JSON:
```json
{ "feedbackText": "..." }
```
Returns:
```json
{
  "ok": true,
  "data": {
    "summary": "…",
    "drivers": [
      { "title": "…", "quickFix": "…" }
    ]
  }
}
```

## Notes
- Short, skimmable outputs (<= 150 words)
- Basic error handling; disabled state while loading
- Minimalist UI with a single accent (emerald-600) and subtle motion
