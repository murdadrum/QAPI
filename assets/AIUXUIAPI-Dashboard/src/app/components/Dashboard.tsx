import { Activity, Clock, AlertCircle, CheckCircle, Play, Terminal } from 'lucide-react';
import { ApiProject } from '../data/apis';
import { StatusGraph } from './StatusGraph';
import { A11yInsights } from './A11yInsights';
import { A11yAuditPanel } from './A11yAuditPanel';
import { useState } from 'react';

interface DashboardProps {
  api: ApiProject;
}

export function Dashboard({ api }: DashboardProps) {
  const [isExecuting, setIsExecuting] = useState(false);
  const [response, setResponse] = useState<string>('');
  const [auditLogs, setAuditLogs] = useState<string[]>([]);
  const [isAuditRunning, setIsAuditRunning] = useState(false);
  const baseAuditUrl = 'https://murdadrum.github.io/QAPI/';
  const mockGeneratorUrl = 'https://mockapi-gen-779175721635.us-west1.run.app';
  const isMockGenerator = api.id === 'ai-mock-generator';
  const isA11yAuditor = api.id === 'a11y-api-auditor';
  const isA11yTerminal = api.id === 'a11y-api-auditor-terminal';

  const getStatusInfo = (status: ApiProject['status']) => {
    switch (status) {
      case 'online':
        return { 
          label: 'Online', 
          color: 'text-emerald-500',
          bgColor: 'bg-emerald-500/10',
          icon: CheckCircle
        };
      case 'degraded':
        return { 
          label: 'Degraded', 
          color: 'text-amber-500',
          bgColor: 'bg-amber-500/10',
          icon: AlertCircle
        };
      case 'offline':
        return { 
          label: 'Offline', 
          color: 'text-red-500',
          bgColor: 'bg-red-500/10',
          icon: AlertCircle
        };
    }
  };

  const statusInfo = getStatusInfo(api.status);
  const StatusIcon = statusInfo.icon;

  const executeApi = () => {
    setIsExecuting(true);
    setResponse('');
    
    // Simulate API execution
    setTimeout(() => {
      const mockResponse = isA11yAuditor
        ? {
            status: 200,
            timestamp: new Date().toISOString(),
            latency: api.latency,
            audit: {
              endpointsScanned: 24,
              resourcesAudited: 412,
              complianceScore: 92,
              missingAltText: 10,
              missingAriaLabels: 5,
              missingRoles: 3,
              topViolations: [
                { rule: 'image.alt_text.required', count: 10 },
                { rule: 'aria.label.required', count: 5 },
                { rule: 'aria.role.missing', count: 3 }
              ]
            },
            summary: 'Accessibility metadata is present for 92% of audited content.'
          }
        : {
            status: 200,
            timestamp: new Date().toISOString(),
            latency: api.latency,
            data: {
              message: `Successfully executed ${api.name}`,
              apiId: api.id,
              focus: api.focus
            }
          };
      setResponse(JSON.stringify(mockResponse, null, 2));
      setIsExecuting(false);
    }, api.latency);
  };

  const runAudit = () => {
    setIsAuditRunning(true);
    setResponse('');
    setAuditLogs([]);

    const steps = [
      `Target URL: ${baseAuditUrl}`,
      'Fetching endpoint: /v1/products...',
      'Validating JSON Schema for A11y metadata...',
      "CHECK: field 'alt_text' exists in all image objects...",
      'VIOLATION: Product ID 102 missing alt_text.',
      'CHECK: ARIA roles match permitted HTML mappings...',
      'PASSED: Role validation for 14/15 objects.',
      'Calculating semantic density score...',
      'Audit complete: 1 Critical, 2 Warnings.',
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setAuditLogs((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] ${step}`,
        ]);
        if (index === steps.length - 1) {
          setIsAuditRunning(false);
          const auditResponse = {
            status: 200,
            timestamp: new Date().toISOString(),
            audit: {
              complianceScore: 78,
              criticalFindings: 1,
              warnings: 2,
              missingAltText: 12,
              ambiguousLabels: 5,
            },
            summary: 'Audit complete. Accessibility metadata requires attention.',
          };
          setResponse(JSON.stringify(auditResponse, null, 2));
        }
      }, index * 600);
    });
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-zinc-50 dark:bg-zinc-950">
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-zinc-50 dark:bg-zinc-950 pt-4 sm:pt-6 lg:pt-8 pb-4 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-2 lg:mb-4">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-zinc-900 dark:text-white mb-2">
              {api.name}
            </h2>
            <p className="text-sm lg:text-base text-zinc-600 dark:text-zinc-400">
              {api.description}
            </p>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${statusInfo.bgColor} self-start lg:self-auto`}>
            <StatusIcon className={`w-5 h-5 ${statusInfo.color}`} />
            <span className={`font-semibold text-sm ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
          </div>
        </div>

        {isMockGenerator && (
          <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden">
            <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
              <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                AI-Powered Mock Data Generator
              </span>
              <a
                href={mockGeneratorUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                Open in new tab
              </a>
            </div>
            <iframe
              src={mockGeneratorUrl}
              title="AI-Powered Mock Data Generator"
              className="w-full h-[72vh] min-h-[560px] bg-white"
              loading="lazy"
            />
          </div>
        )}

        {!isMockGenerator && (
          <>
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6 lg:mb-8">
          {isA11yAuditor ? (
            <>
              <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-purple-500/10">
                    <CheckCircle className="w-4 h-4 text-purple-500" />
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">Compliance</div>
                    <div className="text-xl font-bold text-zinc-900 dark:text-white">92%</div>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-500/10">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">Missing Alt Text</div>
                    <div className="text-xl font-bold text-zinc-900 dark:text-white">10</div>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-500/10">
                    <Clock className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">Audit Runtime</div>
                    <div className="text-xl font-bold text-zinc-900 dark:text-white">65ms</div>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10">
                    <Activity className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">Endpoints Audited</div>
                    <div className="text-xl font-bold text-zinc-900 dark:text-white">24</div>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4 col-span-2">
                <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">
                  Metadata Coverage
                </div>
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-600 dark:text-zinc-300">alt_text</span>
                    <span className="text-zinc-700 dark:text-zinc-200 font-semibold">94%</span>
                  </div>
                  <div className="w-full bg-zinc-100 dark:bg-zinc-700 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full w-[94%]"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-600 dark:text-zinc-300">aria-label</span>
                    <span className="text-zinc-700 dark:text-zinc-200 font-semibold">91%</span>
                  </div>
                  <div className="w-full bg-zinc-100 dark:bg-zinc-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full w-[91%]"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-600 dark:text-zinc-300">role</span>
                    <span className="text-zinc-700 dark:text-zinc-200 font-semibold">88%</span>
                  </div>
                  <div className="w-full bg-zinc-100 dark:bg-zinc-700 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full w-[88%]"></div>
                  </div>
                </div>
              </div>
            </>
          ) : isA11yTerminal ? (
            <>
              <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">A11y Health</div>
                    <div className="text-xl font-bold text-zinc-900 dark:text-white">78%</div>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-rose-500/10">
                    <AlertCircle className="w-4 h-4 text-rose-500" />
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">Missing Alt Text</div>
                    <div className="text-xl font-bold text-zinc-900 dark:text-white">12</div>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-500/10">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">Ambiguous Labels</div>
                    <div className="text-xl font-bold text-zinc-900 dark:text-white">5</div>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-orange-500/10">
                    <AlertCircle className="w-4 h-4 text-orange-500" />
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">Invalid Roles</div>
                    <div className="text-xl font-bold text-zinc-900 dark:text-white">2</div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-500/10">
                    <Clock className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">Latency</div>
                    <div className="text-xl font-bold text-zinc-900 dark:text-white">
                      {api.latency}ms
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10">
                    <Activity className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">Uptime</div>
                    <div className="text-xl font-bold text-zinc-900 dark:text-white">
                      {api.uptime}%
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-3 col-span-2">
            <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">Technology Stack</div>
            <div className="flex flex-wrap gap-2">
              {api.tech.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-xs font-medium rounded-full bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Showcase Info */}
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 rounded-lg border border-blue-200 dark:border-blue-900 p-4 lg:p-6 mb-6 lg:mb-8">
          <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
            What This Showcases
          </h3>
          <p className="text-sm lg:text-base text-zinc-700 dark:text-zinc-300">
            {api.showcase}
          </p>
        </div>

        {/* Execution Panel */}
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4 lg:p-6 mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
              {isA11yAuditor ? 'Run Accessibility Audit' : isA11yTerminal ? 'Start New Audit' : 'Execute API'}
            </h3>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
              {isA11yTerminal && (
                <div className="w-full sm:w-72">
                  <span className="sr-only">Audit URL</span>
                  <div className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-600 dark:text-zinc-300">
                    {baseAuditUrl}
                  </div>
                </div>
              )}
              <button
                onClick={isA11yTerminal ? runAudit : executeApi}
                disabled={(isA11yTerminal ? isAuditRunning : isExecuting) || api.status === 'offline'}
                className={`flex items-center justify-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                  (isA11yTerminal ? isAuditRunning : isExecuting) || api.status === 'offline'
                    ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-400 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {(isA11yTerminal ? isAuditRunning : isExecuting) ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {isA11yTerminal ? 'Auditing...' : 'Executing...'}
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    {isA11yAuditor ? 'Run Audit' : isA11yTerminal ? 'Start Audit' : 'Execute Request'}
                  </>
                )}
              </button>
            </div>
          </div>

          {response && (
            <div className="bg-zinc-900 dark:bg-black rounded-lg p-4 overflow-x-auto">
              <div className="flex items-center gap-2 mb-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium text-emerald-400">Response</span>
              </div>
              <pre className="text-xs sm:text-sm text-zinc-300">
                <code>{response}</code>
              </pre>
            </div>
          )}
        </div>

        {/* Monitoring Graphs */}
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
            {isA11yAuditor
              ? 'Accessibility Insights'
              : isA11yTerminal
              ? 'Audit Console'
              : 'Real-Time Monitoring'}
          </h3>
          {isA11yAuditor ? (
            <A11yInsights api={api} />
          ) : isA11yTerminal ? (
            <A11yAuditPanel logs={auditLogs} isRunning={isAuditRunning} />
          ) : (
            <StatusGraph api={api} />
          )}
        </div>
          </>
        )}
      </div>
    </div>
  );
}
