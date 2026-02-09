import { AlertCircle, Eye, FileJson, Terminal, Zap } from 'lucide-react';

interface A11yAuditPanelProps {
  logs: string[];
  isRunning: boolean;
}

const rules = [
  {
    rule: 'accessible_name',
    status: 'Required',
    type: 'String',
    detail: 'Readable label for buttons, links, toggles, and icons.',
  },
  {
    rule: 'role',
    status: 'Enforced',
    type: 'Enum',
    detail: 'Explicit role for interactive controls and custom components.',
  },
  {
    rule: 'state',
    status: 'Required',
    type: 'Object',
    detail: 'Tracks expanded, pressed, selected, or disabled status.',
  },
  {
    rule: 'group_context',
    status: 'Required',
    type: 'String',
    detail: 'Defines grouping for related controls (nav, cards, modals).',
  },
  {
    rule: 'focus_order',
    status: 'Enforced',
    type: 'Array',
    detail: 'Deterministic tab order for keyboard navigation.',
  },
];

const siteRecommendations = [
  'Primary nav + mobile menu: ensure toggle has an accessible name and state (expanded/collapsed).',
  'Theme toggle: expose pressed state and descriptive label (e.g., "Switch to dark mode").',
  'Chat widget + modals: trap focus and return focus on close.',
  'Project demo buttons: include accessible name that matches card title.',
  'Dashboard embed: provide a descriptive title and a visible focus outline.',
];

export function A11yAuditPanel({ logs, isRunning }: A11yAuditPanelProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <div className="lg:col-span-7 space-y-4">
        <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-900/60 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-blue-400" />
              <span className="font-mono text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Audit Terminal
              </span>
            </div>
            <div className="text-[10px] font-mono text-zinc-500">
              NodeJS v20.x | Validator v4.2
            </div>
          </div>
          <div className="p-5 min-h-[320px] font-mono text-xs sm:text-sm overflow-y-auto max-h-[420px]">
            {logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-zinc-600 py-10">
                <Zap className={`w-8 h-8 mb-3 ${isRunning ? 'animate-pulse text-blue-400' : ''}`} />
                <p>System idle. Start a new audit to stream validation logs.</p>
              </div>
            ) : (
              logs.map((log, idx) => (
                <div
                  key={idx}
                  className={`mb-2 leading-relaxed flex gap-3 ${log.includes('VIOLATION') ? 'text-amber-400' : 'text-blue-300'}`}
                >
                  <span className="text-zinc-600 select-none">[{idx + 1}]</span>
                  <span>{log}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="lg:col-span-5 space-y-4">
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm text-zinc-900 dark:text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-500" /> Screen Reader Simulator
            </h3>
            <span className="text-[10px] bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded-full font-semibold uppercase">
              UI Proxy
            </span>
          </div>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-zinc-50 dark:bg-zinc-900/40 rounded-lg border-l-4 border-emerald-500">
              <p className="text-[10px] text-zinc-400 font-semibold uppercase mb-1">
                VoiceOver (macOS)
              </p>
              <p className="italic text-zinc-700 dark:text-zinc-300">
                "Link: View details for Wireless Headphones. Image: Matte black over-ear headphones."
              </p>
            </div>
            <div className="p-3 bg-zinc-50 dark:bg-zinc-900/40 rounded-lg border-l-4 border-rose-500">
              <p className="text-[10px] text-zinc-400 font-semibold uppercase mb-1">
                VoiceOver (macOS)
              </p>
              <p className="italic text-rose-600 dark:text-rose-400">
                "Button: Smart Watch. Image: Unlabeled image. Product ID 102."
              </p>
              <div className="mt-2 text-[10px] flex items-center gap-1 text-rose-500 font-semibold">
                <AlertCircle className="w-3 h-3" /> CRITICAL: Missing alt_text metadata.
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4">
          <h3 className="font-semibold text-sm text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
            <FileJson className="w-4 h-4 text-blue-500" /> JSON Validator Rules
          </h3>
          <div className="space-y-2 text-xs">
            {rules.map((rule) => (
              <div
                key={rule.rule}
                className="p-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <code className="text-blue-600 dark:text-blue-300">{rule.rule}</code>
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1">
                      {rule.detail}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold text-zinc-400 uppercase">
                      {rule.type}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 text-[10px] font-semibold text-zinc-600 dark:text-zinc-300">
                      {rule.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4">
          <h3 className="font-semibold text-sm text-zinc-900 dark:text-white mb-3">
            Site-Specific Recommendations
          </h3>
          <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-300 list-disc list-inside">
            {siteRecommendations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
