import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Abderrahim Abdessemed — AI Engineer Portfolio",
  description:
    "Portfolio of Abderrahim Abdessemed, AI and Data Science Engineer. Chat with an AI assistant or browse the classic CV.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
