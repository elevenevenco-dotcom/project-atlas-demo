import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Project Atlas (Demo) — Point. Describe. Transform.",
  description:
    "A fully offline demo: click a spot on an image, describe the change, and see a simulated edit — no account, no server, no API keys.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
