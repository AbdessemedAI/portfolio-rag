// lib/api.ts — helpers that talk to the FastAPI backend

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type ChatTurn = { role: "user" | "assistant"; content: string };

export type ChatResponse = {
  answer: string;
  sources: { source: string; distance: number }[];
  off_topic: boolean;
};

// --- Non-streaming chat (simpler, good fallback) ---
export async function sendChat(
  message: string,
  history: ChatTurn[]
): Promise<ChatResponse> {
  const res = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
  });
  if (!res.ok) throw new Error(`Chat failed: ${res.status}`);
  return res.json();
}

// --- Streaming chat via Server-Sent Events ---
export async function streamChat(
  message: string,
  history: ChatTurn[],
  onToken: (token: string) => void,
  onSources: (sources: { source: string; distance: number }[], offTopic: boolean) => void,
  onDone: () => void,
  onError: (err: Error) => void
) {
  try {
    const res = await fetch(`${API_URL}/chat/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history }),
    });
    if (!res.ok || !res.body) throw new Error(`Stream failed: ${res.status}`);

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      // Parse SSE lines
      const lines = buffer.split("\n\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const match = line.match(/^data: (.+)$/m);
        if (!match) continue;
        try {
          const payload = JSON.parse(match[1]);
          if (payload.type === "sources") {
            onSources(payload.sources || [], payload.off_topic || false);
          } else if (payload.type === "token") {
            onToken(payload.content || "");
          } else if (payload.type === "done") {
            onDone();
          }
        } catch {
          /* ignore malformed lines */
        }
      }
    }
    onDone();
  } catch (err) {
    onError(err as Error);
  }
}

// --- Transcribe audio via backend (Whisper on Groq) ---
export async function transcribeAudio(blob: Blob): Promise<string> {
  const form = new FormData();
  form.append("file", blob, "recording.webm");
  const res = await fetch(`${API_URL}/transcribe`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error(`Transcribe failed: ${res.status}`);
  const data = await res.json();
  return data.text || "";
}
