'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface CompanySettings {
  name: string;
  domain: string;
  industry: string;
  size: string;
  billingEmail: string;
  subscriptionPlan: string;
  subscriptionStatus: string;
}

export default function CompanySettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/company/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    try {
      const response = await fetch('/api/company/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        alert('Einstellungen gespeichert!');
      } else {
        alert('Fehler beim Speichern');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Fehler beim Speichern');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Unternehmenseinstellungen</h1>
              <p className="text-gray-600 mt-1">Verwalten Sie Ihre Unternehmensdaten</p>
            </div>
            <button
              onClick={() => router.push('/dashboard/company')}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              ← Zurück
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSave} className="bg-white rounded-lg shadow-md p-8">
          {/* Company Information */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Unternehmensinformationen</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unternehmensname
                </label>
                <input
                  type="text"
                  value={settings?.name || ''}
                  onChange={(e) => setSettings({ ...settings!, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Domain
                </label>
                <input
                  type="text"
                  value={settings?.domain || ''}
                  onChange={(e) => setSettings({ ...settings!, domain: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="example.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Branche
                  </label>
                  <input
                    type="text"
                    value={settings?.industry || ''}
                    onChange={(e) => setSettings({ ...settings!, industry: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unternehmensgröße
                  </label>
                  <select
                    value={settings?.size || ''}
                    onChange={(e) => setSettings({ ...settings!, size: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  >
                    <option value="small">1-50 Mitarbeiter</option>
                    <option value="medium">51-200 Mitarbeiter</option>
                    <option value="large">201-1000 Mitarbeiter</option>
                    <option value="enterprise">1000+ Mitarbeiter</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rechnungs-E-Mail
                </label>
                <input
                  type="email"
                  value={settings?.billingEmail || ''}
                  onChange={(e) => setSettings({ ...settings!, billingEmail: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="billing@example.com"
                />
              </div>
            </div>
          </div>

          {/* Subscription Information */}
          <div className="mb-8 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Abonnement</h2>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Aktueller Plan</p>
                  <p className="text-2xl font-bold text-gray-900 capitalize">
                    {settings?.subscriptionPlan || 'Basic'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <p className={`text-2xl font-bold capitalize ${
                    settings?.subscriptionStatus === 'active' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {settings?.subscriptionStatus || 'Trial'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Speichern...' : 'Einstellungen speichern'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
