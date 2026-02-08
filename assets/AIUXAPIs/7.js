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
  HeartPulse,
  Signal,
  Info,
  ExternalLink,
  MessageSquare,
  Clock,
  RefreshCcw,
  AlertTriangle,
} from "lucide-react";

// Health metrics for different regions
const REGION_HEALTH = [
  {
    id: "us-east",
    name: "US East (N. Virginia)",
    status: "Optimal",
    load: "12%",
    latency: "24ms",
  },
  {
    id: "us-west",
    name: "US West (Oregon)",
    status: "Optimal",
    load: "18%",
    latency: "31ms",
  },
  {
    id: "eu-west",
    name: "EU West (Ireland)",
    status: "Degraded",
    load: "84%",
    latency: "142ms",
  },
  {
    id: "ap-south",
    name: "AP South (Mumbai)",
    status: "Optimal",
    load: "42%",
    latency: "56ms",
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
  const [activeView, setActiveView] = useState("dashboard");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [healthLogs, setHealthLogs] = useState([]);

  // Mock "Status Translator" logic
  const translateStatus = (code) => {
    const map = {
      200: { text: "Users are browsing smoothly.", type: "success" },
      404: { text: "Some users can't find specific pages.", type: "warning" },
      500: {
        text: "Critical system failure. Users cannot checkout.",
        type: "danger",
      },
      429: {
        text: "Too many requests. System is slowing down users.",
        type: "warning",
      },
    };
    return map[code] || { text: "System state is stable.", type: "success" };
  };

  const simulateUpdate = () => {
    setIsRefreshing(true);
    const newLog = {
      time: new Date().toLocaleTimeString(),
      code: [200, 200, 429, 200, 500][Math.floor(Math.random() * 5)],
    };

    setTimeout(() => {
      setHealthLogs((prev) => [newLog, ...prev].slice(0, 10));
      setIsRefreshing(false);
    }, 800);
  };

  useEffect(() => {
    const interval = setInterval(simulateUpdate, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors duration-300 font-sans">
        {/* Sidebar */}
        <aside className="w-72 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col fixed h-full z-10">
          <div className="p-8 flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-xl shadow-emerald-500/30">
              <HeartPulse size={24} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight">HealthHUD</span>
              <span className="text-[10px] text-emerald-500 font-bold tracking-widest uppercase">
                Support Interface
              </span>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            <h3 className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
              Operations
            </h3>
            <SidebarItem
              icon={Activity}
              label="System Overview"
              isActive={activeView === "dashboard"}
              onClick={() => setActiveView("dashboard")}
            />
            <SidebarItem
              icon={Signal}
              label="Regional Latency"
              isActive={activeView === "regions"}
              onClick={() => setActiveView("regions")}
            />
            <SidebarItem
              icon={MessageSquare}
              label="Status Translator"
              isActive={activeView === "translator"}
              onClick={() => setActiveView("translator")}
            />
            <SidebarItem
              icon={BarChart3}
              label="Revenue Impact"
              isActive={activeView === "impact"}
              onClick={() => setActiveView("impact")}
            />
          </nav>

          <div className="p-6">
            <div className="bg-emerald-50 dark:bg-emerald-950/20 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/50">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-2">
                <Info size={16} />
                <span className="text-xs font-bold uppercase">System Note</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                EU-West-1 node is currently under heavy load. Traffic is being
                rerouted to US-East.
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
                Real-Time API Health HUD
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
                Human-readable monitoring for non-technical operations teams.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">
                  Live Pulse
                </span>
              </div>
              <button
                onClick={simulateUpdate}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <RefreshCcw
                  size={20}
                  className={isRefreshing ? "animate-spin" : ""}
                />
              </button>
            </div>
          </header>

          {/* Regional Health Grid */}
          <div className="grid grid-cols-4 gap-6 mb-10">
            {REGION_HEALTH.map((region) => (
              <div
                key={region.id}
                className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                    {region.name}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      region.status === "Optimal"
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-rose-500/10 text-rose-500"
                    }`}
                  >
                    {region.status}
                  </span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="block text-2xl font-black">
                      {region.latency}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">
                      Network Latency
                    </span>
                  </div>
                  <div className="w-16 h-8 flex items-end gap-1">
                    {[40, 60, 45, 90, 30].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-indigo-500/20 rounded-t-sm overflow-hidden"
                      >
                        <div
                          className="bg-indigo-500 w-full"
                          style={{ height: `${h}%` }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-12 gap-8">
            {/* Human-Readable Translator */}
            <div className="col-span-7 space-y-6">
              <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-bold text-xl flex items-center gap-2">
                    <MessageSquare size={22} className="text-emerald-500" />
                    Status Translator
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Business Context
                  </span>
                </div>

                <div className="space-y-4">
                  {healthLogs.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 flex flex-col items-center gap-3">
                      <Clock size={40} className="opacity-20" />
                      <p className="text-sm">Listening for API events...</p>
                    </div>
                  ) : (
                    healthLogs.map((log, idx) => {
                      const translated = translateStatus(log.code);
                      return (
                        <div
                          key={idx}
                          className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 transition-all animate-in fade-in slide-in-from-top-4 duration-500"
                        >
                          <div
                            className={`mt-1 p-2 rounded-lg ${
                              translated.type === "success"
                                ? "bg-emerald-500/10 text-emerald-500"
                                : translated.type === "danger"
                                  ? "bg-rose-500/10 text-rose-500"
                                  : "bg-amber-500/10 text-amber-500"
                            }`}
                          >
                            {log.code === 200 ? (
                              <CheckCircle2 size={18} />
                            ) : (
                              <AlertTriangle size={18} />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-bold text-sm">
                                Event: {log.code}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400">
                                {log.time}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                              {translated.text}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </section>
            </div>

            {/* Business Impact Panel */}
            <div className="col-span-5 space-y-6">
              <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="font-bold mb-6 flex items-center gap-2">
                  <BarChart size={18} className="text-indigo-500" /> Real-Time
                  Business Impact
                </h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-500">Cart Success Rate</span>
                      <span className="font-bold text-emerald-500">99.4%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[99.4%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-500">
                        Avg. API Latency Cost
                      </span>
                      <span className="font-bold text-amber-500">
                        -$12.40/min
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 w-[45%]" />
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase mb-2">
                    Support Action
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Detected rising 429 errors for 'ProductSearch' service.
                    Suggest alerting the marketing team to throttle current
                    campaign traffic.
                  </p>
                  <button className="mt-3 flex items-center gap-1.5 text-xs font-bold text-indigo-500 hover:underline">
                    Generate Incident Report <ExternalLink size={12} />
                  </button>
                </div>
              </section>

              <section className="bg-gradient-to-br from-emerald-600 to-teal-700 p-8 rounded-3xl text-white shadow-xl shadow-emerald-500/20">
                <h3 className="font-bold mb-2 flex items-center gap-2">
                  <Zap size={18} /> Optimization Insight
                </h3>
                <p className="text-sm text-emerald-100 leading-relaxed">
                  Translating <b>HTTP 429</b> to{" "}
                  <i>"System is slowing down users"</i> reduced average Support
                  ticket resolution time by 22% this quarter.
                </p>
                <div className="mt-4 flex gap-2">
                  <span className="text-[10px] bg-white/20 px-2 py-1 rounded font-bold">
                    UX DRIVEN
                  </span>
                  <span className="text-[10px] bg-white/20 px-2 py-1 rounded font-bold">
                    MONITORING
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
