# 🚀 Portfolio Website with RAG Chatbot — Complete Step-by-Step Guide

This guide assumes you have **never built a website before**. I'll walk you through every step.

**Total time:** ~3-4 hours for first-time setup.
**Total cost:** €0.

---

## 📦 What You're Building

A website with TWO parts working together:

1. **Frontend** (what visitors see) — a Next.js website
2. **Backend** (the "brain") — a Python server running the RAG chatbot

They live on **different servers**:
- Frontend → hosted on **Vercel** (free)
- Backend → hosted on **Hugging Face Spaces** (free)

---

## 🧰 PART 0 — Install the Tools You Need (once)

You need these installed on your computer. Skip any you already have.

### 1. Python 3.11 or newer
- Check: open a terminal and run `python --version` or `python3 --version`
- Install from: https://www.python.org/downloads/

### 2. Node.js 20 or newer
- Check: `node --version`
- Install from: https://nodejs.org/ (pick the "LTS" version)

### 3. Git
- Check: `git --version`
- Install from: https://git-scm.com/downloads

### 4. A code editor (VS Code recommended)
- Free download: https://code.visualstudio.com/

### 5. Accounts you'll need (all free)
- **GitHub** account → https://github.com/ (for hosting code)
- **Groq** account → https://console.groq.com/ (free LLM API)
- **Hugging Face** account → https://huggingface.co/ (backend hosting)
- **Vercel** account → https://vercel.com/ (frontend hosting) — sign up with your GitHub

---

## 🔑 PART 1 — Get Your Groq API Key

1. Go to https://console.groq.com/
2. Sign up (free, no credit card).
3. In the left menu click **"API Keys"**.
4. Click **"Create API Key"**, give it a name (e.g. "portfolio"), copy the key.
5. **SAVE IT somewhere safe** — you will only see it once. It starts with `gsk_`.

---

## 📁 PART 2 — Put the Project on Your Computer

I built two folders for you: `backend/` and `frontend/`.

### Where to put them

Create a folder on your computer — for example on your Desktop:

```
Desktop/
└── portfolio-rag/
    ├── backend/        ← Python code (the brain)
    └── frontend/       ← Next.js code (the website)
```

**Download all the files I created** and place them exactly like this structure. Every file I made belongs inside one of these two folders.

---

## 🧪 PART 3 — Test the Backend Locally (on your computer)

Let's make sure the chatbot works before we put it online.

### Step 3.1 — Open a terminal in the `backend/` folder

**Windows:** Right-click inside the `backend/` folder → "Open in Terminal" (or use PowerShell and `cd Desktop\portfolio-rag\backend`)
**Mac/Linux:** Open Terminal, then `cd ~/Desktop/portfolio-rag/backend`

### Step 3.2 — Create a Python virtual environment

A "virtual environment" is an isolated Python box so we don't mess up your system.

```bash
python -m venv .venv
```
Activate it:
- **Windows:** `.venv\Scripts\activate`
- **Mac/Linux:** `source .venv/bin/activate`

You should now see `(.venv)` at the start of your terminal line. ✅

### Step 3.3 — Install Python dependencies

```bash
pip install -r requirements.txt
```

This takes 2-5 minutes. It downloads FastAPI, ChromaDB, sentence-transformers, etc.

### Step 3.4 — Add your Groq API key

1. In the `backend/` folder, find the file `.env.example`.
2. Copy it and rename the copy to `.env` (just `.env`, no extension).
3. Open `.env` in VS Code and replace `gsk_your_key_here` with your real Groq key:

```
GROQ_API_KEY=gsk_abc123yourRealKeyHere
ALLOWED_ORIGINS=http://localhost:3000
```

Save the file.

### Step 3.5 — Build the knowledge base index

This reads your markdown files and creates the searchable database.

```bash
python ingest.py
```

You should see something like:
```
📄 01_about.md: 3 chunks
📄 02_education.md: 2 chunks
...
✅ Indexed 25 chunks into 'portfolio'
```

### Step 3.6 — Start the backend server

```bash
uvicorn main:app --reload --port 8000
```

You should see `✅ RAG engine ready.` and `Uvicorn running on http://0.0.0.0:8000`

**Leave this terminal running.** Open a browser and go to http://localhost:8000 — you should see `{"status":"ok",...}`. 🎉

### Step 3.7 — Test it with a real question

Open a NEW terminal window and run:

```bash
curl -X POST http://localhost:8000/chat -H "Content-Type: application/json" -d "{\"message\":\"Tell me about the 3DGS project\",\"history\":[]}"
```

You should get a JSON answer about 3D Gaussian Splatting. ✅

If yes, the backend works. Close the second terminal but **keep the first one running**.

---

## 🎨 PART 4 — Test the Frontend Locally

### Step 4.1 — Open a NEW terminal in the `frontend/` folder

```bash
cd Desktop/portfolio-rag/frontend
```

### Step 4.2 — Install dependencies

```bash
npm install
```

Takes 1-3 minutes. Downloads Next.js, React, Tailwind, lucide-react, etc.

### Step 4.3 — Create your env file

1. Find `.env.local.example` in `frontend/`.
2. Copy it, rename the copy to `.env.local`.
3. Open it — it should already say:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```
   That's correct for local testing. Save.

### Step 4.4 — Start the frontend

```bash
npm run dev
```

Wait for `✓ Ready in ...` then open **http://localhost:3000** in your browser.

🎉 You should see:
- **Landing page** with two cards (Chatbot / Portfolio)
- **Portfolio page** with your full CV
- **Chat page** where you can talk to the AI assistant

**Try everything:**
- Type a question → get a streamed answer ✅
- Click the 🎤 mic → speak → watch it transcribe and reply ✅
- Click the 🔊 speaker → turn on voice output → hear answers spoken ✅
- Ask something unrelated like "What's the weather?" → get the polite refusal ✅

---

## 🌐 PART 5 — Put the Code on GitHub

We need this because Vercel and Hugging Face deploy from GitHub.

### Step 5.1 — Create a new repository on GitHub

1. Go to https://github.com/new
2. Name: `portfolio-rag`
3. **Public** (or private if you prefer)
4. Do NOT check "Add a README" (we already have files)
5. Click **Create repository**. Keep the page open — you'll need the URL.

### Step 5.2 — Push your code

Open a terminal in `Desktop/portfolio-rag/` (the parent folder containing BOTH `backend` and `frontend`).

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/portfolio-rag.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

✅ Your code is now on GitHub. Refresh the GitHub page to see it.

---

## ☁️ PART 6 — Deploy the Backend to Hugging Face Spaces

### Step 6.1 — Create a new Space

1. Go to https://huggingface.co/new-space
2. **Space name:** `portfolio-rag` (or anything you like)
3. **License:** MIT
4. **Select Space SDK:** choose **Docker** → **Blank**
5. **Hardware:** CPU basic (free)
6. **Visibility:** Public
7. Click **Create Space**.

### Step 6.2 — Upload the backend files

You have two options:

**Option A — Easiest (upload via web):**
1. On your new Space page, click **"Files"** tab.
2. Click **"+ Add file" → "Upload files"**.
3. Drag ALL files and subfolders from your local `backend/` folder (but NOT `.env`, NOT `.venv/`, NOT `chroma_db/`).
4. Commit at the bottom.

**Option B — Git (cleaner):**
```bash
cd ~/Desktop/portfolio-rag/backend
git init
git remote add origin https://huggingface.co/spaces/YOUR_HF_USERNAME/portfolio-rag
git add .
git commit -m "Initial backend"
git push -u origin main
```

### Step 6.3 — Add your secret key

1. On your Space page, go to **Settings** (top right).
2. Scroll to **Variables and secrets**.
3. Click **"New secret"**:
   - Name: `GROQ_API_KEY`
   - Value: your real Groq key (`gsk_...`)
4. Click **"New variable"** (not secret, just variable):
   - Name: `ALLOWED_ORIGINS`
   - Value: `http://localhost:3000` (we'll add the real URL after we deploy the frontend)

### Step 6.4 — Wait for the build

Go to the **Logs** tab. The Space will build the Docker image (5-10 minutes).

When you see `✅ RAG engine ready.` and `Uvicorn running on 0.0.0.0:7860` — it's live!

Your backend URL is:
```
https://YOUR_HF_USERNAME-portfolio-rag.hf.space
```

Test it: open that URL in a browser — you should see `{"status":"ok"...}`. 🎉

---

## 🚀 PART 7 — Deploy the Frontend to Vercel

### Step 7.1 — Import your GitHub repo

1. Go to https://vercel.com/new
2. Click **"Import"** next to your `portfolio-rag` repo.
3. **Framework Preset:** Next.js (auto-detected)
4. **Root Directory:** click **Edit** and select `frontend` ⚠️ **VERY IMPORTANT** — your frontend is not at the repo root.

### Step 7.2 — Add the environment variable

In the **Environment Variables** section during setup:

- Name: `NEXT_PUBLIC_API_URL`
- Value: `https://YOUR_HF_USERNAME-portfolio-rag.hf.space` (from Step 6.4, no trailing slash)

### Step 7.3 — Deploy

Click **Deploy**. Wait ~2 minutes.

Vercel gives you a URL like `https://portfolio-rag-xyz.vercel.app`. Open it → your site is LIVE. 🎉

### Step 7.4 — Update backend CORS

Now tell the backend to trust your Vercel URL:

1. Go back to your Hugging Face Space → **Settings** → **Variables and secrets**.
2. Edit `ALLOWED_ORIGINS`:
   ```
   http://localhost:3000,https://portfolio-rag-xyz.vercel.app
   ```
   (Replace with your actual Vercel URL, comma-separated, no spaces.)
3. Save. The Space will restart automatically.

Reload your Vercel site and test the chat → it should work. ✅

---

## 🎯 PART 8 — (Optional) Custom Domain

Your site is at `xxxx.vercel.app`. Want `abderrahim-portfolio.com`?

1. Buy a domain (Namecheap ~€10/year, or get a free one from https://www.freenom.com or a `.tech` student discount from GitHub Student Pack).
2. In Vercel → your project → **Settings → Domains** → add it.
3. Vercel tells you which DNS records to add at your domain registrar. Follow its instructions.
4. Done in 5-30 minutes.

---

## 🛠️ Updating Things Later

### To update your CV info (what the chatbot knows):
1. Edit the markdown files in `backend/knowledge_base/`.
2. Commit and push to GitHub OR Hugging Face.
3. Hugging Face rebuilds automatically — the index refreshes.

### To update the portfolio page design:
1. Edit `frontend/app/portfolio/page.tsx`.
2. Commit and push to GitHub.
3. Vercel redeploys automatically (~30 seconds).

### To change the chatbot's personality:
- Edit the `SYSTEM_PROMPT` in `backend/rag_engine.py`.

### To lower/raise the off-topic sensitivity:
- Change `RELEVANCE_THRESHOLD` in `backend/rag_engine.py` (default 1.1, lower = stricter).

---

## 🐛 Troubleshooting

**"Failed to fetch" in the browser when I chat:**
- Your backend is down, OR your `NEXT_PUBLIC_API_URL` is wrong, OR CORS is blocking you. Check `ALLOWED_ORIGINS` on the HF Space.

**The HF Space sleeps:**
- Free Spaces sleep after inactivity. First request wakes them (~10s cold start). Normal.

**Mic button doesn't work:**
- Browser needs HTTPS OR localhost to allow microphone. Your Vercel URL is HTTPS, so prod is fine.

**"GROQ_API_KEY missing":**
- You forgot to add it in the HF Space secrets, or you didn't save the `.env` locally.

**`npm install` fails:**
- Make sure Node.js is version 18+. Try `node --version`.

---

## 🎁 Bonus: How to Talk About This in Interviews

When a recruiter asks about this project, mention:
- **RAG pipeline** with ChromaDB + sentence-transformers for embeddings, Llama 3.3 70B via Groq for generation
- **Off-topic guardrail** using cosine similarity thresholding + system prompt constraints
- **Streaming responses** via Server-Sent Events for a better UX
- **Voice I/O** using Groq's Whisper (STT) and Web Speech API (TTS)
- **Full-stack deployment:** Next.js on Vercel, FastAPI on Docker-based Hugging Face Spaces

This project *itself* is proof you can build modern GenAI systems. Put it at the top of your CV's project list.

---

## 📞 Quick Reference

| What | Where | URL |
|------|-------|-----|
| Groq API | groq.com | https://console.groq.com |
| GitHub repo | github.com | your-username/portfolio-rag |
| Backend live | hf.space | your-hf-user-portfolio-rag.hf.space |
| Frontend live | vercel.app | your-project.vercel.app |

Good luck, Abderrahim! 🚀
