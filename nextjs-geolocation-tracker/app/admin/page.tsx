'use client';

import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import { Track, AdminStats } from '../types';

export default function AdminPage() {
  const { isAuthenticated, isLoading: authLoading, login, logout } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (isAuthenticated) {
      loadTracks();
    }
  }, [isAuthenticated]);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    const success = await login(username, password);
    
    if (!success) {
      setLoginError('Invalid username or password');
    }
  };
  
  const loadTracks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/tracks');
      const data = await response.json();
      
      if (data.success) {
        setTracks(data.tracks);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to load tracks:', error);
    }
    setIsLoading(false);
  };
  
  const exportData = async () => {
    try {
      const response = await fetch('/api/admin/export');
      const data = await response.json();
      
      if (data.success) {
        const blob = new Blob([JSON.stringify(data.tracks, null, 2)], {
          type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `tracking-data-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Failed to export data:', error);
    }
  };
  
  if (authLoading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }
  
  if (!isAuthenticated) {
    return (
      <Layout showThemeToggle={false}>
        <div className="max-w-md mx-auto mt-20">
          <div className="card">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
              🔐 Admin Login
            </h1>
            
            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {loginError}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              
              <button type="submit" className="w-full btn-primary">
                Login
              </button>
            </form>
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
            📊 Admin Dashboard
          </h1>
          <button onClick={logout} className="btn-secondary">
            Logout
          </button>
        </header>
        
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Total Tracks
              </h3>
              <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                {stats.totalTracks}
              </p>
            </div>
            
            <div className="card">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Last 24 Hours
              </h3>
              <p className="text-3xl font-bold text-amber-600">
                {stats.last24Hours}
              </p>
            </div>
            
            <div className="card">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Unique IPs
              </h3>
              <p className="text-3xl font-bold text-blue-600">
                {stats.uniqueIPs}
              </p>
            </div>
            
            <div className="card">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                GPS Enabled
              </h3>
              <p className="text-3xl font-bold text-green-600">
                {stats.gpsEnabled}
              </p>
            </div>
          </div>
        )}
        
        {/* Actions */}
        <div className="flex gap-4 mb-6">
          <button onClick={loadTracks} className="btn-primary">
            🔄 Refresh
          </button>
          <button onClick={exportData} className="btn-secondary">
            📥 Export Data
          </button>
        </div>
        
        {/* Tracks Table */}
        <div className="card overflow-x-auto">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Recent Tracks
          </h2>
          
          {isLoading ? (
            <LoadingSpinner />
          ) : tracks.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">No tracks yet</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    IP Address
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    GPS
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {tracks.map((track) => (
                  <tr key={track.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {new Date(track.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {track.clientIP}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {track.ipLocation
                        ? `${track.ipLocation.city}, ${track.ipLocation.country}`
                        : 'N/A'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {track.latitude && track.longitude ? (
                        <a
                          href={`https://www.google.com/maps?q=${track.latitude},${track.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-600 hover:text-amber-700"
                        >
                          View Map 🗺️
                        </a>
                      ) : (
                        <span className="text-gray-400">No GPS</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  );
}

