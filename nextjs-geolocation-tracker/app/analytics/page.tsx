'use client';

import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';

interface AnalyticsData {
  overview: {
    totalTracks: number;
    uniqueIPs: number;
    gpsEnabled: number;
    gpsPercentage: number;
    avgAccuracy: number;
  };
  timeStats: {
    last24Hours: number;
    last7Days: number;
    last30Days: number;
  };
  topCountries: Array<{ country: string; count: number }>;
  topCities: Array<{ city: string; count: number }>;
  deviceStats: Array<{ device: string; count: number }>;
  hourlyData: number[];
  dailyData: number[];
  recentTracks: any[];
}

export default function AnalyticsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/admin');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadAnalytics();
    }
  }, [isAuthenticated]);

  const loadAnalytics = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analytics');
      const data = await response.json();

      if (data.success) {
        setAnalytics(data.analytics);
      } else {
        setError(data.message || 'Failed to load analytics');
      }
    } catch (err) {
      setError('Failed to load analytics');
      console.error('Analytics error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || !isAuthenticated) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-8">
            📊 Analytics Dashboard
          </h1>
          <LoadingSpinner text="Loading analytics..." />
        </div>
      </Layout>
    );
  }

  if (error || !analytics) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-8">
            📊 Analytics Dashboard
          </h1>
          <div className="card bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <p className="text-red-700 dark:text-red-400">{error || 'Failed to load analytics'}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showNavigation={true}>
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">
            📊 Analytics Dashboard
          </h1>
          <button onClick={loadAnalytics} className="btn-primary">
            🔄 Refresh
          </button>
        </header>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
            <h3 className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">
              Total Tracks
            </h3>
            <p className="text-3xl font-bold text-blue-800 dark:text-blue-200">
              {analytics.overview.totalTracks}
            </p>
          </div>

          <div className="card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
            <h3 className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">
              Unique IPs
            </h3>
            <p className="text-3xl font-bold text-green-800 dark:text-green-200">
              {analytics.overview.uniqueIPs}
            </p>
          </div>

          <div className="card bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
            <h3 className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-2">
              GPS Enabled
            </h3>
            <p className="text-3xl font-bold text-purple-800 dark:text-purple-200">
              {analytics.overview.gpsEnabled}
            </p>
            <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
              {analytics.overview.gpsPercentage}%
            </p>
          </div>

          <div className="card bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20">
            <h3 className="text-sm font-medium text-amber-600 dark:text-amber-400 mb-2">
              Avg Accuracy
            </h3>
            <p className="text-3xl font-bold text-amber-800 dark:text-amber-200">
              ±{analytics.overview.avgAccuracy}m
            </p>
          </div>

          <div className="card bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
            <h3 className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">
              Last 24 Hours
            </h3>
            <p className="text-3xl font-bold text-red-800 dark:text-red-200">
              {analytics.timeStats.last24Hours}
            </p>
          </div>
        </div>

        {/* Time Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
              ⏰ Time-Based Stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Last 24 Hours</span>
                <span className="font-bold text-gray-800 dark:text-gray-200">
                  {analytics.timeStats.last24Hours}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Last 7 Days</span>
                <span className="font-bold text-gray-800 dark:text-gray-200">
                  {analytics.timeStats.last7Days}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Last 30 Days</span>
                <span className="font-bold text-gray-800 dark:text-gray-200">
                  {analytics.timeStats.last30Days}
                </span>
              </div>
            </div>
          </div>

          {/* Device Stats */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
              📱 Device Types
            </h3>
            <div className="space-y-3">
              {analytics.deviceStats.map((stat, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">{stat.device}</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">
                    {stat.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Countries */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
              🌍 Top Countries
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {analytics.topCountries.slice(0, 5).map((country, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400 truncate">
                    {country.country}
                  </span>
                  <span className="font-bold text-gray-800 dark:text-gray-200 ml-2">
                    {country.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hourly Activity Chart */}
        <div className="card mb-8">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
            📈 Hourly Activity (Last 24 Hours)
          </h3>
          <div className="flex items-end justify-between gap-1 h-64">
            {analytics.hourlyData.map((count, hour) => {
              const maxCount = Math.max(...analytics.hourlyData, 1);
              const height = (count / maxCount) * 100;
              
              return (
                <div key={hour} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-amber-500 dark:bg-amber-600 rounded-t hover:bg-amber-600 dark:hover:bg-amber-500 transition-colors cursor-pointer relative group"
                    style={{ height: `${height}%`, minHeight: count > 0 ? '4px' : '0' }}
                    title={`${hour}:00 - ${count} tracks`}
                  >
                    <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {count}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {hour % 3 === 0 ? hour : ''}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Daily Activity Chart */}
        <div className="card mb-8">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
            📅 Daily Activity (Last 30 Days)
          </h3>
          <div className="flex items-end justify-between gap-1 h-64">
            {analytics.dailyData.map((count, day) => {
              const maxCount = Math.max(...analytics.dailyData, 1);
              const height = (count / maxCount) * 100;
              
              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-blue-500 dark:bg-blue-600 rounded-t hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors cursor-pointer relative group"
                    style={{ height: `${height}%`, minHeight: count > 0 ? '4px' : '0' }}
                    title={`Day ${day + 1} - ${count} tracks`}
                  >
                    <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {count}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {day % 5 === 0 ? 30 - day : ''}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Cities */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
            🏙️ Top Cities
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics.topCities.slice(0, 9).map((city, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  {city.city}
                </span>
                <span className="bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-3 py-1 rounded-full text-sm font-bold">
                  {city.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

