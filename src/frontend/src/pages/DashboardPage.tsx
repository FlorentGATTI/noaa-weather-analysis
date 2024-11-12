import { useQuery } from '@tanstack/react-query';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  ArrowUpIcon,
  ArrowDownIcon,
  MinusIcon
} from '@heroicons/react/24/outline';
import type { AnalysisMetric } from '../types/weather';

const mockData = [
  { date: '2024-01', temp: 20 },
  { date: '2024-02', temp: 22 },
  { date: '2024-03', temp: 21 },
  { date: '2024-04', temp: 23 },
];

const metrics: AnalysisMetric[] = [
  { name: 'Average Temperature', value: 23.5, change: 2.1, trend: 'up' },
  { name: 'Precipitation', value: 45.2, change: -5.3, trend: 'down' },
  { name: 'Wind Speed', value: 12.3, change: 0.2, trend: 'stable' },
];

const MetricCard = ({ metric }: { metric: AnalysisMetric }) => {
  const trendIcon = {
    up: <ArrowUpIcon className="h-5 w-5 text-green-500" />,
    down: <ArrowDownIcon className="h-5 w-5 text-red-500" />,
    stable: <MinusIcon className="h-5 w-5 text-gray-500" />
  }[metric.trend];

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-sm font-medium text-gray-500">{metric.name}</h3>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-semibold text-gray-900">
          {metric.value}
        </p>
        <p className="ml-2 flex items-center text-sm">
          {trendIcon}
          <span className={`ml-1 ${
            metric.trend === 'up' ? 'text-green-500' :
            metric.trend === 'down' ? 'text-red-500' :
            'text-gray-500'
          }`}>
            {metric.change > 0 ? '+' : ''}{metric.change}%
          </span>
        </p>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const { data: weatherData } = useQuery({
    queryKey: ['weather-summary'],
    queryFn: () => Promise.resolve(mockData)
  });

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex space-x-2">
          <button className="bg-white px-3 py-2 rounded-md shadow text-sm">
            Last 7 days
          </button>
          <button className="bg-white px-3 py-2 rounded-md shadow text-sm">
            Last 30 days
          </button>
          <button className="bg-white px-3 py-2 rounded-md shadow text-sm">
            Custom Range
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.name} metric={metric} />
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-medium mb-4">Temperature Trend</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weatherData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                padding={{ left: 30, right: 30 }}
              />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="temp"
                stroke="#2563eb"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
