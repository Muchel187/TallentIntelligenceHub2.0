/**
 * Employee Invitation Page
 * Send individual or bulk invitations to employees
 * @route /dashboard/company/employees/invite
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Department {
  id: number;
  name: string;
}

export default function InviteEmployeePage() {
  const router = useRouter();
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Single invite state
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [position, setPosition] = useState('');
  const [departmentId, setDepartmentId] = useState<number | undefined>();

  // Bulk invite state
  const [bulkEmails, setBulkEmails] = useState('');

  const handleSingleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/company/employees/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          firstName,
          lastName,
          position: position || undefined,
          departmentId: departmentId || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invitation failed');
      }

      setSuccess(`Invitation sent to ${email}`);
      // Reset form
      setEmail('');
      setFirstName('');
      setLastName('');
      setPosition('');
      setDepartmentId(undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invitation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Parse emails (comma or newline separated)
      const emails = bulkEmails
        .split(/[,\n]/)
        .map((e) => e.trim())
        .filter((e) => e.length > 0);

      if (emails.length === 0) {
        throw new Error('No valid email addresses found');
      }

      const response = await fetch('/api/company/employees/invite/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emails }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Bulk invitation failed');
      }

      setSuccess(`${emails.length} invitations sent successfully`);
      setBulkEmails('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bulk invitation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-700 mb-4"
          >
            ← Zurück zu Mitarbeitern
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Mitarbeiter einladen</h1>
          <p className="text-gray-600 mt-2">
            Senden Sie Einladungen für den Persönlichkeitstest an Ihre Mitarbeiter
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setMode('single')}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition ${
                mode === 'single'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Einzelne Einladung
            </button>
            <button
              onClick={() => setMode('bulk')}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition ${
                mode === 'bulk'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Massen-Einladung
            </button>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-700">{success}</p>
          </div>
        )}

        {/* Single Invite Form */}
        {mode === 'single' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Einzelne Einladung senden
            </h2>
            <form onSubmit={handleSingleInvite} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vorname *
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nachname *
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-Mail *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="mitarbeiter@firma.de"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position (optional)
                </label>
                <input
                  type="text"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="z.B. Software Engineer"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Wird gesendet...' : 'Einladung senden'}
              </button>
            </form>
          </div>
        )}

        {/* Bulk Invite Form */}
        {mode === 'bulk' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Massen-Einladung senden
            </h2>
            <form onSubmit={handleBulkInvite} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-Mail-Adressen (Komma- oder Zeilengetrennt) *
                </label>
                <textarea
                  required
                  value={bulkEmails}
                  onChange={(e) => setBulkEmails(e.target.value)}
                  rows={10}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm text-gray-900"
                  placeholder="mitarbeiter1@firma.de, mitarbeiter2@firma.de&#10;mitarbeiter3@firma.de&#10;mitarbeiter4@firma.de"
                />
                <p className="text-sm text-gray-600 mt-2">
                  Geben Sie mehrere E-Mail-Adressen ein, getrennt durch Kommas oder neue Zeilen.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Wird gesendet...' : 'Einladungen senden'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
