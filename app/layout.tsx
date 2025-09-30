import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Churn Detective",
  description: "Paste feedback → get top churn drivers + quick fixes.",
  metadataBase: new URL("https://example.com")
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}