/**
 * Payment Checkout Page
 * Displays pricing options and initiates Stripe checkout
 * @route /payment/checkout?testId=xxx
 */

'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const testId = searchParams.get('testId');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (!testId) {
      router.push('/');
    }
  }, [testId, router]);

  const handleCheckout = async () => {
    if (!email) {
      setError('Bitte geben Sie Ihre E-Mail-Adresse ein');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/payment/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testId, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Checkout failed');
      }

      if (data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed');
      setLoading(false);
    }
  };

  if (!testId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Upgrade zum Premium Report
          </h1>
          <p className="text-xl text-gray-600">
            Schalten Sie Ihren vollständigen Persönlichkeitsbericht mit KI-Coaching frei
          </p>
        </div>

        {/* Pricing Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold mb-2">Premium Report</h2>
                <p className="text-blue-100">Vollständige Analyse mit KI-Insights</p>
              </div>
              <div className="text-right">
                <div className="text-5xl font-bold">49€</div>
                <div className="text-blue-100">einmalig</div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Was Sie erhalten:</h3>

            <div className="space-y-4 mb-8">
              <Feature
                icon="📊"
                title="Detaillierte Big Five Analyse"
                description="Umfassende Auswertung aller Persönlichkeitsdimensionen"
              />
              <Feature
                icon="🤖"
                title="KI-Coach Chat"
                description="Unbegrenzte Gespräche mit Ihrem persönlichen KI-Karriere-Coach"
              />
              <Feature
                icon="📄"
                title="PDF-Export"
                description="Professioneller Report zum Download und Teilen"
              />
              <Feature
                icon="💼"
                title="Karriere-Empfehlungen"
                description="Personalisierte Vorschläge für Ihre berufliche Entwicklung"
              />
              <Feature
                icon="🎯"
                title="Stärken & Entwicklungsfelder"
                description="Konkrete Handlungsempfehlungen für Ihr Wachstum"
              />
              <Feature
                icon="🔒"
                title="Lebenslanger Zugriff"
                description="Ihre Ergebnisse bleiben dauerhaft verfügbar"
              />
            </div>

            {/* Email Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-Mail für Rechnung
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="ihre@email.de"
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? 'Wird geladen...' : 'Jetzt kaufen - 49€'}
            </button>

            {/* Payment Methods */}
            <div className="mt-6 text-center text-sm text-gray-600">
              <p className="mb-2">Sichere Zahlung via Stripe</p>
              <div className="flex justify-center items-center gap-4">
                <span>💳 Kreditkarte</span>
                <span>•</span>
                <span>🏦 Klarna</span>
                <span>•</span>
                <span>🔒 SSL-Verschlüsselt</span>
              </div>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <button
            onClick={() => router.push(`/report/${testId}`)}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Zurück zum kostenlosen Report
          </button>
        </div>

        {/* Money-Back Guarantee */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <div className="text-3xl">✅</div>
            <div>
              <h4 className="font-semibold text-green-900 mb-1">30 Tage Geld-zurück-Garantie</h4>
              <p className="text-green-700 text-sm">
                Falls Sie nicht zufrieden sind, erstatten wir Ihnen den vollen Betrag - ohne Wenn und Aber.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface FeatureProps {
  icon: string;
  title: string;
  description: string;
}

function Feature({ icon, title, description }: FeatureProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-2xl flex-shrink-0">{icon}</div>
      <div>
        <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  );
}
