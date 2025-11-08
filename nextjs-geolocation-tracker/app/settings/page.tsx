'use client';

import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useCookieConsent } from '../hooks/useCookieConsent';

interface Config {
  trackingPages: {
    [key: string]: {
      enabled: boolean;
      url: string;
      theme: string;
      title: string;
      subtitle: string;
      loadingText: string;
    };
  };
}

export default function SettingsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { hasConsent, acceptCookies, declineCookies } = useCookieConsent();
  
  const [config, setConfig] = useState<Config | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Privacy settings
  const [enableTracking, setEnableTracking] = useState(true);
  const [enableGPS, setEnableGPS] = useState(true);
  const [enableIPTracking, setEnableIPTracking] = useState(true);
  const [dataRetentionDays, setDataRetentionDays] = useState(90);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/admin');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadConfig();
      loadPrivacySettings();
    }
  }, [isAuthenticated]);

  const loadConfig = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/config');
      const data = await response.json();

      if (data.success) {
        setConfig(data.config);
      }
    } catch (error) {
      console.error('Failed to load config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPrivacySettings = () => {
    // Load from localStorage
    const tracking = localStorage.getItem('enableTracking');
    const gps = localStorage.getItem('enableGPS');
    const ip = localStorage.getItem('enableIPTracking');
    const retention = localStorage.getItem('dataRetentionDays');

    if (tracking !== null) setEnableTracking(tracking === 'true');
    if (gps !== null) setEnableGPS(gps === 'true');
    if (ip !== null) setEnableIPTracking(ip === 'true');
    if (retention !== null) setDataRetentionDays(parseInt(retention));
  };

  const savePrivacySettings = () => {
    localStorage.setItem('enableTracking', enableTracking.toString());
    localStorage.setItem('enableGPS', enableGPS.toString());
    localStorage.setItem('enableIPTracking', enableIPTracking.toString());
    localStorage.setItem('dataRetentionDays', dataRetentionDays.toString());

    setMessage({ type: 'success', text: 'Privacy settings saved successfully!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const saveConfig = async () => {
    if (!config) return;

    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Configuration saved successfully!' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to save configuration' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save configuration' });
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const clearAllData = async () => {
    if (!confirm('Are you sure you want to clear all tracking data? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch('/api/admin/tracks', {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'All tracking data cleared successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to clear data' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to clear data' });
      console.error('Clear data error:', error);
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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-8">
            ⚙️ Settings
          </h1>
          <LoadingSpinner text="Loading settings..." />
        </div>
      </Layout>
    );
  }

  return (
    <Layout showNavigation={true}>
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            ⚙️ Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your tracking preferences and privacy settings
          </p>
        </header>

        {/* Message Banner */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
                : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Privacy Settings */}
        <div className="card mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
            🔒 Privacy Settings
          </h2>

          <div className="space-y-6">
            {/* Cookie Consent */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                  Cookie Consent
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Current status: {hasConsent ? '✅ Accepted' : '❌ Not accepted'}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={acceptCookies} className="btn-primary text-sm">
                  Accept
                </button>
                <button onClick={declineCookies} className="btn-secondary text-sm">
                  Decline
                </button>
              </div>
            </div>

            {/* Enable Tracking */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                  Enable Tracking
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Allow location tracking on your pages
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableTracking}
                  onChange={(e) => setEnableTracking(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 dark:peer-focus:ring-amber-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-amber-600"></div>
              </label>
            </div>

            {/* Enable GPS */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                  Enable GPS Tracking
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Request precise GPS coordinates from users
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableGPS}
                  onChange={(e) => setEnableGPS(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 dark:peer-focus:ring-amber-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-amber-600"></div>
              </label>
            </div>

            {/* Enable IP Tracking */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                  Enable IP Tracking
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Track approximate location via IP address
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableIPTracking}
                  onChange={(e) => setEnableIPTracking(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 dark:peer-focus:ring-amber-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-amber-600"></div>
              </label>
            </div>

            {/* Data Retention */}
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Data Retention Period
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Automatically delete tracking data older than this many days
              </p>
              <input
                type="number"
                min="1"
                max="365"
                value={dataRetentionDays}
                onChange={(e) => setDataRetentionDays(parseInt(e.target.value))}
                className="w-32 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <span className="ml-2 text-gray-600 dark:text-gray-400">days</span>
            </div>

            <button onClick={savePrivacySettings} className="btn-primary w-full">
              💾 Save Privacy Settings
            </button>
          </div>
        </div>

        {/* Tracking Pages Configuration */}
        {config && (
          <div className="card mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
              📄 Tracking Pages
            </h2>

            <div className="space-y-4">
              {Object.entries(config.trackingPages).map(([key, page]) => (
                <div key={key} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                      {page.title}
                    </h3>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={page.enabled}
                        onChange={(e) => {
                          setConfig({
                            ...config,
                            trackingPages: {
                              ...config.trackingPages,
                              [key]: { ...page, enabled: e.target.checked }
                            }
                          });
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 dark:peer-focus:ring-amber-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-amber-600"></div>
                    </label>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    URL: {page.url}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={saveConfig}
              disabled={isSaving}
              className="btn-primary w-full mt-4"
            >
              {isSaving ? '💾 Saving...' : '💾 Save Configuration'}
            </button>
          </div>
        )}

        {/* Danger Zone */}
        <div className="card border-2 border-red-200 dark:border-red-800">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            ⚠️ Danger Zone
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            These actions are irreversible. Please be careful.
          </p>
          <button
            onClick={clearAllData}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            🗑️ Clear All Tracking Data
          </button>
        </div>
      </div>
    </Layout>
  );
}

