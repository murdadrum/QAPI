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
  ShoppingCart,
  UserCheck,
  Package,
  CreditCard,
  History,
  Workflow,
  RefreshCcw,
  XCircle,
} from "lucide-react";

const SYNTHETIC_METRICS = [
  {
    label: "Avg Flow Time",
    count: "1.24s",
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
  {
    label: "Success Rate",
    count: "99.2%",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    label: "P95 Latency",
    count: "1.82s",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    label: "Error Rate",
    count: "0.8%",
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

const FlowStepper = ({ currentStep, isFailing }) => {
  const steps = [
    { id: 1, label: "Authorize", icon: UserCheck },
    { id: 2, label: "Search", icon: Search },
    { id: 3, label: "Add to Cart", icon: ShoppingCart },
    { id: 4, label: "Checkout", icon: CreditCard },
  ];

  return (
    <div className="relative flex justify-between items-center w-full px-4">
      {/* Background Line */}
      <div className="absolute left-10 right-10 h-1 bg-slate-100 dark:bg-slate-800 z-0 top-[18px]" />

      {steps.map((step, idx) => {
        const isCompleted = currentStep > step.id;
        const isCurrent = currentStep === step.id;
        const hasFailed = isFailing && isCurrent;

        return (
          <div
            key={step.id}
            className="relative z-10 flex flex-col items-center gap-2 group"
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all duration-500 ${
                isCompleted
                  ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                  : hasFailed
                    ? "bg-rose-500 border-rose-500 text-white animate-shake"
                    : isCurrent
                      ? "bg-white dark:bg-slate-900 border-indigo-500 text-indigo-500 shadow-lg shadow-indigo-500/20"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400"
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 size={20} />
              ) : (
                <step.icon size={20} />
              )}
            </div>
            <span
              className={`text-[10px] font-bold uppercase tracking-widest ${
                isCurrent ? "text-indigo-500" : "text-slate-400"
              }`}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState([]);
  const [activeView, setActiveView] = useState("dashboard");
  const [healthScore, setHealthScore] = useState(98);

  const runSyntheticTest = () => {
    setIsExecuting(true);
    setCurrentStep(1);
    setLogs([]);

    const sequence = [
      { step: 1, msg: "POST /v1/auth/login - Requesting Bearer Token..." },
      { step: 1, msg: "Success: Token received (Expires in 3600s)." },
      {
        step: 2,
        msg: "GET /v1/catalog/search?q=headphones - Validating inventory...",
      },
      { step: 2, msg: "Found 12 matches. Response time: 45ms." },
      {
        step: 3,
        msg: "POST /v1/cart/add - Payload: { product_id: 'H101', qty: 1 }",
      },
      { step: 3, msg: "Validation: Cart total updated to $129.99." },
      { step: 4, msg: "POST /v1/checkout/process - Initiating transaction..." },
      { step: 4, msg: "Order #8921 created successfully. Flow Complete." },
    ];

    sequence.forEach((item, i) => {
      setTimeout(() => {
        setLogs((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] ${item.msg}`,
        ]);
        setCurrentStep(item.step);
        if (i === sequence.length - 1) {
          setIsExecuting(false);
          setHealthScore((prev) => Math.min(prev + 1, 100));
        }
      }, i * 800);
    });
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors duration-300 font-sans">
        {/* Sidebar */}
        <aside className="w-72 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col fixed h-full z-10">
          <div className="p-8 flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/30">
              <Workflow size={24} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight">
                SyntheticFlow
              </span>
              <span className="text-[10px] text-indigo-500 font-bold tracking-widest uppercase">
                UX Path Monitor
              </span>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            <h3 className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
              Monitoring
            </h3>
            <SidebarItem
              icon={Activity}
              label="Journey Dashboard"
              isActive={activeView === "dashboard"}
              onClick={() => setActiveView("dashboard")}
            />
            <SidebarItem
              icon={History}
              label="Flow History"
              isActive={activeView === "history"}
              onClick={() => setActiveView("history")}
            />
            <SidebarItem
              icon={Timer}
              label="Latency Correlation"
              isActive={activeView === "latency"}
              onClick={() => setActiveView("latency")}
            />
            <SidebarItem
              icon={Settings}
              label="Global Thresholds"
              isActive={activeView === "settings"}
              onClick={() => setActiveView("settings")}
            />
          </nav>

          <div className="p-6">
            <div className="bg-indigo-50 dark:bg-indigo-950/20 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/50">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-2">
                <Package size={16} />
                <span className="text-xs font-bold uppercase">
                  Flow Insight
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Adding a "Search" step before "Checkout" improved catch-rate for
                catalog synchronization errors by 15%.
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
                Synthetic User Flow Monitor
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
                Validating critical business paths (Login → Search → Checkout)
                via API choreography.
              </p>
            </div>
            <button
              onClick={runSyntheticTest}
              disabled={isExecuting}
              className="group relative flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-2xl shadow-indigo-500/40 active:scale-95 overflow-hidden"
            >
              {isExecuting ? (
                <Activity className="animate-spin" size={20} />
              ) : (
                <Play size={20} />
              )}
              <span className="relative z-10">
                {isExecuting ? "Simulating User Journey..." : "Run Flow Test"}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
            </button>
          </header>

          {/* Metrics Grid */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                Flow Reliability
              </span>
              <div className="flex items-end gap-2 mt-2">
                <span
                  className={`text-5xl font-black ${healthScore > 90 ? "text-emerald-500" : "text-amber-500"}`}
                >
                  {healthScore}%
                </span>
                <span className="text-slate-400 text-sm mb-2">/ 100</span>
              </div>
              <div className="mt-4 w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 transition-all duration-1000"
                  style={{ width: `${healthScore}%` }}
                />
              </div>
            </div>

            {SYNTHETIC_METRICS.map((v, i) => (
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
            {/* User Flow Visualizer */}
            <div className="col-span-7 space-y-6">
              <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h3 className="font-bold text-xl flex items-center gap-2">
                      <Layers size={22} className="text-indigo-500" />
                      Active Flow Progress
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      Real-time status of sequential API dependencies.
                    </p>
                  </div>
                </div>
                <FlowStepper currentStep={currentStep} />
              </section>

              <section className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
                <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Terminal size={18} className="text-indigo-400" />
                    <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Synthetic Execution Trace
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500">
                    Service: k6-Runner-04 | User-Agent: Synthetic-Browser
                  </div>
                </div>
                <div className="p-8 min-h-[300px] font-mono text-sm overflow-y-auto max-h-[400px]">
                  {logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-700 opacity-50 py-16">
                      <RefreshCcw size={40} className="mb-4 animate-pulse" />
                      <p>Trigger a flow test to see transaction logs...</p>
                    </div>
                  ) : (
                    logs.map((log, i) => (
                      <div
                        key={i}
                        className={`mb-2 leading-relaxed flex gap-3 ${log.includes("Success") || log.includes("Complete") ? "text-emerald-400 font-bold" : "text-indigo-400"}`}
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

            {/* Performance Correlation Panel */}
            <div className="col-span-5 space-y-6">
              <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold flex items-center gap-2">
                    <BarChart size={18} className="text-indigo-500" /> Latency
                    by Step
                  </h3>
                  <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded-full font-bold uppercase">
                    Trend Analysis
                  </span>
                </div>

                <div className="space-y-6">
                  {[
                    { label: "Auth Handshake", time: "124ms", percent: 15 },
                    { label: "Search Query", time: "45ms", percent: 8 },
                    { label: "Cart Update", time: "82ms", percent: 12 },
                    { label: "Payment Gateway", time: "840ms", percent: 65 },
                  ].map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-slate-500 font-medium">
                          {item.label}
                        </span>
                        <span className="font-bold">{item.time}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-1000 ${item.percent > 50 ? "bg-amber-500" : "bg-indigo-500"}`}
                          style={{ width: `${item.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-3xl text-white shadow-xl shadow-indigo-500/20">
                <h3 className="font-bold mb-2 flex items-center gap-2">
                  <Zap size={18} /> Optimization Tip
                </h3>
                <p className="text-sm text-indigo-100 leading-relaxed">
                  The <b>Payment Gateway</b> step accounts for 65% of the total
                  journey duration. Implementing asynchronous webhooks could
                  improve the perceived UX by 40%.
                </p>
                <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase opacity-60">
                    Status
                  </span>
                  <span className="text-xs bg-emerald-500 px-2 py-1 rounded font-bold">
                    Flow Optimized
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
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out infinite;
        }
      `,
        }}
      />
    </div>
  );
}
