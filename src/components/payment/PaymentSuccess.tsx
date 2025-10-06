'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface PaymentSuccessProps {
  testId: string;
}

export default function PaymentSuccess({ testId }: PaymentSuccessProps) {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = `/report/${testId}`;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [testId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Zahlung erfolgreich!
            </h1>
            <p className="text-lg text-gray-600">
              Willkommen bei NOBA EXPERTS Premium
            </p>
          </div>

          {/* Features Unlocked */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">
              Freigeschaltete Features
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <UnlockedFeature
                icon="✓"
                title="Vollständiger Report"
                description="Alle Details freigeschaltet"
              />
              <UnlockedFeature
                icon="✓"
                title="PDF Download"
                description="Jederzeit verfügbar"
              />
              <UnlockedFeature
                icon="✓"
                title="AI Career Coach"
                description="7 Tage Zugriff"
              />
              <UnlockedFeature
                icon="✓"
                title="50 Chat-Nachrichten"
                description="Persönliches Coaching"
              />
            </div>
          </div>

          {/* Next Steps */}
          <div className="text-center mb-6">
            <p className="text-gray-600 mb-4">
              Sie werden automatisch zu Ihrem Report weitergeleitet in{' '}
              <span className="font-bold text-blue-600">{countdown} Sekunden</span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={`/report/${testId}`}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition"
            >
              Zum Report
            </Link>
            <Link
              href={`/chat/${testId}`}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition"
            >
              AI Coach starten
            </Link>
          </div>

          {/* Receipt Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Eine Bestätigungs-E-Mail mit Ihrer Rechnung wurde an Ihre E-Mail-Adresse gesendet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface UnlockedFeatureProps {
  icon: string;
  title: string;
  description: string;
}

function UnlockedFeature({ icon, title, description }: UnlockedFeatureProps) {
  return (
    <div className="flex items-start gap-3 bg-white rounded-lg p-3">
      <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
        <span className="text-green-600 text-sm font-bold">{icon}</span>
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
        <p className="text-xs text-gray-600">{description}</p>
      </div>
    </div>
  );
}
