# Key Projects

## 3D Gaussian Splatting Compression Using Self-Organizing Maps (Dec 2025 – Mar 2026)

### Problem
3D Gaussian Splatting (3DGS) is a cutting-edge technique for 3D scene representation that produces photorealistic results, but the resulting models are extremely large, making storage and transmission impractical at scale.

### Approach
Abderrahim built a compression pipeline that maps 3DGS attributes (position, color, opacity, covariance) onto structured 2D grids via Self-Organizing Maps (SOMs). The key insight is that SOMs preserve spatial topology — nearby Gaussians in 3D space land near each other on the 2D grid — which makes the resulting representation highly compressible.

### Result
**+0.4 dB PSNR over the adaptive-quantization baseline at equal compression ratio.** Benchmarked on PSNR, SSIM, and compression ratio against state-of-the-art methods.

**Stack:** PyTorch, Computer Vision, Data Compression, Self-Organizing Maps.

---

## Electric Vehicle Energy Optimization Using Transformers (Jun – Sep 2025)

### Problem
EVs lose significant range due to suboptimal driving behavior. The challenge is to predict the optimal speed profile in real time using only a dashcam, without V2V or infrastructure data.

### Pipeline
1. YOLOv8 detects surrounding vehicles frame by frame from dashcam footage.
2. OpenCV-based depth estimation computes distances and relative velocities.
3. These signals form a time-series of traffic behavioral features.
4. A Transformer forecasts the energy-optimal speed profile for the next N seconds.

### Result
**~10% energy reduction in city driving** compared to unoptimized driving behavior.

**Stack:** PyTorch, YOLOv8, OpenCV, Transformers, Predictive Modeling.

---

## G8-Predictor: Intraday XAU/USD Price Forecasting (Jan – Jun 2025)

### Problem
Gold (XAU/USD) is one of the most volatile globally traded assets. Existing AI models struggled with redundant features, inappropriate prediction horizons, and poor generalization to unseen market conditions.

### Data Pipeline & Feature Engineering
Hourly OHLC and Volume data from January 2005 to February 2025 (Dukascopy JForex). After rigorous empirical evaluation across six trading methodologies, 17 features were selected: OHLC, Volume, OBV, RSI, MACD Histogram, ADX, SMA_50/200, EMA_50/200, ATR, and Bollinger Bands. Supply & Demand zones, Elliott Wave, and Harmonic patterns were excluded — they either added no measurable improvement or occurred too rarely (~20–100 instances over 20 years) to be reliably learned.

### Dataset Splitting
Strict time-based split to prevent data leakage: Training (2005–2019), Validation (2020–2022), Test (2023–2025). MinMaxScaler fitted exclusively on training set.

### Prediction Horizon
The model forecasts the maximum high and minimum low over a future N-hour window. The 8-hour horizon produced the lowest normalized MAE after systematic evaluation of horizons 1–15 hours.

### Models Compared
LSTM, Transformer, and hybrid LSTM-Transformer. Fine-tuned on an NVIDIA RTX 3060 GPU with ~30 hours of hyperparameter search (learning rates 1e-6 to 1e-3, dropout 0.1–0.7, batch sizes 16–128).

### Result
**Best MAE = 0.129% of price** ($2.44/oz), outperforming LSTM-GRU (MAE 2.50%) and published LSTM-Transformer hybrids (MAE 0.40–0.80%). Top features: BB_Lower, Volume, EMA_200.

**Stack:** PyTorch, Time-Series Forecasting, Financial Modeling, NVIDIA RTX 3060.

---

## Federated Intrusion Detection System for MQTT IoT Networks (2024)

### Problem
IoT networks using MQTT are highly vulnerable to cyberattacks. Centralized IDS solutions require sending raw traffic to a central server — a privacy problem for distributed edge deployments.

### Solution
CNN + Transformer hybrid model classifying MQTT traffic into 6 categories: legitimate, DoS, flood, bruteforce, malformed, and slowite. Federated Learning across edge clients: only model weight updates (not raw data) are sent to the central aggregator (FedAvg).

### Result
**99% classification accuracy — +3% over the centralized baseline** — while keeping raw traffic data local on each edge device.

**Stack:** PyTorch, Flask, Federated Learning, CNN, Transformers, IoT Security, MQTT.

---

## Smart Grid Infrastructure

Abderrahim developed a system for remote monitoring and control of home devices integrating sensors and actuators with an online grid to automate energy management. Real-time sensor readings trigger automated actions and a web interface allows manual override. Demonstrates ability to combine embedded systems, networking, and software into a coherent IoT solution.

**Stack:** Embedded Systems, Sensors, Actuators, Networking, Web Interface.

---

## Portfolio RAG Chatbot — This Website (2026)

Abderrahim designed and built this portfolio website from scratch including a production RAG chatbot. The system uses sentence-transformers for semantic embedding, ChromaDB as the vector store, and Llama 3.3 70B via Groq for generation. Features: cosine similarity off-topic guardrail, streaming via Server-Sent Events, voice input via Groq Whisper, voice output via Web Speech API. Deployed free: FastAPI on Hugging Face Spaces (Docker), Next.js on Vercel.

**Stack:** FastAPI, ChromaDB, sentence-transformers, Groq, Llama 3.3 70B, Whisper, Next.js, TailwindCSS, Docker.

---

## Generative AI & Agentic Work

Abderrahim has built LLM prompting pipelines, RAG systems, and ReAct-style agents — tool-augmented assistants that reason step by step and call external tools. This gave him practical understanding of the trade-offs between classic RAG (fast, deterministic, single retrieval) and agentic RAG (flexible, multi-step, higher cost) and when to use each in production.