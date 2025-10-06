'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
              <h1 className="text-3xl font-bold text-gray-900">
                Willkommen, {session?.user?.name || session?.user?.email}
              </h1>
              <p className="text-gray-600 mt-1">Ihr persönliches Dashboard</p>
            </div>
            <button
              onClick={() => router.push('/api/auth/signout')}
              className="px-4 py-2 text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Abmelden
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Start Test */}
          <Link href="/test" className="block">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-500">
              <div className="text-4xl mb-4">🧠</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Big Five Test starten
              </h2>
              <p className="text-gray-600">
                Entdecken Sie Ihre Persönlichkeit mit unserem wissenschaftlichen Test (119 Fragen)
              </p>
            </div>
          </Link>

          {/* View Reports */}
          <Link href="/reports" className="block">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-green-500">
              <div className="text-4xl mb-4">📊</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Meine Berichte
              </h2>
              <p className="text-gray-600">
                Sehen Sie Ihre abgeschlossenen Tests und detaillierten Persönlichkeitsberichte
              </p>
            </div>
          </Link>

          {/* AI Coaching */}
          <Link href="/chat" className="block">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-purple-500">
              <div className="text-4xl mb-4">💬</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                AI Karriere-Coach
              </h2>
              <p className="text-gray-600">
                Personalisierte Karriereberatung basierend auf Ihrer Persönlichkeit
              </p>
            </div>
          </Link>

          {/* Company Dashboard (B2B) */}
          <Link href="/dashboard/company" className="block">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-orange-500">
              <div className="text-4xl mb-4">🏢</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Unternehmens-Dashboard
              </h2>
              <p className="text-gray-600">
                Verwalten Sie Ihr Team, Mitarbeiter und Abteilungen
              </p>
            </div>
          </Link>

          {/* Team Analytics */}
          <Link href="/dashboard/analytics" className="block">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-indigo-500">
              <div className="text-4xl mb-4">📈</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Team Analytics
              </h2>
              <p className="text-gray-600">
                Einblicke in Team-Dynamik, Kompatibilität und Retention
              </p>
            </div>
          </Link>

          {/* Integrations */}
          <Link href="/dashboard/integrations" className="block">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-teal-500">
              <div className="text-4xl mb-4">🔗</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Integrationen
              </h2>
              <p className="text-gray-600">
                Verbinden Sie mit Slack, Teams, Personio und mehr
              </p>
            </div>
          </Link>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            💡 Nächste Schritte
          </h2>
          <ul className="space-y-3">
            <li className="flex gap-3 items-start">
              <span className="text-blue-600 mt-0.5">→</span>
              <span className="text-gray-700">
                <strong>Schritt 1:</strong> Absolvieren Sie den Big Five Persönlichkeitstest (ca. 15 Minuten)
              </span>
            </li>
            <li className="flex gap-3 items-start">
              <span className="text-blue-600 mt-0.5">→</span>
              <span className="text-gray-700">
                <strong>Schritt 2:</strong> Erhalten Sie Ihren detaillierten Persönlichkeitsbericht mit KI-generierten Insights
              </span>
            </li>
            <li className="flex gap-3 items-start">
              <span className="text-blue-600 mt-0.5">→</span>
              <span className="text-gray-700">
                <strong>Schritt 3:</strong> Nutzen Sie den AI Karriere-Coach für personalisierte Empfehlungen
              </span>
            </li>
            <li className="flex gap-3 items-start">
              <span className="text-blue-600 mt-0.5">→</span>
              <span className="text-gray-700">
                <strong>B2B:</strong> Laden Sie Mitarbeiter ein und analysieren Sie Team-Dynamiken
              </span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
