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
  Wifi,
  WifiOff,
  CloudUpload,
  Save,
  RefreshCcw,
  History,
  AlertTriangle,
  DatabaseZap,
  HardDrive,
} from "lucide-react";

const SYNC_METRICS = [
  {
    label: "Local Persistence",
    count: "Enabled",
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
  {
    label: "Pending Syncs",
    count: "0",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    label: "Conflict Rate",
    count: "0.2%",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    label: "Storage Usage",
    count: "1.2MB",
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
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [logs, setLogs] = useState([]);
  const [localQueue, setLocalQueue] = useState([]);
  const [activeView, setActiveView] = useState("dashboard");

  const addLocalRecord = () => {
    const newRecord = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      data: "New user profile update",
    };

    setLogs((prev) => [
      `[${new Date().toLocaleTimeString()}] Action intercepted. Network: ${isOnline ? "Online" : "Offline"}`,
      ...prev,
    ]);

    if (!isOnline) {
      setLogs((prev) => [
        `[${new Date().toLocaleTimeString()}] Persistent storage: Writing to IndexedDB...`,
        ...prev,
      ]);
      setLocalQueue((prev) => [...prev, newRecord]);
    } else {
      setLogs((prev) => [
        `[${new Date().toLocaleTimeString()}] Sending directly to API: PATCH /v1/users/me`,
        ...prev,
      ]);
    }
  };

  const runSync = () => {
    if (!isOnline || localQueue.length === 0) return;
    setIsSyncing(true);
    setLogs((prev) => [
      `[${new Date().toLocaleTimeString()}] Sync Initiated: Processing ${localQueue.length} pending items...`,
      ...prev,
    ]);

    setTimeout(() => {
      setLogs((prev) => [
        `[${new Date().toLocaleTimeString()}] Reconciling IDB-Record-01 with Server-State...`,
        ...prev,
      ]);
    }, 600);

    setTimeout(() => {
      setLogs((prev) => [
        `[${new Date().toLocaleTimeString()}] SUCCESS: All items merged. Cleaning local cache.`,
        ...prev,
      ]);
      setLocalQueue([]);
      setIsSyncing(false);
    }, 1500);
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
              <span className="font-bold text-lg leading-tight">
                SyncEngine
              </span>
              <span className="text-[10px] text-indigo-500 font-bold tracking-widest uppercase">
                Persistence Guard
              </span>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            <h3 className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
              Storage Ops
            </h3>
            <SidebarItem
              icon={Activity}
              label="Sync Dashboard"
              isActive={activeView === "dashboard"}
              onClick={() => setActiveView("dashboard")}
            />
            <SidebarItem
              icon={Layers}
              label="Conflict Resolver"
              isActive={activeView === "conflicts"}
              onClick={() => setActiveView("conflicts")}
            />
            <SidebarItem
              icon={HardDrive}
              label="IndexedDB Viewer"
              isActive={activeView === "db"}
              onClick={() => setActiveView("db")}
            />
            <SidebarItem
              icon={History}
              label="Network History"
              isActive={activeView === "history"}
              onClick={() => setActiveView("history")}
            />
          </nav>

          <div className="p-6">
            <div className="bg-indigo-50 dark:bg-indigo-950/20 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/50">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-2">
                <DatabaseZap size={16} />
                <span className="text-xs font-bold uppercase">A11y Note</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Using <code>Background Sync API</code> ensures data reaches the
                server even if the user closes the tab.
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
                "Offline-First" Sync Tester
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
                Validating data reconciliation and UX patterns for intermittent
                connectivity.
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setIsOnline(!isOnline)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all border-2 ${
                  isOnline
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                    : "bg-rose-500/10 border-rose-500/20 text-rose-500"
                }`}
              >
                {isOnline ? <Wifi size={20} /> : <WifiOff size={20} />}
                {isOnline ? "Online" : "Offline"}
              </button>
              <button
                onClick={runSync}
                disabled={!isOnline || localQueue.length === 0 || isSyncing}
                className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-xl shadow-indigo-500/30"
              >
                {isSyncing ? (
                  <RefreshCcw className="animate-spin" size={20} />
                ) : (
                  <CloudUpload size={20} />
                )}
                {isSyncing ? "Syncing..." : "Sync Now"}
              </button>
            </div>
          </header>

          {/* Metrics Grid */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                Queue Status
              </span>
              <div className="flex items-end gap-2 mt-2">
                <span
                  className={`text-5xl font-black ${localQueue.length > 0 ? "text-amber-500" : "text-emerald-500"}`}
                >
                  {localQueue.length}
                </span>
                <span className="text-slate-400 text-sm mb-2">Pending</span>
              </div>
              <div className="mt-4 w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 transition-all duration-500"
                  style={{ width: `${Math.min(localQueue.length * 10, 100)}%` }}
                />
              </div>
            </div>

            {SYNC_METRICS.map((v, i) => (
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
                    {v.label.includes("Pending") ? (
                      <RefreshCcw size={24} className={v.color} />
                    ) : (
                      <Activity className={v.color} size={24} />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-12 gap-8">
            {/* Logic Execution Logs */}
            <div className="col-span-7 space-y-6">
              <section className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
                <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Terminal size={18} className="text-indigo-400" />
                    <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Persistence Logs
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500">
                    Service: Sync-Manager-v4
                  </div>
                </div>
                <div className="p-8 min-h-[350px] font-mono text-sm overflow-y-auto max-h-[450px]">
                  {logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-700 opacity-50 py-16">
                      <Save size={40} className="mb-4 animate-pulse" />
                      <p>
                        Toggle offline and perform an action to see persistence
                        logs.
                      </p>
                    </div>
                  ) : (
                    logs.map((log, i) => (
                      <div
                        key={i}
                        className={`mb-2 leading-relaxed flex gap-3 ${log.includes("SUCCESS") ? "text-emerald-400" : log.includes("Offline") ? "text-rose-400" : "text-indigo-400"}`}
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

            {/* Persistence Tester Panel */}
            <div className="col-span-5 space-y-6">
              <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold flex items-center gap-2">
                    <Save size={18} className="text-indigo-500" /> Interaction
                    Sandbox
                  </h3>
                  <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded-full font-bold uppercase">
                    Demo Only
                  </span>
                </div>

                <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                  Trigger an update while <b>Offline</b> to see how the sync
                  engine queues requests for later reconciliation.
                </p>

                <button
                  onClick={addLocalRecord}
                  className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all mb-4 border border-slate-200 dark:border-slate-700"
                >
                  <RefreshCcw size={18} />
                  Update User Profile
                </button>

                <div className="flex-1 space-y-3 mt-4">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                    Local Sync Queue (IndexedDB)
                  </h4>
                  {localQueue.length === 0 ? (
                    <div className="text-center py-8 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                      <p className="text-xs text-slate-400">Queue is empty</p>
                    </div>
                  ) : (
                    localQueue.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-between"
                      >
                        <div>
                          <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                            ID: {item.id}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            {item.timestamp}
                          </p>
                        </div>
                        <AlertTriangle className="text-amber-500" size={14} />
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                  <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-2xl text-white shadow-xl shadow-indigo-500/20">
                    <h4 className="font-bold mb-2 flex items-center gap-2">
                      <Zap size={18} /> Architecture Tip
                    </h4>
                    <p className="text-xs text-indigo-100 leading-relaxed">
                      Implement <b>Axios Interceptors</b> to automatically
                      redirect failed requests to a local service worker during
                      downtime.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
