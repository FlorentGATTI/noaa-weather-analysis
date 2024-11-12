import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

interface AnalysisParams {
  startDate: string;
  endDate: string;
  metrics: string[];
  stations: string[];
  analysisType: 'correlation' | 'trend' | 'comparison';
}

const defaultParams: AnalysisParams = {
  startDate: '2024-01-01',
  endDate: '2024-03-31',
  metrics: ['temperature', 'precipitation'],
  stations: ['1', '2'],
  analysisType: 'correlation'
};

const AnalysisPage = () => {
  const [params, setParams] = useState<AnalysisParams>(defaultParams);

  const { data: analysisData, isLoading } = useQuery({
    queryKey: ['analysis', params],
    queryFn: () => Promise.resolve([
      { x: 20, y: 50, date: '2024-01-01' },
      { x: 22, y: 55, date: '2024-01-02' },
      { x: 25, y: 45, date: '2024-01-03' },
      // ... plus de données
    ])
  });

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Data Analysis</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Generate Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-medium mb-4">Analysis Parameters</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Analysis Type
                </label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  value={params.analysisType}
                  onChange={(e) => setParams({
                    ...params,
                    analysisType: e.target.value as AnalysisParams['analysisType']
                  })}
                >
                  <option value="correlation">Correlation Analysis</option>
                  <option value="trend">Trend Analysis</option>
                  <option value="comparison">Station Comparison</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date Range
                </label>
                <input
                  type="date"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  value={params.startDate}
                  onChange={(e) => setParams({ ...params, startDate: e.target.value })}
                />
                <input
                  type="date"
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm"
                  value={params.endDate}
                  onChange={(e) => setParams({ ...params, endDate: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Metrics
                </label>
                <select
                  multiple
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  value={params.metrics}
                  onChange={(e) => setParams({
                    ...params,
                    metrics: Array.from(e.target.selectedOptions, option => option.value)
                  })}
                >
                  <option value="temperature">Temperature</option>
                  <option value="precipitation">Precipitation</option>
                  <option value="humidity">Humidity</option>
                  <option value="windSpeed">Wind Speed</option>
                  <option value="pressure">Pressure</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Weather Stations
                </label>
                <select
                  multiple
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  value={params.stations}
                  onChange={(e) => setParams({
                    ...params,
                    stations: Array.from(e.target.selectedOptions, option => option.value)
                  })}
                >
                  <option value="1">Station A</option>
                  <option value="2">Station B</option>
                  <option value="3">Station C</option>
                  <option value="4">Station D</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Run Analysis
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-96 bg-white rounded-lg shadow">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-lg font-medium mb-4">Analysis Results</h2>
                <div className="h-96">
                  {params.analysisType === 'correlation' ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart>
                        <CartesianGrid />
                        <XAxis type="number" dataKey="x" name="temperature" />
                        <YAxis type="number" dataKey="y" name="precipitation" />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                        <Scatter data={analysisData} fill="#8884d8" />
                      </ScatterChart>
                    </ResponsiveContainer>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analysisData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="x" stroke="#8884d8" />
                        <Line type="monotone" dataKey="y" stroke="#82ca9d" />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-lg font-medium mb-4">Statistical Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">Correlation Coefficient</h3>
                    <p className="mt-1 text-2xl font-semibold">0.87</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">R-squared</h3>
                    <p className="mt-1 text-2xl font-semibold">0.76</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">P-value</h3>
                    <p className="mt-1 text-2xl font-semibold">0.001</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-lg font-medium mb-4">Analysis Notes</h2>
                <div className="prose max-w-none">
                  <p>
                    This analysis shows a strong positive correlation between temperature and precipitation
                    in the selected time period. The high R-squared value indicates that the model explains
                    76% of the variability in the data.
                  </p>
                  <h3 className="text-base font-medium mt-4">Key Findings:</h3>
                  <ul className="list-disc pl-5">
                    <li>Strong positive correlation (r = 0.87)</li>
                    <li>Statistically significant (p &lt; 0.05)</li>
                    <li>Linear relationship between variables</li>
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;
