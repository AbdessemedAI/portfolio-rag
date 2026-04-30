"""
rag_engine.py — Retrieval-Augmented Generation logic.

Flow:
  1. Embed user question with sentence-transformers
  2. Retrieve top-K chunks from Chroma (cosine similarity)
  3. Check relevance: if best distance > threshold -> off-topic refusal
  4. Build prompt with retrieved context + conversation history
  5. Call Groq (Llama 3.3 70B) for generation
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

# Cosine distance threshold. Chroma returns distance = 1 - similarity.
# Lower distance = more similar. Tune between 0.9 and 1.2 after testing.
RELEVANCE_THRESHOLD = 1.5
TOP_K = 12

OFF_TOPIC_RESPONSE = (
    "I only answer questions about Abderrahim's background, education, projects, "
    "skills, and professional experience. Feel free to ask me about those — for "
    "example, his work on 3D Gaussian Splatting, his internships, or his availability!"
)

SYSTEM_PROMPT = """You are a helpful assistant representing Abderrahim Abdessemed on his portfolio website. Your job is to answer visitors' questions about Abderrahim using the context provided below.

STRICT RULES:
1. ALWAYS use the context below to answer. The context contains Abderrahim's full profile — projects, internships, skills, education, and more.
2. When asked about projects, LIST ALL of them from the context. Never say you don't have information if the context contains it.
3. When asked about internships, LIST ALL of them from the context.
4. Do NOT invent facts not in the context.
5. If the question is not about Abderrahim at all (general knowledge, coding help, other people, current events), reply EXACTLY: "{off_topic}"
6. If the context truly does not contain the answer, say: "I don't have that specific detail — you can reach Abderrahim at abdessemed.abderrahim0@gmail.com."
7. Speak in third person ("He has...", "His projects include...").
8. Be thorough when listing things — always give complete lists, not partial ones.

CONTEXT:
{context}
"""


class RAGEngine:
    def __init__(self):
        # Embedding function (local, free)
        self.embed_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
            model_name=EMBEDDING_MODEL
        )

        # Chroma client
        self.chroma_client = chromadb.PersistentClient(path=CHROMA_DIR)
        self.collection = self.chroma_client.get_collection(
            name=COLLECTION_NAME,
            embedding_function=self.embed_fn,
        )

        # Groq client
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise RuntimeError("GROQ_API_KEY environment variable is not set.")
        self.groq = Groq(api_key=api_key)

    def retrieve(self, query: str, k: int = TOP_K):
        """Return (chunks, metadatas, distances, is_relevant)."""
        results = self.collection.query(query_texts=[query], n_results=k)

        chunks = results["documents"][0] if results["documents"] else []
        metadatas = results["metadatas"][0] if results["metadatas"] else []
        distances = results["distances"][0] if results["distances"] else []

        # If the top result is too far, treat as off-topic
        is_relevant = bool(distances) and distances[0] < RELEVANCE_THRESHOLD

        return chunks, metadatas, distances, is_relevant

    def build_messages(self, query: str, context_chunks: list[str], history: list[dict]):
        """Assemble the final message list for Groq."""
        context = "\n\n---\n\n".join(context_chunks) if context_chunks else "(no context)"
        system = SYSTEM_PROMPT.format(context=context, off_topic=OFF_TOPIC_RESPONSE)

        messages = [{"role": "system", "content": system}]

        # Include short conversation history (last 6 turns)
        for turn in history[-6:]:
            if turn.get("role") in ("user", "assistant") and turn.get("content"):
                messages.append({"role": turn["role"], "content": turn["content"]})

        messages.append({"role": "user", "content": query})
        return messages

    def answer(self, query: str, history: list[dict] | None = None) -> dict:
        """Non-streaming answer. Returns dict with answer + sources."""
        history = history or []
        chunks, metadatas, distances, is_relevant = self.retrieve(query)

        if not is_relevant:
            return {
                "answer": OFF_TOPIC_RESPONSE,
                "sources": [],
                "off_topic": True,
            }

        messages = self.build_messages(query, chunks, history)
        completion = self.groq.chat.completions.create(
            model=LLM_MODEL,
            messages=messages,
            temperature=0.3,
            max_tokens=512,
        )
        answer_text = completion.choices[0].message.content.strip()

        sources = [
            {"source": m.get("source", "unknown"), "distance": round(d, 3)}
            for m, d in zip(metadatas, distances)
        ]

        return {
            "answer": answer_text,
            "sources": sources,
            "off_topic": False,
        }

    def answer_stream(self, query: str, history: list[dict] | None = None) -> Iterator[str]:
        """Streaming variant — yields token chunks as strings."""
        history = history or []
        chunks, _, _, is_relevant = self.retrieve(query)

        if not is_relevant:
            yield OFF_TOPIC_RESPONSE
            return

        messages = self.build_messages(query, chunks, history)
        stream = self.groq.chat.completions.create(
            model=LLM_MODEL,
            messages=messages,
            temperature=0.3,
            max_tokens=512,
            stream=True,
        )
        for chunk in stream:
            delta = chunk.choices[0].delta.content
            if delta:
                yield delta
