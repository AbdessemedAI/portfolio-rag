import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  Linkedin,
  Github,
  MapPin,
  GraduationCap,
  Briefcase,
  Code2,
  Wrench,
  Languages,
} from "lucide-react";

export default function PortfolioPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>

      {/* Hero */}
      <header className="mb-12 pb-8 border-b border-slate-800">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">
          Abderrahim Abdessemed
        </h1>
        <p className="text-xl text-brand-500 mb-6">
          Artificial Intelligence & Data Science Engineer
        </p>
        <div className="flex flex-wrap gap-4 text-sm text-slate-400">
          <a
            href="mailto:abdessemed.abderrahim0@gmail.com"
            className="flex items-center gap-1.5 hover:text-white transition"
          >
            <Mail className="w-4 h-4" /> abdessemed.abderrahim0@gmail.com
          </a>
          <a
            href="tel:+33666657043"
            className="flex items-center gap-1.5 hover:text-white transition"
          >
            <Phone className="w-4 h-4" /> +33 6 66 65 70 43
          </a>
          <a
            href="https://linkedin.com/in/abderrahim-abdessemed"
            target="_blank"
            rel="noopener"
            className="flex items-center gap-1.5 hover:text-white transition"
          >
            <Linkedin className="w-4 h-4" /> LinkedIn
          </a>
          <a
            href="https://github.com/AbdessemedAI"
            target="_blank"
            rel="noopener"
            className="flex items-center gap-1.5 hover:text-white transition"
          >
            <Github className="w-4 h-4" /> GitHub
          </a>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4" /> Paris, France · Available Feb 2026
          </span>
        </div>
        <p className="mt-6 text-slate-300 leading-relaxed">
          AI engineer with hands-on experience building deep-learning systems on
          real industrial, financial and IoT data, backed by strong theoretical
          foundations. Eager to contribute to applied AI projects in a 6-month
          internship.
        </p>
      </header>

      {/* Education */}
      <Section icon={<GraduationCap className="w-5 h-5" />} title="Education">
        <Entry
          title="Master 2 — Multimedia Networking: Deep Learning, Coding & Security"
          sub="Paris-Saclay University"
          date="2025 – 2026"
          points={[
            "Core: Information Theory, Data Compression, Signal Processing, Optimization, CDN.",
            "AI Focus: Deep Learning, Reinforcement Learning.",
          ]}
        />
        <Entry
          title="Engineering Degree — Artificial Intelligence & Industrial Networks"
          sub="Higher National School RE2SD"
          date="2020 – 2025"
          points={[
            "Core: Industrial & Computer Networks, SQL, Multi-threading, Sensors, Actuators, PLCs, Microcontrollers.",
            "AI Focus: Machine Learning, Deep Learning.",
          ]}
        />
      </Section>

      {/* Projects */}
      <Section icon={<Code2 className="w-5 h-5" />} title="Key Projects">
        <Entry
          title="3D Gaussian Splatting Compression Using Self-Organizing Maps"
          date="Dec 2025 – Mar 2026"
          points={[
            "Mapped 3DGS attributes onto 2D grids via SOMs; benchmarked on PSNR, SSIM and compression ratio. +0.4 dB over adaptive-quantization baseline at equal ratio.",
          ]}
          tags={["PyTorch", "Computer Vision", "Data Compression"]}
        />
        <Entry
          title="Electric Vehicle Energy Optimization Using Transformers"
          date="Jun – Sep 2025"
          points={[
            "Built dashcam time-series with YOLOv8 detection and OpenCV depth; trained a Transformer to predict energy-optimal speed profiles. ~10% energy reduction in city driving.",
          ]}
          tags={["PyTorch", "YOLOv8", "OpenCV", "Energy Optimization"]}
        />
        <Entry
          title="Intraday XAU/USD Price Prediction Using Transformers"
          date="Jan – Jun 2025"
          points={[
            "Trained a Transformer on tick-level data for intraday forecasting on fragmented history. Best MAE = 0.129% of price.",
          ]}
          tags={["PyTorch", "Time-Series Forecasting", "Financial Modeling"]}
        />
        <Entry
          title="Federated Intrusion Detection System for MQTT IoT Networks"
          date="2024"
          points={[
            "CNN+Transformer IDS for 6-class MQTT traffic, trained with Federated Learning across edge clients for privacy. 99% accuracy (+3% vs. centralized baseline).",
          ]}
          tags={["PyTorch", "Federated Learning", "Deep Learning", "IoT Security", "Flask"]}
        />
      </Section>

      {/* Experience */}
      <Section icon={<Briefcase className="w-5 h-5" />} title="Experience">
        <Entry
          title="AI Engineer Intern — L'Ours (Oil & Gas Services)"
          sub="Predictive maintenance on well-testing and coiltubing equipment"
          date="Mar 2024"
          points={[
            "Learned well-testing and coiltubing operations with field engineers, then identified failure modes.",
            "Built a deep-learning pipeline (cleaning, features, training, evaluation) on noisy multi-sensor data using PyTorch and Pandas. Improved early fault detection over the rule-based baseline.",
          ]}
        />
        <Entry
          title="PLC Engineering Intern — Siemens"
          sub="Industrial automation: PLC programming and HMI integration"
          date="Jul 2023"
          points={[
            "Programmed and debugged Siemens S7-300 / S7-1200 PLCs and HMI screens for process-control routines using TIA Portal.",
            "Split a large technical scope across a 3-person team and cross-trained to cover the full system. Fastest team to complete and validate all tasks on real hardware.",
          ]}
        />
      </Section>

      {/* Skills */}
      <Section icon={<Wrench className="w-5 h-5" />} title="Technical Skills">
        <SkillBlock
          label="Deep Learning"
          items={[
            "Transformers",
            "CNN",
            "LSTM",
            "Diffusion Models",
            "DNN Compression",
            "Transfer Learning",
            "Fine-tuning",
          ]}
        />
        <SkillBlock
          label="Generative AI & Agents"
          items={[
            "LLM Prompting",
            "LangChain",
            "RAG",
            "AI Agents (ReAct)",
            "Tool-Augmented LLMs",
          ]}
        />
        <SkillBlock
          label="Computer Vision"
          items={["YOLOv8", "OpenCV", "3D Gaussian Splatting", "Image & Video Processing"]}
        />
        <SkillBlock
          label="ML & Data"
          items={[
            "Reinforcement Learning",
            "Predictive Modeling",
            "Time-Series",
            "Federated Learning",
            "Information Theory",
            "Data Compression",
            "Signal Processing",
          ]}
        />
        <SkillBlock
          label="Programming & Tools"
          items={["Python", "PyTorch", "Pandas", "NumPy", "Scikit-learn", "Matplotlib", "SQL", "Git", "Jupyter", "MySQL", "LaTeX"]}
        />
        <SkillBlock
          label="Industrial / Embedded"
          items={["Siemens PLCs (S7-300/1200)", "HMI", "Industrial Networks"]}
        />
      </Section>

      {/* Languages */}
      <Section icon={<Languages className="w-5 h-5" />} title="Languages">
        <div className="flex flex-wrap gap-3">
          <LangBadge lang="English" level="Proficient" />
          <LangBadge lang="French" level="B2" />
          <LangBadge lang="Arabic" level="Native" />
        </div>
      </Section>

      <footer className="mt-16 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
        Prefer a conversation?{" "}
        <Link href="/chat" className="text-brand-500 hover:underline">
          Ask my AI assistant
        </Link>
        .
      </footer>
    </main>
  );
}

// --- Small helper components ---
function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <h2 className="flex items-center gap-2 text-2xl font-bold mb-5 text-white">
        <span className="text-brand-500">{icon}</span> {title}
      </h2>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

function Entry({
  title,
  sub,
  date,
  points,
  tags,
}: {
  title: string;
  sub?: string;
  date?: string;
  points?: string[];
  tags?: string[];
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 hover:border-slate-700 transition">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h3 className="font-semibold text-white">{title}</h3>
          {sub && <p className="text-sm text-slate-400 italic">{sub}</p>}
        </div>
        {date && (
          <span className="text-sm text-slate-500 whitespace-nowrap">
            {date}
          </span>
        )}
      </div>
      {points && (
        <ul className="mt-3 space-y-1.5 text-sm text-slate-300">
          {points.map((p, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-brand-500 mt-1">·</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      )}
      {tags && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 text-xs rounded bg-brand-500/10 text-brand-500 border border-brand-500/20"
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function SkillBlock({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <div className="text-sm font-semibold text-slate-300 mb-2">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((it) => (
          <span
            key={it}
            className="px-2.5 py-1 text-xs rounded-md bg-slate-800 text-slate-300 border border-slate-700"
          >
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}

function LangBadge({ lang, level }: { lang: string; level: string }) {
  return (
    <div className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800">
      <div className="text-sm font-semibold text-white">{lang}</div>
      <div className="text-xs text-slate-400">{level}</div>
    </div>
  );
}