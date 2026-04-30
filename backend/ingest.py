"""
ingest.py — Builds the ChromaDB index from knowledge_base/ files.
Strategy:
  - 00_summary.md is stored as ONE chunk (never split) so it's always retrievable
  - Other files are chunked by H2 sections
"""

import os
import glob
import chromadb
from chromadb.utils import embedding_functions

KNOWLEDGE_DIR = "knowledge_base"
CHROMA_DIR = "chroma_db"
COLLECTION_NAME = "portfolio"
EMBEDDING_MODEL = "all-MiniLM-L6-v2"


def chunk_file(filename: str, text: str) -> list[str]:
    """
    00_summary.md → always one single chunk (it's an index, must stay whole).
    Other files → split by H3 sections (###), fallback to H2 (##).
    """
    if "00_summary" in filename:
        # Never split the summary — return as one chunk
        return [text.strip()]

    chunks = []
    current = []
    for line in text.split("\n"):
        if (line.startswith("### ") or line.startswith("## ")) and current:
            chunk = "\n".join(current).strip()
            if len(chunk) > 30:
                chunks.append(chunk)
            current = [line]
        else:
            current.append(line)
    if current:
        chunk = "\n".join(current).strip()
        if len(chunk) > 30:
            chunks.append(chunk)

    return chunks


def main():
    embed_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
        model_name=EMBEDDING_MODEL
    )

    client = chromadb.PersistentClient(path=CHROMA_DIR)

    try:
        client.delete_collection(COLLECTION_NAME)
    except Exception:
        pass

    collection = client.create_collection(
        name=COLLECTION_NAME,
        embedding_function=embed_fn,
        metadata={"hnsw:space": "cosine"},
    )

    all_chunks = []
    all_metadata = []
    all_ids = []

    md_files = sorted(glob.glob(os.path.join(KNOWLEDGE_DIR, "*.md")))
    if not md_files:
        print(f"❌ No markdown files found in {KNOWLEDGE_DIR}/")
        return

    for filepath in md_files:
        filename = os.path.basename(filepath)
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()

        chunks = chunk_file(filename, content)
        print(f"📄 {filename}: {len(chunks)} chunks")

        for i, chunk in enumerate(chunks):
            all_chunks.append(chunk)
            all_metadata.append({"source": filename, "chunk_index": i})
            all_ids.append(f"{filename}_{i}")

    collection.add(documents=all_chunks, metadatas=all_metadata, ids=all_ids)
    print(f"\n✅ Indexed {len(all_chunks)} total chunks into '{COLLECTION_NAME}'")


if __name__ == "__main__":
    main()
