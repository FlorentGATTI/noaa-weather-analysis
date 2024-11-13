// src/hooks/useWeatherData.ts

import { useQuery } from '@tanstack/react-query';
import { WeatherData, WeatherSummary, WeatherFilters } from '../types/weather';
import axios from '../services/axios';

const fetchWeatherData = async (filters: WeatherFilters): Promise<WeatherData[]> => {
  const { data } = await axios.get('/api/weather', { params: filters });
  return data;
};

const fetchWeatherSummary = async (location: string): Promise<WeatherSummary> => {
  const { data } = await axios.get(`/api/weather/summary/${location}`);
  return data;
};

export const useWeatherData = (filters: WeatherFilters) => {
  return useQuery({
    queryKey: ['weather-data', filters],
    queryFn: () => fetchWeatherData(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useWeatherSummary = (location: string) => {
  return useQuery({
    queryKey: ['weather-summary', location],
    queryFn: () => fetchWeatherSummary(location),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useMetrics = () => {
  return useQuery({
    queryKey: ['weather-metrics'],
    queryFn: async () => {
      const { data } = await axios.get('/api/weather/metrics');
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
