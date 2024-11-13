// src/types/weather.ts

export interface WeatherData {
  date: string;
  humidity?: number;
  windSpeed?: number;
  precipitation?: number;
  temperature?: number;
  station?: string;
}

export interface WeatherSummary {
  location: string;
  currentTemp: number;
  humidity: number;
  windSpeed: number;
  conditions: string;
  lastUpdated: string;
}

export interface AnalysisMetric {
  name: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

export interface WeatherFilters {
  dateRange: DateRange;
  location?: string;
  startDate?: string;
  endDate?: string;
}

export type DateRange = '7d' | '30d' | 'custom';
