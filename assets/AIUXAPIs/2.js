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
  Skull,
  Bug,
  FastForward,
  Clock,
  RefreshCcw,
  ShieldAlert,
  ZapOff,
  Signal,
  XCircle,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

const CHAOS_METRICS = [
  {
    label: "Baseline Latency",
    count: "45ms",
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
  {
    label: "Active Faults",
    count: "0",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    label: "Recovery Time",
    count: "1.2s",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    label: "Error Rate",
    count: "0.01%",
    color: "text-rose-500",
    bg: "bg-rose-500/10",
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

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [isInjecting, setIsInjecting] = useState(false);
  const [chaosType, setChaosType] = useState("latency");
  const [latencyValue, setLatencyValue] = useState(2000);
  const [logs, setLogs] = useState([]);
  const [activeView, setActiveView] = useState("dashboard");
  const [circuitBreaker, setCircuitBreaker] = useState("Closed"); // Closed, Open, Half-Open

  const injectChaos = () => {
    setIsInjecting(true);
    setLogs([]);

    const steps = [
      `Initializing Chaos Proxy: Mode [${chaosType.toUpperCase()}]`,
      `Injecting ${chaosType === "latency" ? latencyValue + "ms lag" : "503 Service Unavailable"} into /v1/edge...`,
      "Request Intercepted: GET /api/v1/products",
      chaosType === "latency"
        ? `Waiting for artificial delay (${latencyValue}ms)...`
        : "Force-dropping connection...",
      chaosType === "latency"
        ? "Response delivered (Degraded state)."
        : "ERROR: Service Unavailable (Simulated).",
      "Circuit Breaker: Monitoring failure threshold...",
    ];

    steps.forEach((step, i) => {
      setTimeout(() => {
        setLogs((prev) => [
          `[${new Date().toLocaleTimeString()}] ${step}`,
          ...prev,
        ]);
        if (i === 2 && chaosType === "error") setCircuitBreaker("Open");
        if (i === steps.length - 1) setIsInjecting(false);
      }, i * 700);
    });
  };

  const resetCircuit = () => {
    setCircuitBreaker("Closed");
    setLogs((prev) => [
      `[${new Date().toLocaleTimeString()}] Manual Override: Circuit Breaker Reset.`,
      ...prev,
    ]);
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors duration-300 font-sans">
        {/* Sidebar */}
        <aside className="w-72 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col fixed h-full z-10">
          <div className="p-8 flex items-center gap-3">
            <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-rose-500/30">
              <Skull size={24} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight">ChaosGate</span>
              <span className="text-[10px] text-rose-500 font-bold tracking-widest uppercase">
                Resilience Proxy
              </span>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            <h3 className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
              Chaos Ops
            </h3>
            <SidebarItem
              icon={Activity}
              label="Chaos Control"
              isActive={activeView === "dashboard"}
              onClick={() => setActiveView("dashboard")}
            />
            <SidebarItem
              icon={ShieldAlert}
              label="Circuit Breakers"
              isActive={activeView === "circuit"}
              onClick={() => setActiveView("circuit")}
            />
            <SidebarItem
              icon={Signal}
              label="Edge Performance"
              isActive={activeView === "performance"}
              onClick={() => setActiveView("performance")}
            />
            <SidebarItem
              icon={Settings}
              label="Proxy Configuration"
              isActive={activeView === "settings"}
              onClick={() => setActiveView("settings")}
            />
          </nav>

          <div className="p-6">
            <div className="bg-rose-50 dark:bg-rose-950/20 p-4 rounded-2xl border border-rose-100 dark:border-rose-900/50">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 mb-2">
                <Bug size={16} />
                <span className="text-xs font-bold uppercase">QA Focus</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Test how your Frontend handles <b>503 Gateway Timeout</b> errors
                before they happen in production.
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
                API Gateway Chaos Dashboard
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
                Proactively testing API resilience through intentional fault
                injection.
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={injectChaos}
                disabled={isInjecting}
                className="flex items-center gap-3 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-2xl shadow-rose-500/40 active:scale-95 overflow-hidden"
              >
                {isInjecting ? (
                  <Activity className="animate-spin" size={20} />
                ) : (
                  <Zap size={20} />
                )}
                <span className="relative z-10">
                  {isInjecting ? "Injecting Faults..." : "Execute Chaos"}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
              </button>
            </div>
          </header>

          {/* Metrics Grid */}
          <div className="grid grid-cols-4 gap-6 mb-10">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                Circuit Breaker Status
              </span>
              <div className="flex items-center gap-3 mt-2">
                <div
                  className={`w-3 h-3 rounded-full animate-pulse ${
                    circuitBreaker === "Closed"
                      ? "bg-emerald-500"
                      : "bg-rose-500"
                  }`}
                />
                <span
                  className={`text-3xl font-black ${
                    circuitBreaker === "Closed"
                      ? "text-emerald-500"
                      : "text-rose-500"
                  }`}
                >
                  {circuitBreaker}
                </span>
              </div>
              <button
                onClick={resetCircuit}
                className="mt-4 text-[10px] font-bold text-indigo-500 uppercase tracking-widest hover:underline"
              >
                Reset Circuit
              </button>
            </div>

            {CHAOS_METRICS.map((v, i) => (
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
            {/* Chaos Control Panel */}
            <div className="col-span-5 space-y-6">
              <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                  <Settings size={22} className="text-rose-500" />
                  Fault Configuration
                </h3>

                <div className="space-y-6">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-4">
                      Select Attack Type
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setChaosType("latency")}
                        className={`p-4 rounded-2xl border-2 transition-all flex flex-col gap-2 ${
                          chaosType === "latency"
                            ? "border-indigo-500 bg-indigo-500/5"
                            : "border-slate-100 dark:border-slate-800"
                        }`}
                      >
                        <Clock
                          size={20}
                          className={
                            chaosType === "latency"
                              ? "text-indigo-500"
                              : "text-slate-400"
                          }
                        />
                        <span className="text-sm font-bold">Latency</span>
                      </button>
                      <button
                        onClick={() => setChaosType("error")}
                        className={`p-4 rounded-2xl border-2 transition-all flex flex-col gap-2 ${
                          chaosType === "error"
                            ? "border-rose-500 bg-rose-500/5"
                            : "border-slate-100 dark:border-slate-800"
                        }`}
                      >
                        <XCircle
                          size={20}
                          className={
                            chaosType === "error"
                              ? "text-rose-500"
                              : "text-slate-400"
                          }
                        />
                        <span className="text-sm font-bold">HTTP 5xx</span>
                      </button>
                    </div>
                  </div>

                  {chaosType === "latency" && (
                    <div className="animate-in fade-in slide-in-from-top-2">
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">
                          Delay Amount
                        </span>
                        <span className="text-sm font-mono font-bold text-indigo-500">
                          {latencyValue}ms
                        </span>
                      </div>
                      <input
                        type="range"
                        min="100"
                        max="5000"
                        step="100"
                        value={latencyValue}
                        onChange={(e) =>
                          setLatencyValue(parseInt(e.target.value))
                        }
                        className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      />
                    </div>
                  )}

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                      Impact Preview
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {chaosType === "latency"
                        ? `Requests to /v1/edge will be delayed by ${latencyValue}ms, simulating regional network congestion.`
                        : "Requests will immediately return a 503 Service Unavailable, triggering application-level error boundaries."}
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* Edge Logs & Metrics */}
            <div className="col-span-7 space-y-6">
              <section className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
                <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Terminal size={18} className="text-rose-400" />
                    <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Edge Proxy Trace
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500">
                    Instance: Edge-US-East-1
                  </div>
                </div>
                <div className="p-8 min-h-[400px] font-mono text-sm overflow-y-auto max-h-[500px]">
                  {logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-700 opacity-50 py-16">
                      <FastForward size={40} className="mb-4 animate-pulse" />
                      <p>Awaiting chaos execution...</p>
                    </div>
                  ) : (
                    logs.map((log, i) => (
                      <div
                        key={i}
                        className={`mb-2 leading-relaxed flex gap-3 ${
                          log.includes("Injecting")
                            ? "text-rose-400 font-bold"
                            : log.includes("ERROR") || log.includes("Circuit")
                              ? "text-amber-400"
                              : "text-indigo-400"
                        }`}
                      >
                        <span className="text-slate-700 select-none">
                          [{logs.length - i}]
                        </span>
                        <span>{log}</span>
                      </div>
                    ))
                  )}
                </div>
              </section>

              <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <BarChart3 size={18} className="text-indigo-500" /> Latency
                  Degradation
                </h3>
                <div className="w-full h-32 flex items-end gap-2">
                  {[45, 48, 42, 45, 300, 1200, 2400, 1800, 400, 45].map(
                    (val, i) => (
                      <div key={i} className="flex-1 group relative">
                        <div
                          className={`w-full rounded-t-lg transition-all duration-1000 ${val > 100 ? "bg-rose-500" : "bg-indigo-500"}`}
                          style={{
                            height: `${Math.min((val / 2500) * 100, 100)}%`,
                          }}
                        />
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded transition-all">
                          {val}ms
                        </div>
                      </div>
                    ),
                  )}
                </div>
                <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>Pre-Chaos</span>
                  <span>Fault Injected</span>
                  <span>Post-Recovery</span>
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
