"""
rag_engine.py — RAG logic with guaranteed summary injection.

The core insight: all-MiniLM-L6-v2 has a 512-token limit.
A large summary chunk gets truncated during embedding → retrieval misses it.

Fix: Always inject the full summary file directly into every prompt,
then add retrieved chunks on top for specific details.
This guarantees the LLM always sees all projects and internships.
"""

import os
from typing import Iterator
import chromadb
from chromadb.utils import embedding_functions
from groq import Groq

CHROMA_DIR = "chroma_db"
COLLECTION_NAME = "portfolio"
EMBEDDING_MODEL = "all-MiniLM-L6-v2"
LLM_MODEL = "llama-3.3-70b-versatile"
KNOWLEDGE_DIR = "knowledge_base"
SUMMARY_FILE = "00_summary.md"

RELEVANCE_THRESHOLD = 1.6
TOP_K = 6

OFF_TOPIC_RESPONSE = (
    "I only answer questions about Abderrahim's background, education, projects, "
    "skills, and professional experience. Feel free to ask me about those — for "
    "example, his work on 3D Gaussian Splatting, his internships, or his availability!"
)

SYSTEM_PROMPT = """You are the AI assistant on Abderrahim Abdessemed's portfolio website.

GUARANTEED REFERENCE (always accurate — use this for any list or overview question):
{summary}

ADDITIONAL DETAILS (retrieved for this specific question):
{context}

RULES:
1. For any question about projects or internships → use the GUARANTEED REFERENCE above. It lists everything.
2. For specific technical details → use the ADDITIONAL DETAILS section.
3. NEVER say you don't have information about his projects or internships — the guaranteed reference always has them.
4. If the question is completely unrelated to Abderrahim (weather, cooking, other people) → reply ONLY: "{off_topic}"
5. Answer in third person: "He has...", "His projects include...".
6. Be complete — when listing projects or internships, list ALL of them.
"""


class RAGEngine:
    def __init__(self):
        self.embed_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
            model_name=EMBEDDING_MODEL
        )
        self.chroma_client = chromadb.PersistentClient(path=CHROMA_DIR)
        self.collection = self.chroma_client.get_collection(
            name=COLLECTION_NAME,
            embedding_function=self.embed_fn,
        )
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise RuntimeError("GROQ_API_KEY environment variable is not set.")
        self.groq = Groq(api_key=api_key)

        # Load summary file once at startup — injected into every prompt
        summary_path = os.path.join(KNOWLEDGE_DIR, SUMMARY_FILE)
        if os.path.exists(summary_path):
            with open(summary_path, "r", encoding="utf-8") as f:
                self.summary = f.read().strip()
            print(f"✅ Summary loaded ({len(self.summary)} chars)")
        else:
            self.summary = "No summary file found."
            print("⚠️  00_summary.md not found")

    def retrieve(self, query: str, k: int = TOP_K):
        results = self.collection.query(query_texts=[query], n_results=k)
        chunks = results["documents"][0] if results["documents"] else []
        metadatas = results["metadatas"][0] if results["metadatas"] else []
        distances = results["distances"][0] if results["distances"] else []
        is_relevant = bool(distances) and distances[0] < RELEVANCE_THRESHOLD
        return chunks, metadatas, distances, is_relevant

    def build_messages(self, query: str, context_chunks: list[str], history: list[dict]):
        # Filter out the summary file from retrieved chunks (already injected)
        filtered = [
            c for c, m in zip(context_chunks, [{}] * len(context_chunks))
            if True  # keep all retrieved detail chunks
        ]
        context = "\n\n---\n\n".join(filtered) if filtered else "(no additional details)"

        system = SYSTEM_PROMPT.format(
            summary=self.summary,
            context=context,
            off_topic=OFF_TOPIC_RESPONSE,
        )

        messages = [{"role": "system", "content": system}]
        for turn in history[-6:]:
            if turn.get("role") in ("user", "assistant") and turn.get("content"):
                messages.append({"role": turn["role"], "content": turn["content"]})
        messages.append({"role": "user", "content": query})
        return messages

    def answer(self, query: str, history: list[dict] | None = None) -> dict:
        history = history or []
        chunks, metadatas, distances, is_relevant = self.retrieve(query)

        if not is_relevant:
            return {"answer": OFF_TOPIC_RESPONSE, "sources": [], "off_topic": True}

        messages = self.build_messages(query, chunks, history)
        completion = self.groq.chat.completions.create(
            model=LLM_MODEL,
            messages=messages,
            temperature=0.2,
            max_tokens=1024,
        )
        answer_text = completion.choices[0].message.content.strip()
        sources = [
            {"source": m.get("source", "unknown"), "distance": round(d, 3)}
            for m, d in zip(metadatas, distances)
        ]
        return {"answer": answer_text, "sources": sources, "off_topic": False}

    def answer_stream(self, query: str, history: list[dict] | None = None) -> Iterator[str]:
        history = history or []
        chunks, _, _, is_relevant = self.retrieve(query)

        if not is_relevant:
            yield OFF_TOPIC_RESPONSE
            return

        messages = self.build_messages(query, chunks, history)
        stream = self.groq.chat.completions.create(
            model=LLM_MODEL,
            messages=messages,
            temperature=0.2,
            max_tokens=1024,
            stream=True,
        )
        for chunk in stream:
            delta = chunk.choices[0].delta.content
            if delta:
                yield delta
