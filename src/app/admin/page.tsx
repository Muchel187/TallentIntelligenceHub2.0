'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface TestResult {
  id: number;
  testId: string;
  email: string;
  completedAt: string;
  paid: boolean;
  reportGeneratedAt: string | null;
}

export default function AdminPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [tests, setTests] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'paid' | 'unpaid'>('all');

  // Simple admin check (in production, use proper role-based auth)
  const isAdmin = session?.user?.email === 'tester@teste.de' || session?.user?.email === 'Jurakb1986@gmail.com';

  useEffect(() => {
    if (session && !isAdmin) {
      router.push('/');
      return;
    }
    if (isAdmin) {
      fetchTests();
    }
  }, [session, isAdmin]);

  const fetchTests = async () => {
    try {
      const response = await fetch('/api/admin/tests');
      if (response.ok) {
        const data = await response.json();
        setTests(data.tests);
      }
    } catch (error) {
      console.error('Failed to fetch tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePaidStatus = async (testId: string, currentStatus: boolean) => {
    try {
      const response = await fetch('/api/admin/tests/toggle-paid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testId, paid: !currentStatus }),
      });

      if (response.ok) {
        // Refresh tests
        fetchTests();
      } else {
        alert('Fehler beim Aktualisieren des Status');
      }
    } catch (error) {
      console.error('Failed to toggle paid status:', error);
      alert('Fehler beim Aktualisieren des Status');
    }
  };

  const regenerateReport = async (testId: string) => {
    if (!confirm('AI-Bericht wirklich neu generieren? Dies kann 1-2 Minuten dauern.')) {
      return;
    }

    try {
      const response = await fetch(`/api/reports/${testId}/regenerate`, {
        method: 'POST',
      });

      if (response.ok) {
        alert('AI-Bericht wird generiert...');
        setTimeout(() => fetchTests(), 3000);
      } else {
        const data = await response.json();
        alert(`Fehler: ${data.error}`);
      }
    } catch (error) {
      console.error('Failed to regenerate report:', error);
      alert('Fehler beim Generieren des Berichts');
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Bitte melden Sie sich an...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-600">Zugriff verweigert</p>
      </div>
    );
  }

  const filteredTests = tests.filter((test) => {
    if (filter === 'paid') return test.paid;
    if (filter === 'unpaid') return !test.paid;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <p className="text-purple-100 mt-2">Test-Management & Zahlungsstatus</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Gesamt Tests</p>
            <p className="text-3xl font-bold text-gray-900">{tests.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Bezahlt</p>
            <p className="text-3xl font-bold text-green-600">
              {tests.filter((t) => t.paid).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Unbezahlt</p>
            <p className="text-3xl font-bold text-orange-600">
              {tests.filter((t) => !t.paid).length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Alle ({tests.length})
            </button>
            <button
              onClick={() => setFilter('paid')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'paid'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Bezahlt ({tests.filter((t) => t.paid).length})
            </button>
            <button
              onClick={() => setFilter('unpaid')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'unpaid'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Unbezahlt ({tests.filter((t) => !t.paid).length})
            </button>
          </div>
        </div>

        {/* Tests Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Test ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      E-Mail
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Abgeschlossen
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      AI-Bericht
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aktionen
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTests.map((test) => (
                    <tr key={test.testId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <a
                          href={`/report/${test.testId}`}
                          className="text-blue-600 hover:underline font-mono"
                          target="_blank"
                        >
                          {test.testId.substring(0, 20)}...
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {test.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(test.completedAt).toLocaleDateString('de-DE')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {test.paid ? (
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Bezahlt
                          </span>
                        ) : (
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                            Unbezahlt
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {test.reportGeneratedAt ? (
                          <span className="text-green-600">✓ Generiert</span>
                        ) : (
                          <span className="text-gray-400">Nicht generiert</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button
                          onClick={() => togglePaidStatus(test.testId, test.paid)}
                          className={`px-3 py-1 rounded ${
                            test.paid
                              ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {test.paid ? 'Als unbezahlt markieren' : 'Als bezahlt markieren'}
                        </button>
                        {!test.reportGeneratedAt && (
                          <button
                            onClick={() => regenerateReport(test.testId)}
                            className="px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
                          >
                            Bericht generieren
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
