FROM python:3.11-slim

# HF Spaces expects the app on port 7860
ENV PORT=7860 \
    PYTHONUNBUFFERED=1 \
    HF_HOME=/tmp/hf_cache \
    SENTENCE_TRANSFORMERS_HOME=/tmp/st_cache

WORKDIR /app

# System deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Pre-download the sentence-transformer model and build the index at build time
RUN python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')"
RUN python ingest.py

EXPOSE 7860

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
