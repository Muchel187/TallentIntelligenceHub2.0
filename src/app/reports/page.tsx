'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface TestResult {
  testId: string;
  completedAt: string;
  scores: {
    O: number;
    C: number;
    E: number;
    A: number;
    N: number;
  };
  paid: boolean;
}

export default function ReportsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reports, setReports] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchReports();
    }
  }, [status, router]);

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/reports');
      if (response.ok) {
        const data = await response.json();
        setReports(data.reports || []);
      }
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Meine Berichte</h1>
              <p className="text-gray-600 mt-1">Ihre abgeschlossenen Persönlichkeitstests</p>
            </div>
            <Link
              href="/dashboard"
              className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {reports.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Keine Berichte vorhanden
            </h2>
            <p className="text-gray-600 mb-6">
              Sie haben noch keinen Big Five Test abgeschlossen.
            </p>
            <Link
              href="/test"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Ersten Test starten
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <Link
                key={report.testId}
                href={`/report/${report.testId}`}
                className="block"
              >
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-500">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl">📄</div>
                    {report.paid && (
                      <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs font-semibold rounded-full">
                        PREMIUM
                      </span>
                    )}
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2">
                    Test ID: {report.testId.slice(-8).toUpperCase()}
                  </h3>

                  <p className="text-sm text-gray-600 mb-4">
                    {new Date(report.completedAt).toLocaleDateString('de-DE', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>

                  {/* Mini Score Preview */}
                  <div className="space-y-2">
                    <ScoreBar label="O" score={report.scores.O} color="purple" />
                    <ScoreBar label="C" score={report.scores.C} color="blue" />
                    <ScoreBar label="E" score={report.scores.E} color="green" />
                    <ScoreBar label="A" score={report.scores.A} color="orange" />
                    <ScoreBar label="N" score={report.scores.N} color="red" />
                  </div>

                  <div className="mt-4 text-blue-600 font-medium text-sm">
                    Bericht ansehen →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* New Test CTA */}
        {reports.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  Neuen Test durchführen
                </h2>
                <p className="text-gray-600">
                  Verfolgen Sie Ihre persönliche Entwicklung im Laufe der Zeit
                </p>
              </div>
              <Link
                href="/test"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium whitespace-nowrap"
              >
                Test starten
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

interface ScoreBarProps {
  label: string;
  score: number;
  color: 'purple' | 'blue' | 'green' | 'orange' | 'red';
}

function ScoreBar({ label, score, color }: ScoreBarProps) {
  const colorClasses = {
    purple: 'bg-purple-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
  };

  const percentage = (score / 120) * 100;

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-gray-700 w-4">{label}</span>
      <div className="flex-1 bg-gray-200 rounded-full h-2">
        <div
          className={`${colorClasses[color]} h-2 rounded-full`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <span className="text-xs text-gray-600 w-8 text-right">{Math.round(score)}</span>
    </div>
  );
}
