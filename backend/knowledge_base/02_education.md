# Abderrahim Abdessemed — All Projects & Internships

## PROJECTS

Abderrahim has worked on 6 projects total. Here they are in detail:

### Project 1: 3D Gaussian Splatting Compression Using Self-Organizing Maps (Dec 2025 – Mar 2026)
Problem: 3D Gaussian Splatting (3DGS) produces photorealistic 3D scenes but the models are extremely large, making storage and transmission impractical at scale.
Approach: Built a compression pipeline mapping 3DGS attributes (position, color, opacity, covariance) onto structured 2D grids via Self-Organizing Maps (SOMs). SOMs preserve spatial topology — nearby Gaussians in 3D space land near each other on the 2D grid — making the output highly compressible with standard image codecs.
Evaluation: Benchmarked on PSNR, SSIM, and compression ratio against state-of-the-art 3DGS compression methods.
Result: +0.4 dB PSNR over adaptive-quantization baseline at equal compression ratio.
Stack: PyTorch, Computer Vision, Data Compression, Self-Organizing Maps.

### Project 2: Electric Vehicle Energy Optimization Using Transformers (Jun – Sep 2025)
Problem: EVs lose significant range due to suboptimal driving behavior. Goal: predict optimal speed profiles using only a dashcam without V2V or infrastructure data.
Pipeline: (1) YOLOv8 detects surrounding vehicles from dashcam footage. (2) OpenCV estimates depth and relative velocities. (3) Signals assembled into a time-series. (4) Transformer forecasts energy-optimal speed for the next N seconds while maintaining safe headway.
Result: ~10% energy reduction in city driving.
Stack: PyTorch, YOLOv8, OpenCV, Transformers, Predictive Modeling.

### Project 3: Intraday XAU/USD Price Prediction Using Transformers — G8-Predictor (Jan – Jun 2025)
Problem: Gold (XAU/USD) is highly volatile. Existing AI models suffered from redundant features, wrong prediction horizons, and poor generalization.
Data: Hourly OHLC and Volume from January 2005 to February 2025 (Dukascopy JForex). 17 engineered features: OHLC, Volume, OBV, RSI, MACD Histogram, ADX, SMA_50/200, EMA_50/200, ATR, Bollinger Bands Upper/Middle/Lower.
Split: Training (2005–2019), Validation (2020–2022), Test (2023–2025). Strict time-based split to prevent data leakage. MinMaxScaler fitted on training set only.
Horizon: 8-hour prediction window, optimized across 1–15 hours. Model forecasts maximum high and minimum low over the window.
Models: LSTM, Transformer, hybrid LSTM-Transformer compared. Fine-tuned on NVIDIA RTX 3060, ~30 hours of hyperparameter tuning (learning rates 1e-6 to 1e-3, dropout 0.1–0.7, batch sizes 16–128).
Result: Best MAE = 0.129% of price ($2.44/oz) — outperforms LSTM-GRU (MAE 2.50%) and published LSTM-Transformer hybrids (MAE 0.40–0.80%). Top features: BB_Lower, Volume, EMA_200.
Stack: PyTorch, Time-Series Forecasting, Financial Modeling, RTX 3060.

### Project 4: Federated Intrusion Detection System for MQTT IoT Networks (2024)
Problem: IoT MQTT networks are vulnerable to cyberattacks. Centralized IDS solutions require sending raw traffic to a server — a privacy problem for distributed edge deployments.
Solution: CNN + Transformer hybrid model classifying MQTT traffic into 6 categories: legitimate, DoS, flood, bruteforce, malformed, slowite.
Federated Learning: Each edge client trains locally and sends only model weight updates (not raw data) to the central aggregator (FedAvg). Raw traffic never leaves the device.
Result: 99% classification accuracy — +3% over centralized baseline — while keeping all raw traffic local.
Stack: PyTorch, Flask, Federated Learning, CNN, Transformers, IoT Security, MQTT.

### Project 5: Smart Grid Infrastructure
Built a system for remote monitoring and control of home devices integrating sensors and actuators with an online grid to automate energy management. Real-time sensor readings trigger automated actions (e.g. turning off appliances when consumption exceeds threshold). Includes a web interface for manual override.
Stack: Embedded Systems, Sensors, Actuators, Networking, Web Interface.

### Project 6: Portfolio RAG Chatbot — This Website (2026)
Designed and built this portfolio website from scratch including a production RAG chatbot. Uses sentence-transformers for semantic embedding, ChromaDB as vector store, Llama 3.3 70B via Groq for generation. Features: cosine similarity off-topic guardrail, streaming via Server-Sent Events, voice input via Groq Whisper, voice output via Web Speech API. Deployed free: FastAPI on Hugging Face Spaces (Docker), Next.js on Vercel.
Stack: FastAPI, ChromaDB, sentence-transformers, Groq, Llama 3.3 70B, Whisper, Next.js, TailwindCSS, Docker.

---

## INTERNSHIPS

Abderrahim has completed 2 internships:

### Internship 1: AI Engineer Intern — L'Ours (Oil & Gas Services), March 2024
Topic: Predictive maintenance on well-testing and coiltubing equipment.
What he did:
- Learned well-testing and coiltubing operations with field engineers, then identified failure modes.
- Built a complete deep-learning pipeline: data cleaning, feature engineering, model training, evaluation on noisy multi-sensor data.
- Tools: PyTorch, Pandas.
Result: Improved early fault detection over the rule-based baseline.
What he learned: How to work with real industrial data — messy, incomplete, time-sensitive — and how to communicate technical results to non-technical stakeholders.

### Internship 2: PLC Engineering Intern — Siemens, July 2023
Topic: Industrial automation — PLC programming and HMI integration.
What he did:
- Programmed and debugged Siemens S7-300 / S7-1200 PLCs and HMI screens for process-control routines using TIA Portal.
- Split a large technical scope across a 3-person team and cross-trained to cover the full system.
Result: Fastest team to complete and validate all tasks on real hardware.
What he learned: How AI models must integrate with real hardware constraints — timing, reliability, and safety requirements that don't exist in pure software projects.
