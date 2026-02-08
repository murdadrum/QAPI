import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type { ApiProject } from '../data/apis';

interface A11yInsightsProps {
  api: ApiProject;
}

const complianceTrend = [
  { time: '0s', score: 86 },
  { time: '10s', score: 88 },
  { time: '20s', score: 89 },
  { time: '30s', score: 91 },
  { time: '40s', score: 92 },
  { time: '50s', score: 93 },
  { time: '60s', score: 92 },
];

const missingMetadataTrend = [
  { time: '0s', altText: 16, ariaLabel: 9, role: 6 },
  { time: '10s', altText: 14, ariaLabel: 8, role: 6 },
  { time: '20s', altText: 13, ariaLabel: 7, role: 5 },
  { time: '30s', altText: 12, ariaLabel: 7, role: 4 },
  { time: '40s', altText: 11, ariaLabel: 6, role: 4 },
  { time: '50s', altText: 12, ariaLabel: 6, role: 3 },
  { time: '60s', altText: 10, ariaLabel: 5, role: 3 },
];

const endpointCoverage = [
  { endpoint: '/images', coverage: 84 },
  { endpoint: '/search', coverage: 91 },
  { endpoint: '/products', coverage: 96 },
  { endpoint: '/checkout', coverage: 89 },
];

export function A11yInsights({ api }: A11yInsightsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4">
        <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-4">
          Compliance Score Trend
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={complianceTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis dataKey="time" stroke="#9ca3af" style={{ fontSize: '12px' }} />
            <YAxis domain={[70, 100]} stroke="#9ca3af" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '6px',
                color: '#fff',
              }}
              formatter={(value: number) => [`${value}%`, 'Score']}
            />
            <Line type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4">
        <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-4">
          Missing Metadata (Last 60s)
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={missingMetadataTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis dataKey="time" stroke="#9ca3af" style={{ fontSize: '12px' }} />
            <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '6px',
                color: '#fff',
              }}
            />
            <Area type="monotone" dataKey="altText" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
            <Area type="monotone" dataKey="ariaLabel" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
            <Area type="monotone" dataKey="role" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4">
        <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-4">
          Endpoint Coverage
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={endpointCoverage} layout="vertical" margin={{ left: 24 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis type="number" domain={[0, 100]} stroke="#9ca3af" style={{ fontSize: '12px' }} />
            <YAxis
              type="category"
              dataKey="endpoint"
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
              width={80}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '6px',
                color: '#fff',
              }}
              formatter={(value: number) => [`${value}%`, 'Coverage']}
            />
            <Bar dataKey="coverage" fill="#6366f1" radius={[6, 6, 6, 6]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
