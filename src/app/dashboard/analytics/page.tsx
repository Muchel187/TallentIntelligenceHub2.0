'use client';

import { useState, useEffect } from 'react';

interface TeamAnalytics {
  teamSize: number;
  avgScores: {
    O: number;
    C: number;
    E: number;
    A: number;
    N: number;
  };
  compatibility: number;
  retentionRisk: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<TeamAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');

  useEffect(() => {
    fetchAnalytics();
  }, [selectedDepartment]);

  const fetchAnalytics = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedDepartment !== 'all') {
        params.append('department', selectedDepartment);
      }

      const response = await fetch(`/api/analytics/team?${params}`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Team Analytics</h1>
              <p className="text-gray-600 mt-1">Einblicke in Team-Persönlichkeit und Dynamik</p>
            </div>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            >
              <option value="all">Alle Abteilungen</option>
              <option value="engineering">Engineering</option>
              <option value="marketing">Marketing</option>
              <option value="sales">Sales</option>
            </select>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard
                title="Team-Größe"
                value={analytics?.teamSize || 0}
                icon="👥"
                color="blue"
              />
              <MetricCard
                title="Durchschn. Kompatibilität"
                value={`${Math.round(analytics?.compatibility || 0)}%`}
                icon="🤝"
                color="green"
              />
              <MetricCard
                title="Retention Risiko"
                value={`${(analytics?.retentionRisk.high || 0) + (analytics?.retentionRisk.critical || 0)}`}
                icon="⚠️"
                color="orange"
                subtitle="Mitarbeiter mit erhöhtem Risiko"
              />
            </div>

            {/* Big Five Team Profile */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Team Persönlichkeitsprofil
              </h2>
              <div className="space-y-4">
                {analytics && (
                  <>
                    <DimensionBar
                      label="Offenheit"
                      score={analytics.avgScores.O}
                      color="purple"
                    />
                    <DimensionBar
                      label="Gewissenhaftigkeit"
                      score={analytics.avgScores.C}
                      color="blue"
                    />
                    <DimensionBar
                      label="Extraversion"
                      score={analytics.avgScores.E}
                      color="green"
                    />
                    <DimensionBar
                      label="Verträglichkeit"
                      score={analytics.avgScores.A}
                      color="orange"
                    />
                    <DimensionBar
                      label="Neurotizismus"
                      score={analytics.avgScores.N}
                      color="red"
                    />
                  </>
                )}
              </div>
            </div>

            {/* Retention Risk Distribution */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Retention Risk Verteilung
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <RiskCard
                  level="Niedrig"
                  count={analytics?.retentionRisk.low || 0}
                  color="green"
                />
                <RiskCard
                  level="Mittel"
                  count={analytics?.retentionRisk.medium || 0}
                  color="yellow"
                />
                <RiskCard
                  level="Hoch"
                  count={analytics?.retentionRisk.high || 0}
                  color="orange"
                />
                <RiskCard
                  level="Kritisch"
                  count={analytics?.retentionRisk.critical || 0}
                  color="red"
                />
              </div>
            </div>

            {/* Insights */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">💡 Insights & Empfehlungen</h2>
              <ul className="space-y-3">
                <InsightItem
                  text={`Ihr Team zeigt eine durchschnittliche Gewissenhaftigkeit von ${Math.round(analytics?.avgScores.C || 0)} Punkten - optimal für strukturierte Projekte.`}
                />
                <InsightItem
                  text={`${(analytics?.retentionRisk.high || 0) + (analytics?.retentionRisk.critical || 0)} Mitarbeiter benötigen erhöhte Aufmerksamkeit zur Retention.`}
                />
                <InsightItem
                  text={`Die Team-Kompatibilität liegt bei ${Math.round(analytics?.compatibility || 0)}% - ein guter Wert für produktive Zusammenarbeit.`}
                />
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: string;
  color: 'blue' | 'green' | 'orange';
  subtitle?: string;
}

function MetricCard({ title, value, icon, color, subtitle }: MetricCardProps) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className={`bg-gradient-to-r ${colorClasses[color]} p-4`}>
        <div className="text-4xl text-white">{icon}</div>
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}

interface DimensionBarProps {
  label: string;
  score: number;
  color: 'purple' | 'blue' | 'green' | 'orange' | 'red';
}

function DimensionBar({ label, score, color }: DimensionBarProps) {
  const colorClasses = {
    purple: 'bg-purple-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
  };

  const percentage = (score / 120) * 100;

  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-semibold text-gray-900">{Math.round(score)}/120</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div
          className={`${colorClasses[color]} h-4 rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}

interface RiskCardProps {
  level: string;
  count: number;
  color: 'green' | 'yellow' | 'orange' | 'red';
}

function RiskCard({ level, count, color }: RiskCardProps) {
  const bgColors = {
    green: 'bg-green-50',
    yellow: 'bg-yellow-50',
    orange: 'bg-orange-50',
    red: 'bg-red-50',
  };

  const textColors = {
    green: 'text-green-700',
    yellow: 'text-yellow-700',
    orange: 'text-orange-700',
    red: 'text-red-700',
  };

  return (
    <div className={`${bgColors[color]} rounded-lg p-4 text-center`}>
      <div className={`text-3xl font-bold ${textColors[color]}`}>{count}</div>
      <div className={`text-sm ${textColors[color]} mt-1`}>{level}</div>
    </div>
  );
}

function InsightItem({ text }: { text: string }) {
  return (
    <li className="flex gap-3 items-start">
      <span className="text-blue-600 mt-0.5">→</span>
      <span className="text-gray-700">{text}</span>
    </li>
  );
}
