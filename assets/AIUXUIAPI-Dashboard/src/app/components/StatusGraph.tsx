import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ApiProject, generateHistoricalData } from '../data/apis';

interface StatusGraphProps {
  api: ApiProject;
}

export function StatusGraph({ api }: StatusGraphProps) {
  const data = generateHistoricalData(api.latency);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {/* Latency Chart */}
      <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4">
        <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-4">
          Response Time (ms)
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis 
              dataKey="time" 
              stroke="#9ca3af" 
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#9ca3af" 
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '6px',
                color: '#fff'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="latency" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Request Volume Chart */}
      <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4">
        <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-4">
          Request Volume
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis 
              dataKey="time" 
              stroke="#9ca3af" 
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#9ca3af" 
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '6px',
                color: '#fff'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="requests" 
              stroke="#10b981" 
              fill="#10b981" 
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Error Rate Chart */}
      <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4">
        <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-4">
          Error Rate
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis 
              dataKey="time" 
              stroke="#9ca3af" 
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#9ca3af" 
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '6px',
                color: '#fff'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="errors" 
              stroke="#ef4444" 
              fill="#ef4444" 
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}