import React, { useState, useEffect, useMemo } from "react";
import {
  Activity,
  ShieldCheck,
  Eye,
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
  Globe,
  FileJson,
  Accessibility,
  AlertTriangle,
  Info,
} from "lucide-react";

// Mock API Data containing both good and bad A11y metadata
const MOCK_API_RESPONSE = {
  products: [
    {
      id: 101,
      name: "Wireless Headphones",
      image_url: "https://assets.example.com/h1.jpg",
      metadata: {
        alt_text: "Matte black over-ear headphones with silver accents",
        aria_label: "View details for Wireless Headphones",
        role: "button",
      },
    },
    {
      id: 102,
      name: "Smart Watch",
      image_url: "https://assets.example.com/w1.jpg",
      metadata: {
        alt_text: null, // VIOLATION
        aria_label: "Smart Watch",
        role: "img",
      },
    },
  ],
};

const VIOLATION_TYPES = [
  {
    label: "Missing Alt Text",
    count: 12,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  {
    label: "Ambiguous Labels",
    count: 5,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    label: "Invalid ARIA Roles",
    count: 2,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    label: "Language Missing",
    count: 0,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
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
  const [isAuditing, setIsAuditing] = useState(false);
  const [logs, setLogs] = useState([]);
  const [activeView, setActiveView] = useState("dashboard");
  const [auditScore, setAuditScore] = useState(78);

  const runAudit = () => {
    setIsAuditing(true);
    setLogs([]);
    const steps = [
      "Fetching endpoint: /v1/products...",
      "Validating JSON Schema for A11y metadata...",
      "CHECK: field 'alt_text' exists in all image objects...",
      "⚠ VIOLATION: Product ID 102 missing 'alt_text'.",
      "CHECK: ARIA roles match permitted HTML mappings...",
      "PASSED: Role validation for 14/15 objects.",
      "Calculating semantic density score...",
      "Audit Complete: 1 Critical, 2 Warnings.",
    ];

    steps.forEach((step, i) => {
      setTimeout(() => {
        setLogs((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] ${step}`,
        ]);
        if (i === steps.length - 1) {
          setIsAuditing(false);
          setAuditScore((prev) => Math.min(prev + 2, 94));
        }
      }, i * 600);
    });
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors duration-300 font-sans">
        {/* Sidebar */}
        <aside className="w-72 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col fixed h-full z-10">
          <div className="p-8 flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/30">
              <Accessibility size={24} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight">A11yGuard</span>
              <span className="text-[10px] text-indigo-500 font-bold tracking-widest uppercase">
                Data Layer Auditor
              </span>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            <h3 className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
              Operations
            </h3>
            <SidebarItem
              icon={Activity}
              label="Live Audit Dashboard"
              isActive={activeView === "dashboard"}
              onClick={() => setActiveView("dashboard")}
            />
            <SidebarItem
              icon={FileJson}
              label="Schema Configuration"
              isActive={activeView === "schema"}
              onClick={() => setActiveView("schema")}
            />
            <SidebarItem
              icon={AlertTriangle}
              label="Violation Reports"
              isActive={activeView === "reports"}
              onClick={() => setActiveView("reports")}
            />
            <SidebarItem
              icon={Settings}
              label="Global Rules"
              isActive={activeView === "settings"}
              onClick={() => setActiveView("settings")}
            />
          </nav>

          <div className="p-6">
            <div className="bg-indigo-50 dark:bg-indigo-950/40 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/50">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-2">
                <Info size={16} />
                <span className="text-xs font-bold uppercase">Pro Tip</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Adding <code>alt_text</code> directly to your API response
                ensures mobile screen readers function correctly without extra
                logic.
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
                API Accessibility Auditor
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
                Ensuring semantic integrity at the protocol level.
              </p>
            </div>
            <button
              onClick={runAudit}
              disabled={isAuditing}
              className="group relative flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-2xl shadow-indigo-500/40 active:scale-95 overflow-hidden"
            >
              {isAuditing ? (
                <Activity className="animate-spin" size={20} />
              ) : (
                <Play size={20} />
              )}
              <span className="relative z-10">
                {isAuditing ? "Running Compliance Audit..." : "Start New Audit"}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
            </button>
          </header>

          {/* Key Metrics */}
          <div className="grid grid-cols-4 gap-6 mb-10">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                A11y Health Score
              </span>
              <div className="flex items-end gap-2 mt-2">
                <span
                  className={`text-5xl font-black ${auditScore > 90 ? "text-emerald-500" : "text-amber-500"}`}
                >
                  {auditScore}%
                </span>
                <span className="text-slate-400 text-sm mb-2">/ 100</span>
              </div>
              <div className="mt-4 w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 transition-all duration-1000"
                  style={{ width: `${auditScore}%` }}
                />
              </div>
            </div>

            {VIOLATION_TYPES.map((v, i) => (
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
                    <AlertCircle className={v.color} size={24} />
                  </div>
                </div>
              </div>
            )).slice(0, 3)}
          </div>

          <div className="grid grid-cols-12 gap-8">
            {/* Terminal/Logs Section */}
            <div className="col-span-7 space-y-6">
              <section className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
                <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Terminal size={18} className="text-indigo-400" />
                    <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Audit Terminal
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500">
                    NodeJS v20.x | Validator v4.2
                  </div>
                </div>
                <div className="p-8 min-h-[400px] font-mono text-sm overflow-y-auto max-h-[500px]">
                  {logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-700 opacity-50 py-20">
                      <Zap size={40} className="mb-4 animate-pulse" />
                      <p>System Idle. Initialise audit to see live trace.</p>
                    </div>
                  ) : (
                    logs.map((log, i) => (
                      <div
                        key={i}
                        className={`mb-2 leading-relaxed flex gap-3 ${log.includes("⚠") ? "text-amber-400" : "text-indigo-400"}`}
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

            {/* A11y Preview / Schema Section */}
            <div className="col-span-5 space-y-6">
              <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold flex items-center gap-2">
                    <Eye size={18} className="text-indigo-500" /> Screen Reader
                    Simulator
                  </h3>
                  <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded-full font-bold uppercase">
                    UI Proxy
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-l-4 border-emerald-500">
                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">
                      Speaker: VoiceOver (macOS)
                    </p>
                    <p className="italic text-slate-700 dark:text-slate-300">
                      "Link: View details for Wireless Headphones. Image: Matte
                      black over-ear headphones with silver accents."
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-l-4 border-rose-500">
                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">
                      Speaker: VoiceOver (macOS)
                    </p>
                    <p className="italic text-rose-600 dark:text-rose-400">
                      "Button: Smart Watch. Image: Unlabeled image. Product ID
                      102."
                    </p>
                    <div className="mt-2 text-[10px] flex items-center gap-1 text-rose-500 font-bold">
                      <AlertCircle size={10} /> CRITICAL: Contextual failure for
                      visually impaired users.
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <FileJson size={18} className="text-indigo-500" /> JSON
                  Validator Rules
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      rule: "image_metadata.alt_text",
                      status: "Required",
                      type: "String",
                    },
                    {
                      rule: "action_trigger.aria_label",
                      status: "Required",
                      type: "String",
                    },
                    {
                      rule: "component.role",
                      status: "Enforced",
                      type: "Enum",
                    },
                  ].map((r, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center text-sm p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <code className="text-indigo-500">{r.rule}</code>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          {r.type}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold">
                          {r.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>

      {/* Background decoration */}
      <div className="fixed top-0 right-0 -z-10 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 left-0 -z-10 w-[500px] h-[500px] bg-violet-500/5 blur-[120px] rounded-full pointer-events-none" />

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
