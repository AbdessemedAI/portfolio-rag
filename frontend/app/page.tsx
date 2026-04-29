import Link from "next/link";
import { MessageSquare, FileText, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      {/* Header */}
      <div className="text-center mb-16 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 mb-6">
          <Sparkles className="w-4 h-4 text-brand-500" />
          <span className="text-sm text-brand-500 font-medium">
            Welcome to my portfolio
          </span>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Abderrahim Abdessemed
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
          AI & Data Science Engineer · Paris-Saclay University
        </p>
        <p className="mt-4 text-slate-500">
          How would you like to explore my profile?
        </p>
      </div>

      {/* Two-choice cards */}
      <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl">
        {/* Chatbot card */}
        <Link
          href="/chat"
          className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-brand-900/40 via-slate-900 to-slate-950 p-8 hover:border-brand-500/50 transition-all duration-300 hover:scale-[1.02]"
        >
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-brand-500/20 rounded-full blur-3xl group-hover:bg-brand-500/30 transition-all" />
          <div className="relative">
            <div className="w-14 h-14 rounded-xl bg-brand-500/20 flex items-center justify-center mb-5">
              <MessageSquare className="w-7 h-7 text-brand-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Talk to my AI assistant</h2>
            <p className="text-slate-400 mb-6">
              Ask anything about my background, projects, or availability.
              Powered by RAG + Llama 3.3. Supports voice.
            </p>
            <div className="flex items-center gap-2 text-brand-500 font-medium">
              Start chatting
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </div>
          </div>
        </Link>

        {/* Portfolio card */}
        <Link
          href="/portfolio"
          className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-800/40 via-slate-900 to-slate-950 p-8 hover:border-slate-500/50 transition-all duration-300 hover:scale-[1.02]"
        >
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-slate-500/10 rounded-full blur-3xl group-hover:bg-slate-500/20 transition-all" />
          <div className="relative">
            <div className="w-14 h-14 rounded-xl bg-slate-700/50 flex items-center justify-center mb-5">
              <FileText className="w-7 h-7 text-slate-300" />
            </div>
            <h2 className="text-2xl font-bold mb-2">View classic portfolio</h2>
            <p className="text-slate-400 mb-6">
              Browse my CV the traditional way — education, projects,
              experience, and skills neatly laid out.
            </p>
            <div className="flex items-center gap-2 text-slate-300 font-medium">
              Open portfolio
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </div>
          </div>
        </Link>
      </div>

      <footer className="mt-16 text-sm text-slate-600">
        Built with Next.js · FastAPI · ChromaDB · Groq · Whisper
      </footer>
    </main>
  );
}
