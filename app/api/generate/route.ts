"use client";

import { NextRequest, NextResponse } from "next/server";
import { analyzeChurn } from "../../../lib/llm";

export async function POST(req: NextRequest) {
  try {
    const { feedbackText } = await req.json();
    if (!feedbackText || typeof feedbackText !== "string" || feedbackText.trim().length < 10) {
      return NextResponse.json(
        { ok: false, error: "Please paste at least a few lines of feedback." },
        { status: 400 }
      );
    }

    try {
      const data = await analyzeChurn(feedbackText);
      // Ensure max 3 drivers
      const drivers = (data.drivers || []).slice(0, 3);
      return NextResponse.json({ ok: true, data: { summary: data.summary, drivers } });
    } catch (modelErr: any) {
      // Fallback: lightweight heuristic
      const fallback = {
        summary: "Likely drivers: support delays, bugs, value/pricing mismatch.",
        drivers: [
          { title: "Slow/unclear support", quickFix: "Add 24–48h SLA, macros for top issues, status auto-replies." },
          { title: "Bugs/instability", quickFix: "Triage top 3 crashers; hotfix; add release notes + in‑app banner." },
          { title: "Pricing/value confusion", quickFix: "Clarify tiers; add ROI examples; offer 1-month credit." }
        ]
      };
      return NextResponse.json({ ok: false, error: "Model unavailable. Showing a quick snapshot.", data: fallback }, { status: 200 });
    }
  } catch (e) {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
}