/**
 * Report Display Page
 * Shows Big Five test results with visualizations and interpretations
 */

import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { BigFiveChart } from '@/components/report/BigFiveChart';

interface PageProps {
  params: Promise<{ testId: string }>;
}

async function getTestResult(testId: string) {
  const result = await prisma.testResult.findUnique({
    where: { testId },
  });

  if (!result) {
    return null;
  }

  return result;
}

const INTERPRETATIONS = {
  O: {
    high: 'You are open to new experiences, creative, and curious. You enjoy exploring new ideas and appreciate art and beauty.',
    average: 'You balance tradition with openness to new experiences. You can adapt when needed but also value familiarity.',
    low: 'You prefer routine and familiar experiences. You are practical and prefer concrete thinking over abstract concepts.',
  },
  C: {
    high: 'You are highly organized, dependable, and disciplined. You plan ahead and pay attention to details.',
    average: 'You balance organization with flexibility. You can be structured when needed but also spontaneous.',
    low: 'You prefer spontaneity and flexibility. You may find strict schedules and routines constraining.',
  },
  E: {
    high: 'You are outgoing, energetic, and enjoy being around people. You gain energy from social interactions.',
    average: 'You enjoy social situations but also value alone time. You can adapt to both group settings and solitary work.',
    low: 'You are more reserved and prefer quieter environments. You recharge through solitude and deep reflection.',
  },
  A: {
    high: 'You are compassionate, cooperative, and trusting. You value harmony and tend to put others first.',
    average: 'You balance compassion with assertiveness. You can be cooperative while also standing up for yourself.',
    low: 'You are more competitive and skeptical. You prioritize your own goals and can be direct in communication.',
  },
  N: {
    high: 'You may experience emotions intensely and be more sensitive to stress. You are deeply empathetic.',
    average: 'You experience normal emotional responses to stress. You can manage challenges while staying aware of feelings.',
    low: 'You are emotionally stable and resilient. You remain calm under pressure and recover quickly from setbacks.',
  },
};

function getInterpretation(dimension: keyof typeof INTERPRETATIONS, score: number): string {
  const level = score < 60 ? 'low' : score > 90 ? 'high' : 'average';
  return INTERPRETATIONS[dimension][level];
}

/**
 * Simple markdown to HTML converter
 * Converts basic markdown to HTML for display
 */
function convertMarkdownToHtml(markdown: string): string {
  let html = markdown
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-gray-900 mt-6 mb-3">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-gray-900 mt-8 mb-4">$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold text-gray-900">$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>')
    // Lists
    .replace(/^\- (.*$)/gim, '<li class="ml-6 mb-2">$1</li>')
    .replace(/^(\d+)\. (.*$)/gim, '<li class="ml-6 mb-2">$2</li>')
    // Paragraphs
    .replace(/\n\n/gim, '</p><p class="mb-4 leading-relaxed">')
    // Line breaks
    .replace(/\n/gim, '<br />');

  // Wrap in paragraph tags
  html = '<p class="mb-4 leading-relaxed">' + html + '</p>';

  // Wrap lists
  html = html.replace(/(<li.*?<\/li>)/gim, '<ul class="list-disc mb-4">$1</ul>');

  return html;
}

export default async function ReportPage({ params }: PageProps) {
  const { testId } = await params;
  const result = await getTestResult(testId);

  if (!result) {
    notFound();
  }

  const scores = result.scores as any;
  const userDetails = result.userDetails as any;
  const hasAIReport = result.reportHtml && result.reportHtml.trim().length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ihr Big Five Persönlichkeitsbericht
          </h1>
          <p className="text-gray-600 mb-2">
            Test abgeschlossen am {new Date(result.completedAt).toLocaleDateString('de-DE', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <p className="text-gray-600">
            Test ID: <span className="font-mono text-sm">{testId}</span>
          </p>
          {!hasAIReport && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mt-0.5"></div>
                <div>
                  <p className="text-blue-900 font-medium">KI-Analyse wird generiert...</p>
                  <p className="text-blue-700 text-sm">Ihr personalisierter Report wird gerade erstellt. Dies kann 1-2 Minuten dauern.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Radar Chart */}
        <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Ihr Persönlichkeitsprofil</h2>
          <BigFiveChart scores={scores} />
        </div>

        {/* AI-Generated Report */}
        {hasAIReport && (
          <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-2xl font-bold text-gray-900">KI-Gestützte Persönlichkeitsanalyse</h2>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                Personalisiert
              </span>
            </div>
            <div
              className="prose prose-lg max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(result.reportHtml) }}
            />
          </div>
        )}

        {/* Detailed Interpretations - Fallback if no AI report */}
        {!hasAIReport && (
          <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Detaillierte Analyse</h2>
          <div className="space-y-6">
            {/* Openness */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Openness to Experience
                <span className="ml-3 text-blue-600">Score: {scores.O}</span>
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {getInterpretation('O', scores.O)}
              </p>
            </div>

            {/* Conscientiousness */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Conscientiousness
                <span className="ml-3 text-green-600">Score: {scores.C}</span>
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {getInterpretation('C', scores.C)}
              </p>
            </div>

            {/* Extraversion */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Extraversion
                <span className="ml-3 text-orange-600">Score: {scores.E}</span>
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {getInterpretation('E', scores.E)}
              </p>
            </div>

            {/* Agreeableness */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Agreeableness
                <span className="ml-3 text-red-600">Score: {scores.A}</span>
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {getInterpretation('A', scores.A)}
              </p>
            </div>

            {/* Neuroticism */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Emotional Stability (Neuroticism)
                <span className="ml-3 text-purple-600">Score: {scores.N}</span>
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {getInterpretation('N', scores.N)}
              </p>
            </div>
          </div>
          </div>
        )}

        {/* Career Relevance */}
        <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Career Insights</h2>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Your Profile</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div><span className="text-gray-600">Current Role:</span> <span className="font-medium text-gray-900">{userDetails.currentJob}</span></div>
                <div><span className="text-gray-600">Industry:</span> <span className="font-medium text-gray-900">{userDetails.industry}</span></div>
                <div><span className="text-gray-600">Experience:</span> <span className="font-medium text-gray-900">{userDetails.experienceLevel}</span></div>
                <div><span className="text-gray-600">Work Environment:</span> <span className="font-medium text-gray-900">{userDetails.workEnvironment}</span></div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Career Goal</h4>
              <p className="text-gray-700">{userDetails.careerGoal}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Current Challenge</h4>
              <p className="text-gray-700">{userDetails.biggestChallenge}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Next Steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href={`/api/results/${testId}/pdf`}
              className={`
                block p-6 text-center rounded-lg border-2 transition-all duration-200
                ${
                  result.paid
                    ? 'border-blue-500 bg-blue-50 hover:bg-blue-100'
                    : 'border-gray-300 bg-gray-50 cursor-not-allowed opacity-60'
                }
              `}
            >
              <div className="text-3xl mb-2">📄</div>
              <h3 className="font-semibold mb-1">Download PDF</h3>
              {!result.paid && <p className="text-xs text-gray-600">Premium Feature</p>}
            </a>

            <a
              href={`/chat/${testId}`}
              className={`
                block p-6 text-center rounded-lg border-2 transition-all duration-200
                ${
                  result.paid
                    ? 'border-blue-500 bg-blue-50 hover:bg-blue-100'
                    : 'border-gray-300 bg-gray-50 cursor-not-allowed opacity-60'
                }
              `}
            >
              <div className="text-3xl mb-2">💬</div>
              <h3 className="font-semibold mb-1">AI Coach Chat</h3>
              {!result.paid && <p className="text-xs text-gray-600">Premium Feature</p>}
            </a>

            {!result.paid && (
              <a
                href={`/payment/checkout?testId=${testId}`}
                className="block p-6 text-center rounded-lg border-2 border-green-500 bg-green-50 hover:bg-green-100 transition-all duration-200"
              >
                <div className="text-3xl mb-2">⭐</div>
                <h3 className="font-semibold mb-1">Unlock Premium</h3>
                <p className="text-xs text-gray-600">49.00 EUR</p>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
