"""
ingest.py — One-time script to chunk knowledge base files and build the ChromaDB index.
Run once before starting the server, or whenever you update the knowledge_base/ files.

Usage:  python ingest.py
"""

import os
import glob
import chromadb
from chromadb.utils import embedding_functions

KNOWLEDGE_DIR = "knowledge_base"
CHROMA_DIR = "chroma_db"
COLLECTION_NAME = "portfolio"
EMBEDDING_MODEL = "all-MiniLM-L6-v2"  # small, fast, free, good enough


def chunk_markdown(text: str, max_chars: int = 800) -> list[str]:
    """
    Split markdown by H2 sections, then further split long sections by paragraphs.
    Keeps semantic units (a project, a skill category) together when possible.
    """
    # Split on H2 headers (## ) but keep the header with its section
    sections = []
    current = []
    for line in text.split("\n"):
        if line.startswith("## ") and current:
            sections.append("\n".join(current).strip())
            current = [line]
        else:
            current.append(line)
    if current:
        sections.append("\n".join(current).strip())

    # Further split any section that's too long
    chunks = []
    for section in sections:
        if len(section) <= max_chars:
            chunks.append(section)
        else:
            # Split by paragraphs, repacking until max_chars
            paragraphs = [p.strip() for p in section.split("\n\n") if p.strip()]
            buf = ""
            for p in paragraphs:
                if len(buf) + len(p) + 2 <= max_chars:
                    buf = f"{buf}\n\n{p}" if buf else p
                else:
                    if buf:
                        chunks.append(buf)
                    buf = p
            if buf:
                chunks.append(buf)

    return [c for c in chunks if len(c.strip()) > 20]


def main():
    # Setup embedding function (runs locally, fully free)
    embed_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
        model_name=EMBEDDING_MODEL
    )

    # Init persistent Chroma client
    client = chromadb.PersistentClient(path=CHROMA_DIR)

    # Reset the collection each run so re-ingest is clean
    try:
        client.delete_collection(COLLECTION_NAME)
    except Exception:
        pass

    collection = client.create_collection(
        name=COLLECTION_NAME,
        embedding_function=embed_fn,
        metadata={"hnsw:space": "cosine"},
    )

    # Load & chunk all markdown files
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

        chunks = chunk_markdown(content)
        print(f"📄 {filename}: {len(chunks)} chunks")

        for i, chunk in enumerate(chunks):
            all_chunks.append(chunk)
            all_metadata.append({"source": filename, "chunk_index": i})
            all_ids.append(f"{filename}_{i}")

    # Add to collection (Chroma handles embedding automatically)
    collection.add(documents=all_chunks, metadatas=all_metadata, ids=all_ids)

    print(f"\n✅ Indexed {len(all_chunks)} chunks into '{COLLECTION_NAME}'")
    print(f"   Stored at: {os.path.abspath(CHROMA_DIR)}")


if __name__ == "__main__":
    main()
