'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CompanyStats {
  totalEmployees: number;
  completedTests: number;
  pendingInvitations: number;
  avgCompletionRate: number;
}

export default function CompanyDashboardPage() {
  const [stats, setStats] = useState<CompanyStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/company/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
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
              <h1 className="text-3xl font-bold text-gray-900">Company Dashboard</h1>
              <p className="text-gray-600 mt-1">Verwalten Sie Ihre Team-Assessments</p>
            </div>
            <Link
              href="/dashboard/company/employees/invite"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition"
            >
              + Mitarbeiter einladen
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Mitarbeiter"
            value={stats?.totalEmployees || 0}
            icon="👥"
            color="blue"
            loading={loading}
          />
          <StatCard
            title="Abgeschlossene Tests"
            value={stats?.completedTests || 0}
            icon="✅"
            color="green"
            loading={loading}
          />
          <StatCard
            title="Ausstehende Einladungen"
            value={stats?.pendingInvitations || 0}
            icon="📧"
            color="orange"
            loading={loading}
          />
          <StatCard
            title="Abschlussrate"
            value={`${stats?.avgCompletionRate || 0}%`}
            icon="📊"
            color="purple"
            loading={loading}
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Schnellzugriff</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ActionCard
              title="Mitarbeiter verwalten"
              description="Einladen, verwalten und Ergebnisse einsehen"
              icon="👥"
              href="/dashboard/company/employees"
            />
            <ActionCard
              title="Team Analytics"
              description="Kompatibilität und Team-Insights"
              icon="📈"
              href="/dashboard/analytics"
            />
            <ActionCard
              title="Einstellungen"
              description="Abteilungen und Integrationen"
              icon="⚙️"
              href="/dashboard/company/settings"
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Aktuelle Aktivität</h2>
          <div className="space-y-4">
            <ActivityItem
              type="test_completed"
              message="Max Mustermann hat den Test abgeschlossen"
              time="Vor 2 Stunden"
            />
            <ActivityItem
              type="invitation_sent"
              message="3 neue Einladungen versendet"
              time="Vor 5 Stunden"
            />
            <ActivityItem
              type="employee_added"
              message="Anna Schmidt zum Team hinzugefügt"
              time="Vor 1 Tag"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number | string;
  icon: string;
  color: 'blue' | 'green' | 'orange' | 'purple';
  loading: boolean;
}

function StatCard({ title, value, icon, color, loading }: StatCardProps) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
    purple: 'from-purple-500 to-purple-600',
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className={`bg-gradient-to-r ${colorClasses[color]} p-4`}>
        <div className="text-4xl text-white">{icon}</div>
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        {loading ? (
          <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
        ) : (
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        )}
      </div>
    </div>
  );
}

interface ActionCardProps {
  title: string;
  description: string;
  icon: string;
  href: string;
}

function ActionCard({ title, description, icon, href }: ActionCardProps) {
  return (
    <Link
      href={href}
      className="block p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition"
    >
      <div className="flex items-start gap-3">
        <div className="text-3xl">{icon}</div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </Link>
  );
}

interface ActivityItemProps {
  type: 'test_completed' | 'invitation_sent' | 'employee_added';
  message: string;
  time: string;
}

function ActivityItem({ type, message, time }: ActivityItemProps) {
  const icons = {
    test_completed: '✅',
    invitation_sent: '📧',
    employee_added: '👤',
  };

  return (
    <div className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0">
      <div className="flex-shrink-0 text-2xl">{icons[type]}</div>
      <div className="flex-1">
        <p className="text-gray-900">{message}</p>
        <p className="text-sm text-gray-500 mt-1">{time}</p>
      </div>
    </div>
  );
}
