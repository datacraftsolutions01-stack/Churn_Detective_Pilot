"use client";

export default function ThanksPage() {
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "support@example.com";
  const subject = encodeURIComponent("Churn Detective – Dataset Upload");
  const body = encodeURIComponent(
    [
      "Hi Churn Detective Team,",
      "",
      "I just purchased the Retention Plan.",
      "Here is my dataset link/attachment and any context you need:",
      "",
      "• Data link:",
      "• Product/segment:",
      "• Primary churn risk:",
      "",
      "Thanks!"
    ].join("\n")
  );

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-sm ring-1 ring-neutral-200 text-center">
        <h1 className="text-2xl font-semibold">Thanks for your purchase!</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Send your dataset so we can build your full retention plan.
        </p>
        <a
          className="mt-5 inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          href={`mailto:${email}?subject=${subject}&body=${body}`}
        >
          Email dataset
        </a>
      </div>
    </main>
  );
}