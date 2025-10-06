'use client';

import { useState, useEffect } from 'react';

interface Integration {
  id: string;
  name: 'slack' | 'teams' | 'personio';
  enabled: boolean;
  config: any;
  lastSyncedAt: Date | null;
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      const response = await fetch('/api/integrations');
      if (response.ok) {
        const data = await response.json();
        setIntegrations(data.integrations);
      }
    } catch (error) {
      console.error('Failed to fetch integrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (name: string) => {
    if (name === 'slack') {
      // Redirect to Slack OAuth
      window.location.href = '/api/integrations/slack/oauth';
    } else if (name === 'teams') {
      // Open Teams setup modal
      alert('Teams Integration Setup coming soon');
    } else if (name === 'personio') {
      // Open Personio API Key modal
      alert('Personio Integration Setup coming soon');
    }
  };

  const handleDisable = async (id: string) => {
    if (!confirm('Möchten Sie diese Integration wirklich deaktivieren?')) return;

    try {
      const response = await fetch(`/api/integrations/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchIntegrations();
      }
    } catch (error) {
      console.error('Failed to disable integration:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Integrationen</h1>
          <p className="text-gray-600 mt-1">Verbinden Sie NOBA EXPERTS mit Ihren Tools</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Slack */}
            <IntegrationCard
              name="Slack"
              description="Erhalten Sie Benachrichtigungen über abgeschlossene Tests direkt in Slack"
              icon="https://cdn.brandfolder.io/5H442O3W/as/pl546j-7le8zk-5guop3/Slack_RGB.svg"
              features={[
                'Test-Abschluss Benachrichtigungen',
                'Neue Mitarbeiter Alerts',
                'Retention Warnings',
              ]}
              integration={integrations.find((i) => i.name === 'slack')}
              onConnect={() => handleConnect('slack')}
              onDisable={handleDisable}
            />

            {/* Microsoft Teams */}
            <IntegrationCard
              name="Microsoft Teams"
              description="Automatische Updates in Ihren Teams-Kanälen"
              icon="https://upload.wikimedia.org/wikipedia/commons/c/c9/Microsoft_Office_Teams_%282018%E2%80%93present%29.svg"
              features={[
                'Adaptive Cards für Berichte',
                'Channel Notifications',
                'Team Analytics Updates',
              ]}
              integration={integrations.find((i) => i.name === 'teams')}
              onConnect={() => handleConnect('teams')}
              onDisable={handleDisable}
            />

            {/* Personio */}
            <IntegrationCard
              name="Personio"
              description="Synchronisieren Sie Mitarbeiterdaten automatisch mit Personio"
              icon="https://www.personio.de/wp-content/uploads/2020/09/personio-logo.svg"
              features={[
                'Automatische Mitarbeiter-Sync',
                'Bidirektionale Daten-Synchronisation',
                'Custom Field Mapping',
              ]}
              integration={integrations.find((i) => i.name === 'personio')}
              onConnect={() => handleConnect('personio')}
              onDisable={handleDisable}
            />
          </div>
        )}

        {/* Webhooks Section */}
        <div className="mt-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Webhooks</h2>
                <p className="text-gray-600">
                  Erhalten Sie HTTP-Callbacks bei wichtigen Events
                </p>
              </div>
              <a
                href="/dashboard/integrations/webhooks"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition"
              >
                Webhooks verwalten
              </a>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <EventCard
                event="test.completed"
                description="Wird ausgelöst wenn ein Test abgeschlossen wurde"
              />
              <EventCard
                event="employee.added"
                description="Wird ausgelöst wenn ein neuer Mitarbeiter hinzugefügt wurde"
              />
              <EventCard
                event="retention.warning"
                description="Wird ausgelöst bei erhöhtem Retention Risk"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

interface IntegrationCardProps {
  name: string;
  description: string;
  icon: string;
  features: string[];
  integration?: Integration;
  onConnect: () => void;
  onDisable: (id: string) => void;
}

function IntegrationCard({
  name,
  description,
  icon,
  features,
  integration,
  onConnect,
  onDisable,
}: IntegrationCardProps) {
  const isConnected = integration?.enabled;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <img src={icon} alt={name} className="h-12 w-auto" onError={(e) => {
          e.currentTarget.style.display = 'none';
          e.currentTarget.nextElementSibling && (e.currentTarget.nextElementSibling.className = 'block text-4xl');
        }} />
        <div className="hidden">📦</div>
        {isConnected && (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
            Verbunden
          </span>
        )}
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-2">{name}</h3>
      <p className="text-gray-600 text-sm mb-4">{description}</p>

      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Features:</h4>
        <ul className="space-y-1">
          {features.map((feature, i) => (
            <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {isConnected && integration?.lastSyncedAt && (
        <p className="text-xs text-gray-500 mb-4">
          Zuletzt synchronisiert:{' '}
          {new Date(integration.lastSyncedAt).toLocaleString('de-DE')}
        </p>
      )}

      <div className="mt-auto">
        {isConnected ? (
          <button
            onClick={() => integration && onDisable(integration.id)}
            className="w-full bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-2 px-4 rounded-lg transition"
          >
            Deaktivieren
          </button>
        ) : (
          <button
            onClick={onConnect}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Verbinden
          </button>
        )}
      </div>
    </div>
  );
}

function EventCard({ event, description }: { event: string; description: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <code className="text-sm font-mono text-blue-600 mb-2 block">{event}</code>
      <p className="text-xs text-gray-600">{description}</p>
    </div>
  );
}
