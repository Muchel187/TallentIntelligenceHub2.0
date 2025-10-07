/**
 * Test Page
 * Complete Big Five personality test with 120 questions
 * Features: Progress tracking, auto-save, navigation
 */

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { QuestionCard } from '@/components/test/QuestionCard';
import { questions } from '@/core/questions';

interface Answer {
  questionId: number;
  score: number;
}

interface UserDetails {
  age: number;
  currentJob: string;
  experienceLevel: 'junior' | 'mid' | 'senior' | 'lead' | 'executive';
  industry: string;
  careerGoal: string;
  biggestChallenge: string;
  workEnvironment: 'remote' | 'office' | 'hybrid';
}

export default function TestPage() {
  const { data: session } = useSession();
  const [currentStep, setCurrentStep] = useState<'intro' | 'details' | 'questions' | 'submitting'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [userDetails, setUserDetails] = useState<Partial<UserDetails>>({});
  const [email, setEmail] = useState('');
  const [voucher, setVoucher] = useState('');
  const [error, setError] = useState('');

  // Calculate progress percentage
  const progress = Math.round((answers.length / questions.length) * 100);

  // Pre-fill email from session
  useEffect(() => {
    if (session?.user?.email) {
      setEmail(session.user.email);
    }
  }, [session]);

  // Load saved progress on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('test-progress');
    if (savedProgress) {
      try {
        const data = JSON.parse(savedProgress);
        setAnswers(data.answers || []);
        setCurrentQuestionIndex(data.currentQuestionIndex || 0);
        setUserDetails(data.userDetails || {});
        if (data.answers && data.answers.length > 0) {
          setCurrentStep('questions');
        }
      } catch (err) {
        console.error('Failed to load progress:', err);
      }
    }
  }, []);

  // Auto-save progress
  useEffect(() => {
    if (answers.length > 0) {
      localStorage.setItem(
        'test-progress',
        JSON.stringify({
          answers,
          currentQuestionIndex,
          userDetails,
        })
      );
    }
  }, [answers, currentQuestionIndex, userDetails]);

  // Handle answer selection
  const handleAnswer = (questionId: number, score: number) => {
    setAnswers((prev) => {
      const existing = prev.findIndex((a) => a.questionId === questionId);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { questionId, score };
        return updated;
      }
      return [...prev, { questionId, score }];
    });
  };

  // Navigate to next question
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else if (answers.length === questions.length) {
      handleSubmit();
    }
  };

  // Navigate to previous question
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  // Submit test
  const handleSubmit = async () => {
    setCurrentStep('submitting');
    setError('');

    try {
      const response = await fetch('/api/test/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers,
          userDetails,
          email,
          voucher: voucher || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Submission failed');
      }

      // Clear saved progress
      localStorage.removeItem('test-progress');

      // Redirect to report
      window.location.href = `/report/${data.testId}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed');
      setCurrentStep('questions');
    }
  };

  // Handle user details form submission
  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('questions');
  };

  const currentAnswer = answers.find((a) => a.questionId === questions[currentQuestionIndex].id);
  const canGoNext = currentAnswer !== undefined;
  const isComplete = answers.length === questions.length;

  // Intro screen
  if (currentStep === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-2xl bg-white rounded-lg shadow-xl p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Big Five Personality Test
          </h1>
          <p className="text-lg text-gray-700 mb-4">
            Discover your personality profile with our scientifically validated Big Five assessment.
          </p>
          <ul className="space-y-3 mb-8">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✓</span>
              <span className="text-gray-700">120 carefully crafted questions</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✓</span>
              <span className="text-gray-700">15-20 minutes to complete</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✓</span>
              <span className="text-gray-700">Auto-save your progress</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✓</span>
              <span className="text-gray-700">Detailed personality report with AI insights</span>
            </li>
          </ul>
          <button
            onClick={() => setCurrentStep('details')}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200"
          >
            Start Test
          </button>
        </div>
      </div>
    );
  }

  // User details form
  if (currentStep === 'details') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Tell us about yourself</h2>
          <form onSubmit={handleDetailsSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="your@email.com"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  required
                  min="16"
                  max="100"
                  value={userDetails.age || ''}
                  onChange={(e) => setUserDetails({ ...userDetails, age: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                <select
                  required
                  value={userDetails.experienceLevel || ''}
                  onChange={(e) => setUserDetails({ ...userDetails, experienceLevel: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  <option value="">Select...</option>
                  <option value="junior">Junior</option>
                  <option value="mid">Mid-Level</option>
                  <option value="senior">Senior</option>
                  <option value="lead">Lead</option>
                  <option value="executive">Executive</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Job</label>
              <input
                type="text"
                required
                value={userDetails.currentJob || ''}
                onChange={(e) => setUserDetails({ ...userDetails, currentJob: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="e.g., Software Engineer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
              <input
                type="text"
                required
                value={userDetails.industry || ''}
                onChange={(e) => setUserDetails({ ...userDetails, industry: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="e.g., Technology"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Work Environment</label>
              <select
                required
                value={userDetails.workEnvironment || ''}
                onChange={(e) => setUserDetails({ ...userDetails, workEnvironment: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              >
                <option value="">Select...</option>
                <option value="remote">Remote</option>
                <option value="office">Office</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Career Goal</label>
              <textarea
                required
                value={userDetails.careerGoal || ''}
                onChange={(e) => setUserDetails({ ...userDetails, careerGoal: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                rows={3}
                placeholder="What are your career aspirations?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Biggest Challenge</label>
              <textarea
                required
                value={userDetails.biggestChallenge || ''}
                onChange={(e) => setUserDetails({ ...userDetails, biggestChallenge: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                rows={3}
                placeholder="What's your biggest professional challenge?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Voucher Code (optional)</label>
              <input
                type="text"
                value={voucher}
                onChange={(e) => setVoucher(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="Enter voucher code"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Continue to Questions
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Questions
  if (currentStep === 'questions') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        {/* Progress Bar */}
        <div className="max-w-3xl mx-auto mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-gray-700">{progress}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-3xl mx-auto mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Question Card */}
        <QuestionCard
          question={questions[currentQuestionIndex].text}
          questionId={questions[currentQuestionIndex].id}
          currentAnswer={currentAnswer?.score}
          onAnswer={handleAnswer}
        />

        {/* Navigation */}
        <div className="max-w-3xl mx-auto mt-6 flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Previous
          </button>

          <span className="text-sm text-gray-600">
            {answers.length} / {questions.length} answered
          </span>

          <button
            onClick={handleNext}
            disabled={!canGoNext}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {currentQuestionIndex === questions.length - 1 && isComplete ? 'Submit' : 'Next'}
          </button>
        </div>
      </div>
    );
  }

  // Submitting
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md bg-white rounded-lg shadow-xl p-8 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Analyzing your results...</h2>
        <p className="text-gray-600">Please wait while we generate your personality report</p>
      </div>
    </div>
  );
}
