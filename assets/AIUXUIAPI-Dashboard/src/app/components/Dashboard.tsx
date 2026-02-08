import { Activity, Clock, AlertCircle, CheckCircle, Play, Terminal } from 'lucide-react';
import { ApiProject } from '../data/apis';
import { StatusGraph } from './StatusGraph';
import { useState } from 'react';

interface DashboardProps {
  api: ApiProject;
}

export function Dashboard({ api }: DashboardProps) {
  const [isExecuting, setIsExecuting] = useState(false);
  const [response, setResponse] = useState<string>('');

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
      const mockResponse = {
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

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6 lg:mb-8">
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
              Execute API
            </h3>
            <button
              onClick={executeApi}
              disabled={isExecuting || api.status === 'offline'}
              className={`flex items-center justify-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                isExecuting || api.status === 'offline'
                  ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {isExecuting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Executing...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Execute Request
                </>
              )}
            </button>
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
            Real-Time Monitoring
          </h3>
          <StatusGraph api={api} />
        </div>
      </div>
    </div>
  );
}