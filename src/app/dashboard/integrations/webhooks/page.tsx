'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Webhook {
  id: string;
  url: string;
  events: string[];
  active: boolean;
  createdAt: Date;
}

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    url: '',
    events: [] as string[],
  });

  const availableEvents = [
    { id: 'test.completed', label: 'Test Abgeschlossen' },
    { id: 'employee.added', label: 'Mitarbeiter Hinzugefügt' },
    { id: 'employee.invited', label: 'Mitarbeiter Eingeladen' },
    { id: 'retention.warning', label: 'Retention Warnung' },
    { id: 'team.analytics.updated', label: 'Team Analytics Aktualisiert' },
  ];

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const fetchWebhooks = async () => {
    try {
      const response = await fetch('/api/integrations/webhook');
      if (response.ok) {
        const data = await response.json();
        setWebhooks(data.webhooks);
      }
    } catch (error) {
      console.error('Failed to fetch webhooks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/integrations/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowCreateForm(false);
        setFormData({ url: '', events: [] });
        fetchWebhooks();
      }
    } catch (error) {
      console.error('Failed to create webhook:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Möchten Sie diesen Webhook wirklich löschen?')) return;

    try {
      const response = await fetch(`/api/integrations/webhook/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchWebhooks();
      }
    } catch (error) {
      console.error('Failed to delete webhook:', error);
    }
  };

  const toggleEvent = (eventId: string) => {
    setFormData((prev) => ({
      ...prev,
      events: prev.events.includes(eventId)
        ? prev.events.filter((e) => e !== eventId)
        : [...prev.events, eventId],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/integrations"
              className="text-gray-600 hover:text-gray-900"
            >
              ← Zurück
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">Webhook Management</h1>
              <p className="text-gray-600 mt-1">HTTP-Callbacks für Events konfigurieren</p>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition"
            >
              {showCreateForm ? 'Abbrechen' : '+ Webhook erstellen'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Create Form */}
        {showCreateForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Neuen Webhook erstellen</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Webhook URL *
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://your-api.com/webhook"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Die URL muss HTTPS verwenden und POST-Requests akzeptieren
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Events (mindestens 1 auswählen) *
                </label>
                <div className="grid md:grid-cols-2 gap-3">
                  {availableEvents.map((event) => (
                    <label
                      key={event.id}
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={formData.events.includes(event.id)}
                        onChange={() => toggleEvent(event.id)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <div>
                        <div className="font-mono text-sm text-gray-900">{event.id}</div>
                        <div className="text-xs text-gray-500">{event.label}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={formData.events.length === 0}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Webhook erstellen
              </button>
            </form>
          </div>
        )}

        {/* Webhooks List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : webhooks.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              Noch keine Webhooks konfiguriert
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {webhooks.map((webhook) => (
                <div key={webhook.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <code className="font-mono text-sm text-gray-900">{webhook.url}</code>
                        {webhook.active ? (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Aktiv
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                            Inaktiv
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 mb-2">
                        {webhook.events.map((event) => (
                          <span
                            key={event}
                            className="px-2 py-1 text-xs font-mono bg-blue-50 text-blue-700 rounded"
                          >
                            {event}
                          </span>
                        ))}
                      </div>

                      <p className="text-xs text-gray-500">
                        Erstellt am {new Date(webhook.createdAt).toLocaleString('de-DE')}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDelete(webhook.id)}
                      className="text-red-600 hover:text-red-900 font-semibold"
                    >
                      Löschen
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Documentation */}
        <div className="mt-8 bg-blue-50 border-l-4 border-blue-600 p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Webhook-Format</h3>
          <div className="bg-white rounded p-4 mb-3">
            <code className="text-xs text-gray-800 whitespace-pre">
{`POST /your-endpoint
Content-Type: application/json
X-Webhook-Signature: sha256=...

{
  "event": "test.completed",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "testId": "test_123",
    "employeeId": "emp_456",
    ...
  }
}`}
            </code>
          </div>
          <p className="text-sm text-blue-800">
            Alle Webhooks sind HMAC-signiert. Überprüfen Sie die Signatur mit Ihrem Secret.
          </p>
        </div>
      </main>
    </div>
  );
}
