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
  Camera,
  Image as ImageIcon,
  Split,
  RefreshCcw,
  FileDiff,
} from "lucide-react";

const PERFORMANCE_METRICS = [
  {
    label: "Diff Confidence",
    count: "98.2%",
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
  {
    label: "Daily Snapshots",
    count: "1,240",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    label: "Schema Drifts",
    count: "3",
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  {
    label: "Avg Test Time",
    count: "1.2m",
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

const VisualDiffViewer = () => {
  const [sliderPos, setSliderPos] = useState(50);

  return (
    <div className="space-y-4">
      <div
        className="relative h-64 w-full bg-slate-200 dark:bg-slate-800 rounded-2xl overflow-hidden cursor-ew-resize group"
        onMouseMove={(e) => {
          if (e.buttons === 1) {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            setSliderPos(Math.min(Math.max(x, 0), 100));
          }
        }}
      >
        {/* "After" State (Broken) */}
        <div className="absolute inset-0 p-8 flex flex-col items-center justify-center text-center">
          <div className="w-full max-w-xs bg-white dark:bg-slate-900 p-6 rounded-xl border-2 border-rose-500 shadow-xl">
            <div className="w-full h-32 bg-slate-100 dark:bg-slate-800 rounded-lg mb-4 flex items-center justify-center">
              <ImageIcon className="text-rose-500" size={32} />
            </div>
            <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded mb-2" />
            <div className="h-4 w-1/2 bg-rose-500/20 rounded" />
            <p className="text-[10px] text-rose-500 font-bold mt-4 uppercase">
              Error: price_field_missing
            </p>
          </div>
          <span className="absolute top-4 right-4 bg-rose-500 text-white text-[10px] px-2 py-1 rounded-full font-bold">
            CURRENT (FAILING)
          </span>
        </div>

        {/* "Before" State (Baseline) */}
        <div
          className="absolute inset-0 p-8 flex flex-col items-center justify-center text-center bg-slate-100 dark:bg-slate-950 border-r-2 border-indigo-500"
          style={{ width: `${sliderPos}%`, overflow: "hidden" }}
        >
          <div className="w-full min-w-[320px] max-w-xs bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm opacity-50">
            <div className="w-full h-32 bg-slate-100 dark:bg-slate-800 rounded-lg mb-4 flex items-center justify-center">
              <ImageIcon className="text-slate-400" size={32} />
            </div>
            <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded mb-2" />
            <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-6 w-20 bg-emerald-500/20 rounded mt-4" />
          </div>
          <span className="absolute top-4 left-4 bg-indigo-500 text-white text-[10px] px-2 py-1 rounded-full font-bold">
            BASELINE (PASS)
          </span>
        </div>

        {/* Slider Handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-indigo-500 flex items-center justify-center"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="w-6 h-6 bg-indigo-500 rounded-full shadow-lg flex items-center justify-center text-white">
            <Split size={12} />
          </div>
        </div>
      </div>
      <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">
        <span>Baseline Snapshot</span>
        <span>Drag to compare</span>
        <span>Visual Regression</span>
      </div>
    </div>
  );
};

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [isTesting, setIsTesting] = useState(false);
  const [logs, setLogs] = useState([]);
  const [activeView, setActiveView] = useState("dashboard");
  const [qaScore, setQaScore] = useState(94);

  const runRegressionTest = () => {
    setIsTesting(true);
    setLogs([]);
    const steps = [
      "Webhook Received: API Schema Change Detected in 'Production'...",
      "Event: Field 'product.price' changed from String to Null.",
      "Triggering Playwright E2E Suite (Headless Chrome)...",
      "Capturing snapshot of /shop/product/101...",
      "Analyzing pixels via Applitools Eyes...",
      "⚠ REGRESSION DETECTED: 12% layout shift found.",
      "ISSUE: Empty element caused button displacement.",
      "Status: Build FAILED. Notifying Engineering Team.",
    ];

    steps.forEach((step, i) => {
      setTimeout(() => {
        setLogs((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] ${step}`,
        ]);
        if (i === steps.length - 1) {
          setIsTesting(false);
          setQaScore((prev) => Math.max(prev - 5, 82));
        }
      }, i * 500);
    });
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors duration-300 font-sans">
        {/* Sidebar */}
        <aside className="w-72 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col fixed h-full z-10">
          <div className="p-8 flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/30">
              <Camera size={24} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight">VisionQA</span>
              <span className="text-[10px] text-indigo-500 font-bold tracking-widest uppercase">
                Visual Regression Bridge
              </span>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            <h3 className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
              QA Control
            </h3>
            <SidebarItem
              icon={Activity}
              label="Regression Dashboard"
              isActive={activeView === "dashboard"}
              onClick={() => setActiveView("dashboard")}
            />
            <SidebarItem
              icon={FileDiff}
              label="Schema Drifts"
              isActive={activeView === "schema"}
              onClick={() => setActiveView("schema")}
            />
            <SidebarItem
              icon={ImageIcon}
              label="Snapshot Gallery"
              isActive={activeView === "gallery"}
              onClick={() => setActiveView("gallery")}
            />
            <SidebarItem
              icon={RefreshCcw}
              label="CI/CD Hooks"
              isActive={activeView === "hooks"}
              onClick={() => setActiveView("hooks")}
            />
          </nav>

          <div className="p-6">
            <div className="bg-rose-50 dark:bg-rose-950/20 p-4 rounded-2xl border border-rose-100 dark:border-rose-900/50">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 mb-2">
                <AlertCircle size={16} />
                <span className="text-xs font-bold uppercase">UI Breakage</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Snapshot <code>v2.4.1</code> failed pixel match. Price component
                displaced.
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
                Visual Regression API Bridge
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
                Automatically catching layout breakage caused by upstream API
                schema changes.
              </p>
            </div>
            <button
              onClick={runRegressionTest}
              disabled={isTesting}
              className="group relative flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-2xl shadow-indigo-500/40 active:scale-95 overflow-hidden"
            >
              {isTesting ? (
                <Activity className="animate-spin" size={20} />
              ) : (
                <Play size={20} />
              )}
              <span className="relative z-10">
                {isTesting ? "Running Visual Diff..." : "Trigger Manual Check"}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
            </button>
          </header>

          {/* Metrics Grid */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                UI Integrity Score
              </span>
              <div className="flex items-end gap-2 mt-2">
                <span
                  className={`text-5xl font-black ${qaScore > 90 ? "text-emerald-500" : "text-amber-500"}`}
                >
                  {qaScore}%
                </span>
                <span className="text-slate-400 text-sm mb-2">/ 100</span>
              </div>
              <div className="mt-4 w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 transition-all duration-1000"
                  style={{ width: `${qaScore}%` }}
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

          <div className="grid grid-cols-12 gap-8">
            {/* Visual Regression Viewer */}
            <div className="col-span-7 space-y-6">
              <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="font-bold text-xl flex items-center gap-2">
                      <Split size={22} className="text-indigo-500" />
                      Visual Regression Comparison
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      Snapshot comparison of <code>/shop/product/101</code>{" "}
                      after schema update.
                    </p>
                  </div>
                </div>
                <VisualDiffViewer />
              </section>

              <section className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
                <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Terminal size={18} className="text-indigo-400" />
                    <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-widest">
                      CI/CD Pipeline Trace
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500">
                    Node: Playwright-Runner-01
                  </div>
                </div>
                <div className="p-8 min-h-[300px] font-mono text-sm overflow-y-auto max-h-[400px]">
                  {logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-700 opacity-50 py-16">
                      <RefreshCcw size={40} className="mb-4 animate-pulse" />
                      <p>Pipeline idle. Trigger a check to see logs...</p>
                    </div>
                  ) : (
                    logs.map((log, i) => (
                      <div
                        key={i}
                        className={`mb-2 leading-relaxed flex gap-3 ${log.includes("⚠") || log.includes("FAILED") ? "text-rose-400 font-bold" : "text-indigo-400"}`}
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

            {/* Regression Analysis Panel */}
            <div className="col-span-5 space-y-6">
              <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold flex items-center gap-2">
                    <Layers size={18} className="text-indigo-500" /> Regression
                    Root Cause
                  </h3>
                  <span className="text-[10px] bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 px-2 py-1 rounded-full font-bold uppercase">
                    Critical
                  </span>
                </div>

                <div className="space-y-6">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-l-4 border-slate-400">
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">
                      Upstream API Change
                    </p>
                    <div className="bg-slate-900 p-3 rounded-lg font-mono text-[10px] text-indigo-400 mt-2">
                      <span className="opacity-50">"price": "19.99"</span>
                      <br />
                      <span className="text-rose-500">"price": null</span>
                    </div>
                  </div>

                  <div className="p-4 bg-rose-50 dark:bg-rose-900/10 rounded-2xl border-l-4 border-rose-500">
                    <p className="text-[10px] text-rose-600 dark:text-rose-400 font-bold uppercase mb-1">
                      UI Impact Analysis
                    </p>
                    <p className="text-sm font-medium mt-1">
                      Component <code>PriceDisplay</code> collapsed, causing{" "}
                      <code>BuyNowButton</code> to shift 42px upward.
                    </p>
                    <div className="mt-2 text-[10px] flex items-center gap-1 text-rose-500 font-bold">
                      <AlertCircle size={10} /> BREAKING: Layout shift exceeds
                      safety threshold (5%).
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-3xl text-white shadow-xl shadow-indigo-500/20">
                <h3 className="font-bold mb-2 flex items-center gap-2">
                  <ShieldCheck size={18} /> QA Prevention
                </h3>
                <p className="text-sm text-indigo-100 leading-relaxed">
                  This pipeline ensures that <b>every</b> schema change is
                  validated against the actual UI appearance before merging to
                  production.
                </p>
                <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase opacity-60">
                    Status
                  </span>
                  <span className="text-xs bg-rose-500 px-2 py-1 rounded font-bold">
                    Merge Blocked
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
