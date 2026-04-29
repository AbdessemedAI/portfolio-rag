# Portfolio RAG Backend

FastAPI + ChromaDB + Groq (Llama 3.3 70B) + Whisper.

## Local development

```bash
cd backend
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# edit .env and paste your Groq key from https://console.groq.com/keys

python ingest.py                    # build the vector index (once)
uvicorn main:app --reload --port 8000
```

Test:
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Tell me about the 3DGS project","history":[]}'
```

## Deploy free on Hugging Face Spaces

1. Create a new Space → **Docker** template → SDK: blank.
2. Push this `backend/` folder as the Space's repo (or upload via web).
3. In Space **Settings → Variables and secrets**, add:
   - `GROQ_API_KEY` = your key
   - `ALLOWED_ORIGINS` = `https://your-portfolio.vercel.app,http://localhost:3000`
4. The Space builds the Docker image and runs on port 7860.
5. Your backend URL will be `https://<your-username>-<space-name>.hf.space`.

## Update knowledge base

Edit files in `knowledge_base/`, then:
```bash
python ingest.py         # rebuild index
# or push to HF Space — it rebuilds automatically
```
