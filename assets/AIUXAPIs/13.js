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
  Palette,
  Type,
  Move,
  Focus,
  Sparkles,
  RefreshCcw,
  ShieldAlert,
  FileSearch,
  Eye,
  MessageSquare,
  Ruler,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

const SYSTEM_METRICS = [
  {
    label: "System Health",
    count: "84%",
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
  {
    label: "Violations",
    count: "12",
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  {
    label: "A11y Pass",
    count: "92%",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    label: "Design Debt",
    count: "Medium",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
];

const VIOLATIONS = [
  {
    id: "v1",
    category: "Color",
    type: "Contrast",
    target: "text-muted-foreground",
    issue: "Ratio 3.2:1 (Fails WCAG AA)",
    ai_remediation:
      "This text color is too light against the white background. Users with low vision will struggle to read functional metadata.",
    suggestion: "Update #8E8E8E to #767676",
    severity: "High",
  },
  {
    id: "v2",
    category: "Spacing",
    type: "Consistency",
    target: "card-padding",
    issue: "Expected 16px, found 18px",
    ai_remediation:
      'Inconsistent padding breaks the vertical rhythm of the dashboard, making the interface feel "cluttered" or unprofessional.',
    suggestion: "Apply var(--spacing-4)",
    severity: "Low",
  },
  {
    id: "v3",
    category: "Typography",
    type: "Scale",
    target: "h2-font-size",
    issue: "Value (23px) not in 4pt scale",
    ai_remediation:
      "Off-scale font sizes lead to sub-pixel rendering issues on lower-resolution displays.",
    suggestion: "Snap 23px to 24px (text-2xl)",
    severity: "Medium",
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

const TokenCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
    <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
      <Icon className={color} size={20} />
    </div>
    <div>
      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">
        {label}
      </span>
      <span className="text-sm font-mono font-bold">{value}</span>
    </div>
  </div>
);

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [activeView, setActiveView] = useState("audit");
  const [isAuditing, setIsAuditing] = useState(false);
  const [logs, setLogs] = useState([]);
  const [selectedViolation, setSelectedViolation] = useState(VIOLATIONS[0]);
  const [fixedPreview, setFixedPreview] = useState(false);

  const runAudit = () => {
    setIsAuditing(true);
    setLogs([]);
    const steps = [
      "Connecting to Figma/Style-Dictionary bridge...",
      "Fetching global design tokens...",
      "Linting color palette for WCAG 2.1 contrast compliance...",
      "⚠ Found contrast violation: text-muted-foreground.",
      "Comparing component instances against spacing scale...",
      "⚠ Spacing drift detected in 'DashboardCard' component.",
      "Validating typography hierarchy...",
      "Audit complete: 12 inconsistencies found.",
    ];

    steps.forEach((step, i) => {
      setTimeout(() => {
        setLogs((prev) => [
          `[${new Date().toLocaleTimeString()}] ${step}`,
          ...prev,
        ]);
        if (i === steps.length - 1) setIsAuditing(false);
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
              <Focus size={24} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight">
                TokenGuard
              </span>
              <span className="text-[10px] text-indigo-500 font-bold tracking-widest uppercase">
                System Auditor
              </span>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            <h3 className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
              Core Analysis
            </h3>
            <SidebarItem
              icon={Activity}
              label="Design Audit"
              isActive={activeView === "audit"}
              onClick={() => setActiveView("audit")}
            />
            <SidebarItem
              icon={Layers}
              label="Token Browser"
              isActive={activeView === "browser"}
              onClick={() => setActiveView("browser")}
            />
            <SidebarItem
              icon={ShieldCheck}
              label="A11y Inspector"
              isActive={activeView === "a11y"}
              onClick={() => setActiveView("a11y")}
            />
            <SidebarItem
              icon={Settings}
              label="System Config"
              isActive={activeView === "settings"}
              onClick={() => setActiveView("settings")}
            />
          </nav>

          <div className="p-6">
            <div className="bg-indigo-50 dark:bg-indigo-950/20 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/50">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-2">
                <Sparkles size={16} />
                <span className="text-xs font-bold uppercase">AI Insight</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Consistency is up <b>12%</b> since last audit. Snap typography
                to 4pt scale to hit 90%.
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
                Design System QA Auditor
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
                Automating visual quality and accessibility linting for tokens
                and components.
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={runAudit}
                disabled={isAuditing}
                className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-2xl shadow-indigo-500/40 active:scale-95 overflow-hidden"
              >
                {isAuditing ? (
                  <Activity className="animate-spin" size={20} />
                ) : (
                  <FileSearch size={20} />
                )}
                <span className="relative z-10">
                  {isAuditing ? "Scanning System..." : "Start Audit"}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
              </button>
            </div>
          </header>

          {/* Metrics Grid */}
          <div className="grid grid-cols-4 gap-6 mb-10">
            {SYSTEM_METRICS.map((v, i) => (
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
            {/* Audit Logs & Violations */}
            <div className="col-span-8 space-y-8">
              <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <h3 className="font-bold text-xl flex items-center gap-2">
                    <ShieldAlert size={22} className="text-rose-500" />
                    Active Violations
                  </h3>
                  <div className="flex gap-2">
                    <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 uppercase">
                      Critical: 2
                    </span>
                  </div>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {VIOLATIONS.map((violation) => (
                    <div
                      key={violation.id}
                      onClick={() => setSelectedViolation(violation)}
                      className={`p-6 cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center justify-between ${
                        selectedViolation?.id === violation.id
                          ? "bg-indigo-50/50 dark:bg-indigo-950/20"
                          : ""
                      }`}
                    >
                      <div className="flex gap-4">
                        <div
                          className={`p-3 rounded-xl ${
                            violation.severity === "High"
                              ? "bg-rose-500/10 text-rose-500"
                              : violation.severity === "Medium"
                                ? "bg-amber-500/10 text-amber-500"
                                : "bg-blue-500/10 text-blue-500"
                          }`}
                        >
                          {violation.category === "Color" ? (
                            <Palette size={20} />
                          ) : violation.category === "Typography" ? (
                            <Type size={20} />
                          ) : (
                            <Ruler size={20} />
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm">
                            {violation.target}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {violation.issue}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-1 rounded border ${
                            violation.severity === "High"
                              ? "border-rose-200 text-rose-500"
                              : "border-slate-200 text-slate-400"
                          }`}
                        >
                          {violation.severity}
                        </span>
                        <ArrowRight size={16} className="text-slate-300" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
                <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Terminal size={18} className="text-indigo-400" />
                    <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Audit Trace
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500">
                    Sync: Figma Variables
                  </div>
                </div>
                <div className="p-8 min-h-[200px] font-mono text-sm overflow-y-auto max-h-[300px]">
                  {logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-700 opacity-50 py-10">
                      <Search size={32} className="mb-2" />
                      <p>Run system audit to begin scan.</p>
                    </div>
                  ) : (
                    logs.map((log, i) => (
                      <div
                        key={i}
                        className={`mb-2 leading-relaxed flex gap-3 ${log.includes("⚠") ? "text-amber-400" : "text-indigo-400"}`}
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
            </div>

            {/* AI Insight & Before/After */}
            <div className="col-span-4 space-y-6">
              <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare size={20} className="text-indigo-500" />
                  <h3 className="font-bold">AI Remediation Agent</h3>
                </div>

                <div className="bg-indigo-50 dark:bg-indigo-950/30 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 mb-6">
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                    "{selectedViolation.ai_remediation}"
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Recommended Fix
                  </h4>
                  <div className="p-4 bg-slate-950 rounded-xl font-mono text-xs flex justify-between items-center group">
                    <span className="text-emerald-400">
                      {selectedViolation.suggestion}
                    </span>
                    <button className="text-slate-500 hover:text-white transition-colors">
                      <RefreshCcw size={14} />
                    </button>
                  </div>
                  <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/20">
                    Apply Token Fix
                  </button>
                </div>
              </section>

              <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold flex items-center gap-2">
                    <Eye size={18} className="text-indigo-500" /> Visual Preview
                  </h3>
                  <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                    <button
                      onClick={() => setFixedPreview(false)}
                      className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${!fixedPreview ? "bg-white dark:bg-slate-900 shadow-sm text-indigo-500" : "text-slate-400"}`}
                    >
                      BEFORE
                    </button>
                    <button
                      onClick={() => setFixedPreview(true)}
                      className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${fixedPreview ? "bg-white dark:bg-slate-900 shadow-sm text-emerald-500" : "text-slate-400"}`}
                    >
                      AFTER
                    </button>
                  </div>
                </div>

                <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center gap-4">
                  <div
                    className={`transition-all duration-500 p-6 rounded-2xl shadow-xl w-full max-w-xs ${
                      fixedPreview ? "bg-indigo-600" : "bg-slate-300"
                    }`}
                  >
                    <div className="h-4 w-1/2 bg-white/20 rounded mb-2" />
                    <div className="h-4 w-3/4 bg-white/20 rounded" />
                    <div
                      className={`mt-4 h-10 w-full rounded-lg transition-all ${
                        fixedPreview
                          ? "bg-white text-indigo-600"
                          : "bg-white/30 text-white/50"
                      } flex items-center justify-center text-[10px] font-bold`}
                    >
                      {fixedPreview ? "ACCESSIBLE BUTTON" : "LOW CONTRAST"}
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium text-center">
                    {fixedPreview
                      ? "Contrast ratio: 4.8:1 (AAA)"
                      : "Contrast ratio: 2.1:1 (FAIL)"}
                  </p>
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
