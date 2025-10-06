'use client';

import { useState } from 'react';

interface PricingCardProps {
  testId: string;
  onSuccess?: () => void;
}

export default function PricingCard({ testId, onSuccess }: PricingCardProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpgrade = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/payment/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 shadow-xl max-w-lg mx-auto">
      <div className="text-center mb-6">
        <div className="inline-block bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
          Premium Upgrade
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Schalten Sie Ihr volles Potenzial frei
        </h2>
        <div className="flex items-baseline justify-center gap-2 mt-4">
          <span className="text-5xl font-bold text-blue-600">49€</span>
          <span className="text-gray-600">einmalig</span>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <FeatureItem
          icon="📊"
          title="Vollständiger Report"
          description="Detaillierte Analyse aller Big Five Dimensionen mit wissenschaftlicher Auswertung"
        />
        <FeatureItem
          icon="📄"
          title="PDF Download"
          description="Professioneller Report zum Download und Ausdrucken"
        />
        <FeatureItem
          icon="🤖"
          title="AI Career Coach"
          description="7 Tage persönliches Coaching mit KI-gestützten Entwicklungsempfehlungen"
        />
        <FeatureItem
          icon="💬"
          title="50 Chat-Nachrichten"
          description="Unbegrenzte Fragen zu Ihrer Persönlichkeit und Karriere"
        />
        <FeatureItem
          icon="🎯"
          title="Entwicklungsplan"
          description="Personalisierte Handlungsempfehlungen basierend auf Ihrem Profil"
        />
        <FeatureItem
          icon="🔒"
          title="Lebenslanger Zugriff"
          description="Ihre Ergebnisse bleiben dauerhaft verfügbar"
        />
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handleUpgrade}
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
      >
        {loading ? (
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
            Weiterleitung zu Stripe...
          </span>
        ) : (
          'Jetzt Premium Upgrade sichern'
        )}
      </button>

      <p className="text-center text-sm text-gray-600 mt-4">
        Sichere Zahlung via Stripe • 14 Tage Geld-zurück-Garantie
      </p>
    </div>
  );
}

interface FeatureItemProps {
  icon: string;
  title: string;
  description: string;
}

function FeatureItem({ icon, title, description }: FeatureItemProps) {
  return (
    <div className="flex gap-4 items-start">
      <div className="text-3xl flex-shrink-0">{icon}</div>
      <div>
        <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}
