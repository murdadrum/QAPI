import React, { useState, useEffect, useMemo } from "react";
import {
  Activity,
  ShieldCheck,
  Zap,
  Layout,
  Moon,
  Sun,
  Terminal,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Play,
  Settings,
  Cpu,
  Database,
  Search,
  Timer,
  Layers,
  BarChart,
  Gauge,
  ArrowRight,
} from "lucide-react";

// Latency Correlation Data: Context Size (Chunks) vs Model Architectures
const LATENCY_DATA = {
  models: ["GPT-4o", "Llama-3 (70B)", "Claude-3.5", "Mistral-Small"],
  chunks: ["1 Chunk", "5 Chunks", "10 Chunks", "20 Chunks", "50 Chunks"],
  // Values representing total latency in milliseconds
  matrix: [
    [450, 620, 850, 1200, 2100], // GPT-4o
    [320, 580, 920, 1500, 2800], // Llama-3
    [410, 590, 810, 1150, 1950], // Claude-3.5
    [280, 450, 710, 1300, 2400], // Mistral-Small
  ],
};

const PERFORMANCE_METRICS = [
  {
    label: "Avg Vector Search",
    count: "42ms",
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
  {
    label: "Time to 1st Token",
    count: "185ms",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    label: "Retrieval Overhead",
    count: "12%",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    label: "Index Freshness",
    count: "99.9%",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
];

const SidebarItem = ({ icon: Icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
      isActive
        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
        : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
    }`}
  >
    <Icon size={18} />
    <span className="text-sm font-medium">{label}</span>
  </button>
);

const LatencyHeatMap = () => {
  const getColor = (value) => {
    if (value < 500)
      return "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400";
    if (value < 1000)
      return "bg-amber-500/20 text-amber-600 dark:text-amber-400";
    if (value < 2000)
      return "bg-orange-500/40 text-orange-600 dark:text-orange-400";
    return "bg-rose-500/60 text-rose-700 dark:text-rose-300";
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-separate border-spacing-1">
        <thead>
          <tr>
            <th className="p-2"></th>
            {LATENCY_DATA.chunks.map((v) => (
              <th
                key={v}
                className="p-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center w-24"
              >
                {v}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {LATENCY_DATA.models.map((model, mIdx) => (
            <tr key={model}>
              <td className="p-2 text-xs font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap">
                {model}
              </td>
              {LATENCY_DATA.matrix[mIdx].map((val, vIdx) => (
                <td key={`${mIdx}-${vIdx}`} className="p-0">
                  <div
                    className={`h-12 w-full flex items-center justify-center rounded-lg text-xs font-mono font-bold transition-all hover:scale-105 cursor-default ${getColor(val)}`}
                    title={`${model} @ ${LATENCY_DATA.chunks[vIdx]}: ${val}ms`}
                  >
                    {val}ms
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex items-center justify-end gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
        <span>Latency:</span>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-emerald-500/20 rounded-sm" /> Fast
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-rose-500/60 rounded-sm" /> High Overhead
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [logs, setLogs] = useState([]);
  const [activeView, setActiveView] = useState("dashboard");
  const [performanceScore, setPerformanceScore] = useState(88);

  const runRAGMonitor = () => {
    setIsMonitoring(true);
    setLogs([]);
    const steps = [
      "Inbound Request: 'Explain Q3 Revenue...'",
      "Generating Query Embedding (text-embedding-3-small)...",
      "Vector Search Initiated (Top-K: 5, Namespace: financial-docs)...",
      "Retrieval Complete: 5 chunks found in 38ms.",
      "Context Injection: 1,840 tokens added to prompt.",
      "LLM Synthesis Started (GPT-4o)...",
      "TTFT Detected: 142ms.",
      "Stream Complete: 245 tokens generated.",
      "Total Round-Trip: 890ms.",
    ];

    steps.forEach((step, i) => {
      setTimeout(() => {
        setLogs((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] ${step}`,
        ]);
        if (i === steps.length - 1) {
          setIsMonitoring(false);
          setPerformanceScore((prev) => Math.min(prev + 1, 95));
        }
      }, i * 400);
    });
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors duration-300 font-sans">
        {/* Sidebar */}
        <aside className="w-72 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col fixed h-full z-10">
          <div className="p-8 flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/30">
              <Database size={24} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight">RAGPulse</span>
              <span className="text-[10px] text-indigo-500 font-bold tracking-widest uppercase">
                Performance Monitor
              </span>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            <h3 className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
              Monitoring
            </h3>
            <SidebarItem
              icon={Activity}
              label="Latency Dashboard"
              isActive={activeView === "dashboard"}
              onClick={() => setActiveView("dashboard")}
            />
            <SidebarItem
              icon={Search}
              label="Vector Index Health"
              isActive={activeView === "index"}
              onClick={() => setActiveView("index")}
            />
            <SidebarItem
              icon={Layers}
              label="Context Orchestration"
              isActive={activeView === "context"}
              onClick={() => setActiveView("context")}
            />
            <SidebarItem
              icon={BarChart}
              label="Token Economics"
              isActive={activeView === "tokens"}
              onClick={() => setActiveView("tokens")}
            />
          </nav>

          <div className="p-6">
            <div className="bg-indigo-50 dark:bg-indigo-950/20 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/50">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-2">
                <Timer size={16} />
                <span className="text-xs font-bold uppercase">
                  Latency Alert
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Vector retrieval time in <code>us-east-1</code> exceeded 150ms.{" "}
                <b>Check pod scaling.</b>
              </p>
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-500 transition-all"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              <span className="text-sm font-medium">
                {darkMode ? "Light" : "Dark"}
              </span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="ml-72 flex-1 p-10">
          <header className="flex justify-between items-start mb-10">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight">
                RAG Latency Monitor
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
                Visualizing the intersection of retrieval efficiency and
                synthesis speed.
              </p>
            </div>
            <button
              onClick={runRAGMonitor}
              disabled={isMonitoring}
              className="group relative flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-2xl shadow-indigo-500/40 active:scale-95 overflow-hidden"
            >
              {isMonitoring ? (
                <Activity className="animate-spin" size={20} />
              ) : (
                <Zap size={20} />
              )}
              <span className="relative z-10">
                {isMonitoring ? "Monitoring Flow..." : "Simulate RAG Query"}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
            </button>
          </header>

          {/* Metrics Grid */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                UX Efficiency Score
              </span>
              <div className="flex items-end gap-2 mt-2">
                <span className="text-5xl font-black text-indigo-500">
                  {performanceScore}
                </span>
                <span className="text-slate-400 text-sm mb-2">/ 100</span>
              </div>
              <div className="mt-4 w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 transition-all duration-1000"
                  style={{ width: `${performanceScore}%` }}
                />
              </div>
            </div>

            {PERFORMANCE_METRICS.map((v, i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm"
              >
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                  {v.label}
                </span>
                <div className="flex items-center justify-between mt-2">
                  <span className={`text-4xl font-black ${v.color}`}>
                    {v.count}
                  </span>
                  <div className={`${v.bg} p-2 rounded-xl`}>
                    <Activity className={v.color} size={24} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Heatmap Section */}
          <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm mb-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-bold text-xl flex items-center gap-2">
                  <Gauge size={22} className="text-indigo-500" />
                  Context Size vs. Latency Heat Map
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Measuring the performance cost of deep context retrieval
                  across models.
                </p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                  Compare Models
                </button>
              </div>
            </div>
            <LatencyHeatMap />
          </section>

          <div className="grid grid-cols-12 gap-8">
            {/* RAG Trace Terminal */}
            <div className="col-span-7 space-y-6">
              <section className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
                <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Terminal size={18} className="text-indigo-400" />
                    <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-widest">
                      RAG Pipeline Trace
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500">
                    Service: Pinecone-Serverless | Node: 04-A
                  </div>
                </div>
                <div className="p-8 min-h-[400px] font-mono text-sm overflow-y-auto max-h-[500px]">
                  {logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-700 opacity-50 py-20">
                      <Search size={40} className="mb-4 animate-pulse" />
                      <p>Send a query to visualize the retrieval flow...</p>
                    </div>
                  ) : (
                    logs.map((log, i) => (
                      <div
                        key={i}
                        className={`mb-2 leading-relaxed flex gap-3 ${log.includes("TTFT") || log.includes("Complete") ? "text-emerald-400 font-bold" : "text-indigo-400"}`}
                      >
                        <span className="text-slate-700 select-none">
                          [{i + 1}]
                        </span>
                        <span>{log}</span>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>

            {/* Flow Simulator Panel */}
            <div className="col-span-5 space-y-6">
              <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold flex items-center gap-2">
                    <Layers size={18} className="text-indigo-500" /> RAG Flow
                    Path
                  </h3>
                  <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded-full font-bold uppercase">
                    Real-Time Path
                  </span>
                </div>

                <div className="relative space-y-8">
                  {/* Visual Connector Line */}
                  <div className="absolute left-[17px] top-6 bottom-6 w-0.5 bg-slate-200 dark:bg-slate-800 z-0" />

                  {[
                    {
                      label: "Query Embedding",
                      desc: "Transform text to 1536d vector",
                      icon: Cpu,
                      time: "12ms",
                    },
                    {
                      label: "Vector Retrieval",
                      desc: "Cosine similarity in Pinecone",
                      icon: Database,
                      time: "38ms",
                    },
                    {
                      label: "Prompt Augmentation",
                      desc: "Injecting top-k context",
                      icon: ArrowRight,
                      time: "5ms",
                    },
                    {
                      label: "LLM Synthesis",
                      desc: "Streaming response to user",
                      icon: Activity,
                      time: "835ms",
                    },
                  ].map((step, idx) => (
                    <div
                      key={idx}
                      className="relative z-10 flex items-start gap-4"
                    >
                      <div className="w-9 h-9 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center text-indigo-500 shadow-sm">
                        <step.icon size={18} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-bold">{step.label}</h4>
                          <span className="text-[10px] font-mono text-slate-400">
                            {step.time}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-gradient-to-br from-emerald-600 to-teal-700 p-8 rounded-3xl text-white shadow-xl shadow-emerald-500/20">
                <h3 className="font-bold mb-2 flex items-center gap-2">
                  <BarChart3 size={18} /> UX Optimization
                </h3>
                <p className="text-sm text-emerald-500/10 leading-relaxed text-white">
                  By implementing <b>Metadata Filtering</b> and reducing Chunk
                  Count from 10 to 5, we cut total TTFT by 35% without
                  sacrificing context quality.
                </p>
                <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase opacity-60">
                    Status
                  </span>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded font-bold">
                    Optimized
                  </span>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `,
        }}
      />
    </div>
  );
}
