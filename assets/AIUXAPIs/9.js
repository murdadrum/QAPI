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
  Sparkles,
  Braces,
  Globe,
  Copy,
  Download,
  Code2,
  RefreshCcw,
  Wand2,
  History, // Ensured import is present
} from "lucide-react";

const GEN_METRICS = [
  {
    label: "Avg Gen Time",
    count: "1.4s",
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
  {
    label: "Schema Accuracy",
    count: "100%",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    label: "Data Diversity",
    count: "High",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    label: "Active Mocks",
    count: "24",
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

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState(
    "Create 50 users from France who are over 30 years old. Include full names, age, and professional email addresses.",
  );
  const [logs, setLogs] = useState([]);
  const [generatedJson, setGeneratedJson] = useState(null);
  const [activeView, setActiveView] = useState("generator");

  const simulateGeneration = () => {
    if (!prompt) return;
    setIsGenerating(true);
    setLogs([]);
    setGeneratedJson(null);

    const steps = [
      "Parsing natural language requirements...",
      "Consulting LLM for schema design...",
      "Generating 50 unique records based on 'France/Age > 30' criteria...",
      "Applying localization filters (FR-fr)...",
      "Validating output against Open API 3.1 standards...",
      "Finalizing mock endpoint: /v1/ai-gen/users_fr_30",
    ];

    steps.forEach((step, i) => {
      setTimeout(() => {
        setLogs((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] ${step}`,
        ]);
        if (i === steps.length - 1) {
          setIsGenerating(false);
          setGeneratedJson({
            status: "success",
            endpoint: "/v1/mock/users",
            data: [
              {
                id: "u_1",
                name: "Jean Dupont",
                age: 42,
                city: "Paris",
                email: "j.dupont@example.fr",
              },
              {
                id: "u_2",
                name: "Marie Curie",
                age: 38,
                city: "Lyon",
                email: "m.curie@research.fr",
              },
            ],
          });
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
              <Wand2 size={24} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight">
                MockGen.ai
              </span>
              <span className="text-[10px] text-indigo-500 font-bold tracking-widest uppercase">
                AI Data Architect
              </span>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            <h3 className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
              Core Tools
            </h3>
            <SidebarItem
              icon={Sparkles}
              label="AI Generator"
              isActive={activeView === "generator"}
              onClick={() => setActiveView("generator")}
            />
            <SidebarItem
              icon={Database}
              label="Mock Library"
              isActive={activeView === "library"}
              onClick={() => setActiveView("library")}
            />
            <SidebarItem
              icon={Globe}
              label="Global Deployments"
              isActive={activeView === "deploy"}
              onClick={() => setActiveView("deploy")}
            />
            <SidebarItem
              icon={Settings}
              label="API Keys & Config"
              isActive={activeView === "config"}
              onClick={() => setActiveView("config")}
            />
          </nav>

          <div className="p-6">
            <div className="bg-indigo-50 dark:bg-indigo-950/20 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/50">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-2">
                <Code2 size={16} />
                <span className="text-xs font-bold uppercase">Dev Tip</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Describe edge cases like <i>"missing fields"</i> or{" "}
                <i>"invalid characters"</i> to generate robust QA datasets
                instantly.
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
                AI-Powered Mock Data Generator
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
                Generate localized, scenario-specific API mocks using natural
                language.
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <History size={18} />
                Recent
              </button>
            </div>
          </header>

          {/* Metrics Grid */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            {GEN_METRICS.map((v, i) => (
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
            {/* Input Section */}
            <div className="col-span-7 space-y-6">
              <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                  <Sparkles size={22} className="text-indigo-500" />
                  Describe Your Dataset
                </h3>
                <textarea
                  className="w-full h-32 p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 focus:border-indigo-500 outline-none transition-all text-sm resize-none"
                  placeholder="e.g., Create 50 users from France who are over 30 years old..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <div className="mt-6 flex justify-between items-center">
                  <div className="flex gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full">
                      JSON
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full">
                      Localization: FR
                    </span>
                  </div>
                  <button
                    onClick={simulateGeneration}
                    disabled={isGenerating || !prompt}
                    className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-indigo-500/30"
                  >
                    {isGenerating ? (
                      <RefreshCcw className="animate-spin" size={20} />
                    ) : (
                      <Wand2 size={20} />
                    )}
                    {isGenerating
                      ? "AI is Architecting..."
                      : "Generate Mock API"}
                  </button>
                </div>
              </section>

              <section className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
                <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Terminal size={18} className="text-indigo-400" />
                    <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Generation Logs
                    </span>
                  </div>
                </div>
                <div className="p-8 min-h-[250px] font-mono text-sm overflow-y-auto max-h-[350px]">
                  {logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-700 opacity-50 py-12">
                      <Cpu size={40} className="mb-4 animate-pulse" />
                      <p>Awaiting natural language input...</p>
                    </div>
                  ) : (
                    logs.map((log, i) => (
                      <div
                        key={i}
                        className="mb-2 leading-relaxed flex gap-3 text-indigo-400"
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

            {/* Output Section */}
            <div className="col-span-5 space-y-6">
              <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col min-h-[600px]">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold flex items-center gap-2">
                    <Braces size={18} className="text-indigo-500" /> Mock Output
                  </h3>
                  <div className="flex gap-2">
                    <button className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-indigo-500">
                      <Copy size={16} />
                    </button>
                    <button className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-indigo-500">
                      <Download size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex-1 bg-slate-950 rounded-2xl p-6 font-mono text-xs overflow-auto relative">
                  {!generatedJson ? (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-800 text-center p-10">
                      <p>
                        Generated JSON will appear here after AI architecting.
                      </p>
                    </div>
                  ) : (
                    <pre className="text-indigo-400">
                      {JSON.stringify(generatedJson, null, 2)}
                    </pre>
                  )}
                </div>

                {generatedJson && (
                  <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                    <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase mb-2">
                      <CheckCircle2 size={14} /> Mock Ready
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                      Your endpoint is temporarily deployed at:
                    </p>
                    <div className="bg-slate-900 p-3 rounded-lg font-mono text-[10px] text-white flex justify-between items-center">
                      <span>https://mock.ai/v1/users_fr</span>
                      <ArrowRight size={14} className="text-emerald-500" />
                    </div>
                  </div>
                )}
              </section>

              <section className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-3xl text-white shadow-xl shadow-indigo-500/20">
                <h3 className="font-bold mb-2 flex items-center gap-2">
                  <Zap size={18} /> QA Advantage
                </h3>
                <p className="text-sm text-indigo-100 leading-relaxed">
                  Using LLMs for mock data ensures high semantic
                  variance—preventing bias in UI tests.
                </p>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
