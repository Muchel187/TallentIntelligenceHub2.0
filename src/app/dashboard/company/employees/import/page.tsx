'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CSVImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{
    success: number;
    failed: number;
    errors: string[];
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/company/employees/import', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setResult({
          success: 0,
          failed: 0,
          errors: [data.error || 'Import fehlgeschlagen'],
        });
      }
    } catch (error) {
      setResult({
        success: 0,
        failed: 0,
        errors: ['Netzwerkfehler beim Import'],
      });
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    const csv = 'email,firstName,lastName,department\nmax@example.com,Max,Mustermann,Engineering\nanna@example.com,Anna,Schmidt,Marketing';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employees_template.csv';
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/company/employees"
              className="text-gray-600 hover:text-gray-900"
            >
              ← Zurück
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">CSV Import</h1>
              <p className="text-gray-600 mt-1">Mitarbeiter per CSV-Datei importieren</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Instructions */}
        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">Anleitung</h2>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li>Laden Sie die CSV-Vorlage herunter</li>
            <li>Füllen Sie die Datei mit Ihren Mitarbeiterdaten</li>
            <li>Laden Sie die ausgefüllte Datei hoch</li>
            <li>Automatische Einladungen werden versendet</li>
          </ol>
        </div>

        {/* Template Download */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">CSV-Vorlage</h2>
              <p className="text-gray-600 mb-4">
                Laden Sie die Vorlage herunter und füllen Sie sie mit Ihren Daten aus.
              </p>
              <div className="bg-gray-50 rounded p-4 mb-4">
                <code className="text-sm text-gray-800">
                  <div>email,firstName,lastName,department</div>
                  <div>max@example.com,Max,Mustermann,Engineering</div>
                  <div>anna@example.com,Anna,Schmidt,Marketing</div>
                </code>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                <strong>Pflichtfelder:</strong> email
                <br />
                <strong>Optional:</strong> firstName, lastName, department
              </p>
            </div>
          </div>
          <button
            onClick={downloadTemplate}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition"
          >
            📥 Vorlage herunterladen
          </button>
        </div>

        {/* File Upload */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">CSV-Datei hochladen</h2>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="csv-upload"
            />
            <label
              htmlFor="csv-upload"
              className="cursor-pointer inline-flex flex-col items-center"
            >
              <svg
                className="w-12 h-12 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              {file ? (
                <div>
                  <p className="text-green-600 font-semibold mb-2">✓ {file.name}</p>
                  <p className="text-sm text-gray-500">Klicken um andere Datei auszuwählen</p>
                </div>
              ) : (
                <div>
                  <p className="text-gray-700 font-semibold mb-2">
                    Klicken Sie hier um eine CSV-Datei auszuwählen
                  </p>
                  <p className="text-sm text-gray-500">oder ziehen Sie die Datei hierher</p>
                </div>
              )}
            </label>
          </div>

          {file && (
            <div className="mt-6">
              <button
                onClick={handleImport}
                disabled={importing}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {importing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Importiere Mitarbeiter...
                  </span>
                ) : (
                  'Import starten'
                )}
              </button>
            </div>
          )}
        </div>

        {/* Results */}
        {result && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Import-Ergebnis</h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-3xl font-bold text-green-600">{result.success}</div>
                <div className="text-sm text-green-800">Erfolgreich importiert</div>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <div className="text-3xl font-bold text-red-600">{result.failed}</div>
                <div className="text-sm text-red-800">Fehlgeschlagen</div>
              </div>
            </div>

            {result.errors.length > 0 && (
              <div>
                <h3 className="font-semibold text-red-900 mb-2">Fehler:</h3>
                <ul className="list-disc list-inside space-y-1">
                  {result.errors.map((error, i) => (
                    <li key={i} className="text-sm text-red-700">
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.success > 0 && (
              <div className="mt-6">
                <Link
                  href="/dashboard/company/employees"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition"
                >
                  Zur Mitarbeiterübersicht
                </Link>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
