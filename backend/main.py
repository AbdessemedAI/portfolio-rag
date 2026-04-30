"""
main.py — FastAPI app exposing the RAG chatbot + voice transcription.
"""

import os
import io
import json
import subprocess
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

rag: Optional[RAGEngine] = None


@app.on_event("startup")
def startup():
    global rag
    # Always rebuild the index from knowledge_base/ at startup
    # This ensures any update to .md files is picked up immediately
    print("🔄 Rebuilding knowledge base index...")
    result = subprocess.run(
        ["python", "ingest.py"],
        capture_output=True,
        text=True
    )
    print(result.stdout)
    if result.returncode != 0:
        print("❌ ingest.py error:", result.stderr)
    else:
        print("✅ Index rebuilt successfully.")
    rag = RAGEngine()
    print("✅ RAG engine ready.")


# ---------------- Schemas ----------------

class ChatTurn(BaseModel):
    role: str
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
        chunks, metadatas, distances, is_relevant = rag.retrieve(req.message)
        sources = [
            {"source": m.get("source", "unknown"), "distance": round(d, 3)}
            for m, d in zip(metadatas, distances)
        ]
        yield f"data: {json.dumps({'type': 'sources', 'sources': sources, 'off_topic': not is_relevant})}\n\n"

        for token in rag.answer_stream(req.message, history=history):
            yield f"data: {json.dumps({'type': 'token', 'content': token})}\n\n"

        yield f"data: {json.dumps({'type': 'done'})}\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")


@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
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
