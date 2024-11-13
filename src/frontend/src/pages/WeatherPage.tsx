import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import type { WeatherData } from '../types/weather';

const mockStations = [
  { id: '1', name: 'Station A' },
  { id: '2', name: 'Station B' },
  { id: '3', name: 'Station C' },
];

const mockWeatherData: WeatherData[] = [
  {
    date: '2024-03-01',
    temperature: 22,
    humidity: 65,
    precipitation: 0,
    windSpeed: 12,
    station: 'Station A'
  },
  {
    date: '2024-04-02',
    temperature: 30,
    humidity: 40,
    precipitation: 0,
    windSpeed: 6,
    station: 'Station B'
  },
  {
    date: '2024-06-07',
    temperature: 35,
    humidity: 20,
    precipitation: 0,
    windSpeed: 2,
    station: 'Station C'
  },
];

const WeatherPage = () => {
  const [selectedStation, setSelectedStation] = useState<string>('1');
  const [dateRange, setDateRange] = useState<string>('week');

  const { data: weatherData } = useQuery({
    queryKey: ['weather-data', selectedStation, dateRange],
    queryFn: () => Promise.resolve(mockWeatherData)
  });

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Weather Data</h1>
        <div className="flex space-x-4">
          <select
            className="bg-white rounded-md shadow px-3 py-2"
            value={selectedStation}
            onChange={(e) => setSelectedStation(e.target.value)}
          >
            {mockStations.map((station) => (
              <option key={station.id} value={station.id}>
                {station.name}
              </option>
            ))}
          </select>
          <select
            className="bg-white rounded-md shadow px-3 py-2"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="day">Last 24 hours</option>
            <option value="week">Last 7 days</option>
            <option value="month">Last 30 days</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-medium mb-4">Temperature & Humidity</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weatherData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="temperature" fill="#2563eb" name="Temperature" />
                <Bar dataKey="humidity" fill="#7c3aed" name="Humidity" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-medium mb-4">Wind & Precipitation</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weatherData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="windSpeed" fill="#059669" name="Wind Speed" />
                <Bar dataKey="precipitation" fill="#0284c7" name="Precipitation" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-3 border-b border-gray-200">
          <h2 className="text-lg font-medium">Detailed Data</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Temperature
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Humidity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Wind Speed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precipitation
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {weatherData?.map((data) => (
                <tr key={data.date}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {data.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {data.temperature}°C
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {data.humidity}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {data.windSpeed} km/h
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {data.precipitation} mm
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WeatherPage;
