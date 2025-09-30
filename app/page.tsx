"use client";

import { useState } from "react";

type Driver = { title: string; quickFix: string };
type ApiResponse =
  | { ok: true; data: { summary?: string; drivers: Driver[] } }
  | { ok: false; error: string; data?: { summary?: string; drivers?: Driver[] } };

export default function HomePage() {
  const [feedbackText, setFeedbackText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Driver[] | null>(null);
  const [summary, setSummary] = useState<string | undefined>(undefined);

  const gumroadLink = process.env.NEXT_PUBLIC_GUMROAD_LINK ?? "#";

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setSummary(undefined);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedbackText }),
      });
      const data: ApiResponse = await res.json();
      if (!data.ok) {
        setError(data.error || "Something went wrong.");
        if (data.data?.drivers?.length) {
          setResult(data.data.drivers);
          setSummary(data.data.summary);
        }
        return;
      }
      setResult(data.data.drivers);
      setSummary(data.data.summary);
    } catch (e) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const disabled = loading || feedbackText.trim().length < 10;

  return (
    <main className="min-h-screen flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-2xl">
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200 p-6 sm:p-8 transition-all duration-200 hover:shadow-md">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            Churn Detective
          </h1>
          <p className="mt-1 text-sm text-neutral-600">
            Paste customer feedback. Get a free snapshot: top 3 churn drivers and one quick fix each.
          </p>

          <div className="mt-5">
            <label htmlFor="feedback" className="sr-only">
              Customer feedback
            </label>
            <textarea
              id="feedback"
              placeholder="Paste feedback here (surveys, support logs, NPS comments)..."
              className="focus-ring w-full min-h-[160px] rounded-lg border border-neutral-300 bg-white p-3 text-sm placeholder-neutral-400 shadow-inner"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
            />
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={handleAnalyze}
              disabled={disabled}
              className={`focus-ring inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-white transition active:translate-y-[1px]
                ${disabled ? "bg-neutral-300 cursor-not-allowed" : "bg-neutral-900 hover:bg-neutral-800"}
              `}
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Analyzing…
                </span>
              ) : (
                "Analyze Churn"
              )}
            </button>

            <a
              href={gumroadLink}
              target="_blank"
              rel="noreferrer"
              className="focus-ring inline-flex items-center rounded-lg border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 transition"
            >
              Unlock Full Retention Plan – $59
            </a>
          </div>

          {error && (
            <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {(summary || result) && (
            <div className="mt-6 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
              {summary && (
                <p className="text-sm text-neutral-700 mb-3">{summary}</p>
              )}
              {result && result.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold text-neutral-900">
                    Top churn drivers
                  </h2>
                  <ol className="mt-2 space-y-2 text-sm">
                    {result.map((d, i) => (
                      <li key={i} className="rounded-md bg-white p-3 ring-1 ring-neutral-200">
                        <div className="font-medium">{i + 1}. {d.title}</div>
                        <div className="text-neutral-700 mt-1">
                          Quick fix: {d.quickFix}
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-neutral-500">
          Built for quick signal. For a full plan with plays, segments, and metrics, use the CTA above.
        </p>
      </div>
    </main>
  );
}