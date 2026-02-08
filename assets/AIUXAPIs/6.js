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
  Handshake,
  FileCheck,
  GitMerge,
  Network,
  XCircle,
  Link2,
  RefreshCcw,
} from "lucide-react";

const CONTRACT_METRICS = [
  {
    label: "Verified Pacts",
    count: "142",
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
  {
    label: "Consumer Coverage",
    count: "94%",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    label: "Provider Drifts",
    count: "1",
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  {
    label: "Sync Latency",
    count: "0.4s",
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

const ContractMatrix = () => {
  const interactions = [
    {
      consumer: "Web-Frontend",
      provider: "Auth-Service",
      status: "pass",
      time: "2m ago",
    },
    {
      consumer: "Mobile-App",
      provider: "Auth-Service",
      status: "pass",
      time: "5m ago",
    },
    {
      consumer: "Web-Frontend",
      provider: "Inventory-API",
      status: "fail",
      time: "Just now",
    },
    {
      consumer: "Order-Worker",
      provider: "Inventory-API",
      status: "pass",
      time: "12m ago",
    },
    {
      consumer: "Analytics-UI",
      provider: "Data-Warehouse",
      status: "pass",
      time: "1h ago",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50">
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Consumer
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Provider
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Status
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">
                Last Verified
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {interactions.map((item, idx) => (
              <tr
                key={idx}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                    <span className="text-sm font-semibold">
                      {item.consumer}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-500 dark:text-slate-400 font-mono">
                    {item.provider}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {item.status === "pass" ? (
                    <div className="flex items-center gap-1.5 text-emerald-500">
                      <CheckCircle2 size={16} />
                      <span className="text-xs font-bold uppercase tracking-tight">
                        Verified
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-rose-500">
                      <XCircle size={16} />
                      <span className="text-xs font-bold uppercase tracking-tight">
                        Broken
                      </span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-xs text-slate-400 font-medium">
                    {item.time}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center px-2">
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
              Compatible
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-rose-500" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
              Breaking Change
            </span>
          </div>
        </div>
        <button className="text-[10px] font-bold text-indigo-500 uppercase hover:underline">
          View Pact Broker →
        </button>
      </div>
    </div>
  );
};

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [logs, setLogs] = useState([]);
  const [activeView, setActiveView] = useState("dashboard");
  const [guardScore, setGuardScore] = useState(96);

  const runContractTest = () => {
    setIsVerifying(true);
    setLogs([]);
    const steps = [
      "Fetching Pacts from Broker for 'Inventory-API'...",
      "Found 2 active consumer contracts (Web, Order-Worker).",
      "Verifying interaction: 'GET /stock/item-101'...",
      "SUCCESS: Response matches Web-Frontend expectations.",
      "Verifying interaction: 'PATCH /stock/update'...",
      "⚠ FAILURE: Provider missing required field 'warehouse_id'.",
      "PACT ERROR: Interaction expected 'warehouse_id' (UUID), but received nothing.",
      "Result: Contract broken for consumer 'Web-Frontend'.",
      "CI Status: Deployment blocked for 'Inventory-API' v2.0.4.",
    ];

    steps.forEach((step, i) => {
      setTimeout(() => {
        setLogs((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] ${step}`,
        ]);
        if (i === steps.length - 1) {
          setIsVerifying(false);
          setGuardScore((prev) => Math.max(prev - 8, 88));
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
              <Handshake size={24} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight">
                PactShield
              </span>
              <span className="text-[10px] text-indigo-500 font-bold tracking-widest uppercase">
                Contract Guardian
              </span>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            <h3 className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
              Contract Ops
            </h3>
            <SidebarItem
              icon={Activity}
              label="Verification Matrix"
              isActive={activeView === "dashboard"}
              onClick={() => setActiveView("dashboard")}
            />
            <SidebarItem
              icon={FileCheck}
              label="Pact Definitions"
              isActive={activeView === "definitions"}
              onClick={() => setActiveView("definitions")}
            />
            <SidebarItem
              icon={Network}
              label="Dependency Graph"
              isActive={activeView === "graph"}
              onClick={() => setActiveView("graph")}
            />
            <SidebarItem
              icon={GitMerge}
              label="Can-I-Deploy?"
              isActive={activeView === "deploy"}
              onClick={() => setActiveView("deploy")}
            />
          </nav>

          <div className="p-6">
            <div className="bg-indigo-50 dark:bg-indigo-950/20 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/50">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-2">
                <Link2 size={16} />
                <span className="text-xs font-bold uppercase">
                  Active Broker
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Pact Broker connected at <code>broker.pact.internal</code>.
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
                The Contract Guardian
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
                Pact-based contract testing to prevent breaking changes across
                microservices.
              </p>
            </div>
            <button
              onClick={runContractTest}
              disabled={isVerifying}
              className="group relative flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-2xl shadow-indigo-500/40 active:scale-95 overflow-hidden"
            >
              {isVerifying ? (
                <Activity className="animate-spin" size={20} />
              ) : (
                <FileCheck size={20} />
              )}
              <span className="relative z-10">
                {isVerifying
                  ? "Verifying Contracts..."
                  : "Trigger Verification"}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
            </button>
          </header>

          {/* Metrics Grid */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                System Stability
              </span>
              <div className="flex items-end gap-2 mt-2">
                <span
                  className={`text-5xl font-black ${guardScore > 90 ? "text-emerald-500" : "text-amber-500"}`}
                >
                  {guardScore}%
                </span>
                <span className="text-slate-400 text-sm mb-2">/ 100</span>
              </div>
              <div className="mt-4 w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 transition-all duration-1000"
                  style={{ width: `${guardScore}%` }}
                />
              </div>
            </div>

            {CONTRACT_METRICS.map((v, i) => (
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
            {/* Contract Matrix */}
            <div className="col-span-7 space-y-6">
              <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="font-bold text-xl flex items-center gap-2">
                      <Network size={22} className="text-indigo-500" />
                      Verification Matrix
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      Status of consumer expectations vs provider
                      implementations.
                    </p>
                  </div>
                </div>
                <ContractMatrix />
              </section>

              <section className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
                <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Terminal size={18} className="text-indigo-400" />
                    <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Pact Verification Trace
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500">
                    Node: Pact-Runner-West
                  </div>
                </div>
                <div className="p-8 min-h-[300px] font-mono text-sm overflow-y-auto max-h-[500px]">
                  {logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-700 opacity-50 py-16">
                      <RefreshCcw size={40} className="mb-4 animate-pulse" />
                      <p>Awaiting verification trigger...</p>
                    </div>
                  ) : (
                    logs.map((log, i) => (
                      <div
                        key={i}
                        className={`mb-2 leading-relaxed flex gap-3 ${log.includes("⚠") || log.includes("FAILURE") || log.includes("ERROR") ? "text-rose-400 font-bold" : "text-indigo-400"}`}
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

            {/* Contract Analysis Panel */}
            <div className="col-span-5 space-y-6">
              <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold flex items-center gap-2">
                    <Layers size={18} className="text-indigo-500" /> Interaction
                    Failure
                  </h3>
                  <span className="text-[10px] bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 px-2 py-1 rounded-full font-bold uppercase">
                    Critical
                  </span>
                </div>

                <div className="space-y-6">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-l-4 border-slate-400">
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">
                      Consumer Expectation
                    </p>
                    <div className="bg-slate-900 p-3 rounded-lg font-mono text-[10px] text-indigo-400 mt-2">
                      <span className="opacity-50">"method": "PATCH"</span>
                      <br />
                      <span className="opacity-50">
                        "path": "/stock/update"
                      </span>
                      <br />
                      <span className="text-emerald-500">
                        {'"body": { "warehouse_id": "UUID" }'}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-rose-50 dark:bg-rose-900/10 rounded-2xl border-l-4 border-rose-500">
                    <p className="text-[10px] text-rose-600 dark:text-rose-400 font-bold uppercase mb-1">
                      Provider Reality
                    </p>
                    <p className="text-sm font-medium mt-1">
                      The provider implementation for <code>Inventory-API</code>{" "}
                      removed support for <code>warehouse_id</code> in the
                      latest commit.
                    </p>
                    <div className="mt-2 text-[10px] flex items-center gap-1 text-rose-500 font-bold">
                      <AlertCircle size={10} /> BREAKING: Provider drifted from
                      Consumer contract.
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-gradient-to-br from-emerald-600 to-teal-700 p-8 rounded-3xl text-white shadow-xl shadow-emerald-500/20">
                <h3 className="font-bold mb-2 flex items-center gap-2">
                  <ShieldCheck size={18} /> Safe Deployment
                </h3>
                <p className="text-sm text-emerald-100 leading-relaxed">
                  Contract testing replaces slow integration tests by allowing
                  services to verify compatibility in isolation using "Pacts."
                </p>
                <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase opacity-60">
                    Status
                  </span>
                  <span className="text-xs bg-emerald-500 px-2 py-1 rounded font-bold">
                    Protected
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
