'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import PaymentSuccess from '@/components/payment/PaymentSuccess';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const testId = searchParams.get('testId');

  if (!testId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Ungültige Test-ID</h1>
          <a href="/" className="text-blue-600 hover:text-blue-700">
            Zurück zur Startseite
          </a>
        </div>
      </div>
    );
  }

  return <PaymentSuccess testId={testId} />;
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Lade Zahlungsbestätigung...</p>
          </div>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
