"""
main.py — FastAPI app exposing the RAG chatbot + voice transcription.

Endpoints:
  GET  /              Health check
  POST /chat          Non-streaming chat
  POST /chat/stream   Streaming chat (Server-Sent Events)
  POST /transcribe    Audio -> text via Groq Whisper
"""

import os
import io
import json
from typing import Optional

from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from groq import Groq

load_dotenv()

from rag_engine import RAGEngine  # noqa: E402

app = FastAPI(title="Abderrahim Portfolio RAG API", version="1.0.0")

# CORS
allowed = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in allowed],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Load RAG engine once at startup
rag: Optional[RAGEngine] = None


@app.on_event("startup")
def startup():
    global rag
    rag = RAGEngine()
    print("✅ RAG engine ready.")


# ---------------- Schemas ----------------

class ChatTurn(BaseModel):
    role: str  # "user" | "assistant"
    content: str


class ChatRequest(BaseModel):
    message: str
    history: list[ChatTurn] = []


# ---------------- Endpoints ----------------

@app.get("/")
def root():
    return {"status": "ok", "service": "portfolio-rag", "model": "llama-3.3-70b"}


@app.post("/chat")
def chat(req: ChatRequest):
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="Empty message.")
    result = rag.answer(
        req.message,
        history=[t.model_dump() for t in req.history],
    )
    return result


@app.post("/chat/stream")
def chat_stream(req: ChatRequest):
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="Empty message.")

    history = [t.model_dump() for t in req.history]

    def event_stream():
        # First, send the source info (non-streaming part)
        chunks, metadatas, distances, is_relevant = rag.retrieve(req.message)
        sources = [
            {"source": m.get("source", "unknown"), "distance": round(d, 3)}
            for m, d in zip(metadatas, distances)
        ]
        yield f"data: {json.dumps({'type': 'sources', 'sources': sources, 'off_topic': not is_relevant})}\n\n"

        # Then stream tokens
        for token in rag.answer_stream(req.message, history=history):
            yield f"data: {json.dumps({'type': 'token', 'content': token})}\n\n"

        yield f"data: {json.dumps({'type': 'done'})}\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")


@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    """
    Transcribe an audio file using Groq's Whisper endpoint (free tier).
    Accepts: webm, mp3, wav, m4a, ogg
    """
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY missing")

    audio_bytes = await file.read()
    if not audio_bytes:
        raise HTTPException(status_code=400, detail="Empty audio file")

    client = Groq(api_key=api_key)
    try:
        transcription = client.audio.transcriptions.create(
            file=(file.filename or "audio.webm", io.BytesIO(audio_bytes)),
            model="whisper-large-v3-turbo",
            response_format="json",
        )
        return {"text": transcription.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcription failed: {e}")
