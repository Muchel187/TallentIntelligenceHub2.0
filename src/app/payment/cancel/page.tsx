'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const testId = searchParams.get('testId');

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          {/* Cancel Icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
              <svg
                className="w-10 h-10 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Zahlung abgebrochen
            </h1>
            <p className="text-lg text-gray-600">
              Sie haben die Zahlung abgebrochen
            </p>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Ihr kostenloser Report ist weiterhin verfügbar. Sie können das Premium-Upgrade
                  jederzeit nachholen.
                </p>
              </div>
            </div>
          </div>

          {/* What you're missing */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Das verpassen Sie:
            </h2>
            <ul className="space-y-3">
              <MissingFeature text="Vollständiger detaillierter Report" />
              <MissingFeature text="PDF Download" />
              <MissingFeature text="7 Tage AI Career Coach" />
              <MissingFeature text="50 personalisierte Chat-Nachrichten" />
              <MissingFeature text="Entwicklungsplan mit Handlungsempfehlungen" />
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {testId && (
              <Link
                href={`/report/${testId}`}
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition"
              >
                Zurück zum Report
              </Link>
            )}
            <Link
              href="/"
              className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg text-center transition"
            >
              Zur Startseite
            </Link>
          </div>

          {/* Support */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Fragen? Kontaktieren Sie unseren{' '}
              <a href="mailto:support@nobaexperts.com" className="text-blue-600 hover:text-blue-700">
                Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MissingFeature({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3">
      <div className="flex-shrink-0 w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center">
        <svg className="w-3 h-3 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <span className="text-gray-700">{text}</span>
    </li>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      }
    >
      <PaymentCancelContent />
    </Suspense>
  );
}
