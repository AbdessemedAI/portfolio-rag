"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Bot,
  User,
  Sparkles,
} from "lucide-react";
import {
  streamChat,
  transcribeAudio,
  type ChatTurn,
} from "@/lib/api";

type Message = {
  role: "user" | "assistant";
  content: string;
  sources?: { source: string; distance: number }[];
  offTopic?: boolean;
};

const SUGGESTIONS = [
  "Tell me about your 3DGS project",
  "What's your availability?",
  "Describe your experience with RAG",
  "Why Paris-Saclay?",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm Abderrahim's AI assistant. Ask me anything about his background, projects, skills, or availability. You can type or use the microphone 🎤",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [recording, setRecording] = useState(false);
  const [voiceOn, setVoiceOn] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  // --- Send a message ---
  async function handleSend(text?: string) {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const history: ChatTurn[] = messages
      .filter((m) => m.content)
      .map((m) => ({ role: m.role, content: m.content }));

    const userMsg: Message = { role: "user", content };
    const assistantMsg: Message = { role: "assistant", content: "" };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput("");
    setLoading(true);

    let fullAnswer = "";
    let finalSources: { source: string; distance: number }[] = [];
    let finalOffTopic = false;

    await streamChat(
      content,
      history,
      (token) => {
        fullAnswer += token;
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = {
            ...copy[copy.length - 1],
            content: fullAnswer,
          };
          return copy;
        });
      },
      (sources, offTopic) => {
        finalSources = sources;
        finalOffTopic = offTopic;
      },
      () => {
        // done
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = {
            ...copy[copy.length - 1],
            sources: finalSources,
            offTopic: finalOffTopic,
          };
          return copy;
        });
        setLoading(false);
        if (voiceOn && fullAnswer) speak(fullAnswer);
      },
      (err) => {
        console.error(err);
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = {
            role: "assistant",
            content:
              "⚠️ Sorry, I couldn't reach the server. Please try again in a moment.",
          };
          return copy;
        });
        setLoading(false);
      }
    );
  }

  // --- Text-to-speech (browser native, free) ---
  function speak(text: string) {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1.05;
    u.pitch = 1;
    u.lang = "en-US";
    window.speechSynthesis.speak(u);
  }

  function stopSpeaking() {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }

  // --- Voice recording ---
  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      mr.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setTranscribing(true);
        try {
          const text = await transcribeAudio(blob);
          if (text.trim()) {
            await handleSend(text);
          }
        } catch (err) {
          console.error(err);
          alert("Transcription failed. Please try typing instead.");
        } finally {
          setTranscribing(false);
        }
      };
      mr.start();
      mediaRecorderRef.current = mr;
      setRecording(true);
    } catch (err) {
      console.error(err);
      alert("Microphone access denied or unavailable.");
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  }

  function toggleRecording() {
    if (recording) stopRecording();
    else startRecording();
  }

  function toggleVoice() {
    if (voiceOn) stopSpeaking();
    setVoiceOn((v) => !v);
  }

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse-slow" />
            <span className="text-sm text-slate-300 font-medium">
              Abderrahim's AI
            </span>
          </div>
          <button
            onClick={toggleVoice}
            className={`p-2 rounded-lg border transition ${
              voiceOn
                ? "bg-brand-500/20 border-brand-500/50 text-brand-500"
                : "border-slate-800 text-slate-400 hover:text-white"
            }`}
            title={voiceOn ? "Voice output: ON" : "Voice output: OFF"}
          >
            {voiceOn ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>
        </div>
      </header>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-6"
        style={{ maxHeight: "calc(100vh - 180px)" }}
      >
        <div className="max-w-3xl mx-auto space-y-5">
          {messages.map((m, i) => (
            <MessageBubble key={i} msg={m} />
          ))}

          {/* Suggestion chips shown only on first-message state */}
          {messages.length === 1 && !loading && (
            <div className="flex flex-wrap gap-2 pt-4">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="px-3 py-1.5 text-sm rounded-full border border-slate-700 bg-slate-900/60 text-slate-300 hover:border-brand-500/50 hover:text-white transition"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {transcribing && (
            <div className="text-sm text-slate-400 italic">
              Transcribing your voice…
            </div>
          )}
        </div>
      </div>

      {/* Input bar */}
      <div className="border-t border-slate-800 bg-slate-950/80 backdrop-blur p-4">
        <div className="max-w-3xl mx-auto flex gap-2 items-end">
          <button
            onClick={toggleRecording}
            disabled={loading || transcribing}
            className={`p-3 rounded-xl border transition ${
              recording
                ? "bg-red-500 border-red-500 text-white mic-recording"
                : "border-slate-700 bg-slate-900 text-slate-300 hover:border-brand-500/50 hover:text-white disabled:opacity-40"
            }`}
            title={recording ? "Stop recording" : "Record voice message"}
          >
            {recording ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={
              recording
                ? "Listening..."
                : "Ask about Abderrahim's projects, skills, availability..."
            }
            rows={1}
            disabled={loading || recording || transcribing}
            className="flex-1 resize-none rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 disabled:opacity-60"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="p-3 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-40 disabled:cursor-not-allowed text-white transition"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="max-w-3xl mx-auto mt-2 text-xs text-slate-500 text-center">
          Powered by RAG + Llama 3.3 · This assistant only answers questions
          about Abderrahim.
        </p>
      </div>
    </main>
  );
}

// --- Message bubble ---
function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  return (
    <div
      className={`flex gap-3 animate-fade-in ${
        isUser ? "flex-row-reverse" : ""
      }`}
    >
      <div
        className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${
          isUser
            ? "bg-slate-700"
            : "bg-gradient-to-br from-brand-500 to-brand-700"
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>
      <div
        className={`flex-1 max-w-[85%] ${isUser ? "items-end" : "items-start"}`}
      >
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
            isUser
              ? "bg-brand-600 text-white ml-auto"
              : "bg-slate-900 border border-slate-800 text-slate-100"
          }`}
        >
          {msg.content || (
            <span className="inline-flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" />
              <span
                className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce"
                style={{ animationDelay: "0.1s" }}
              />
              <span
                className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce"
                style={{ animationDelay: "0.2s" }}
              />
            </span>
          )}
        </div>

        {/* Show sources used for transparency */}
        {!isUser && msg.sources && msg.sources.length > 0 && !msg.offTopic && (
          <details className="mt-2 text-xs text-slate-500 group">
            <summary className="cursor-pointer hover:text-slate-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Sources retrieved ({msg.sources.length})
            </summary>
            <div className="mt-1.5 pl-4 space-y-0.5">
              {msg.sources.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-slate-600" />
                  <span className="font-mono">{s.source}</span>
                  <span className="text-slate-600">
                    (distance: {s.distance})
                  </span>
                </div>
              ))}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}
