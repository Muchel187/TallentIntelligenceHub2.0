/**
 * QuestionCard Component
 * Displays a single Big Five test question with 5-point Likert scale
 */

'use client';

import { useState } from 'react';

interface QuestionCardProps {
  question: string;
  questionId: number;
  currentAnswer?: number;
  onAnswer: (questionId: number, score: number) => void;
}

const LIKERT_OPTIONS = [
  { value: 1, label: 'Strongly Disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly Agree' },
];

export function QuestionCard({
  question,
  questionId,
  currentAnswer,
  onAnswer,
}: QuestionCardProps) {
  const [selected, setSelected] = useState<number | undefined>(currentAnswer);

  const handleSelect = (score: number) => {
    setSelected(score);
    onAnswer(questionId, score);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 md:p-8 w-full max-w-3xl mx-auto">
      {/* Question Text */}
      <div className="mb-6">
        <p className="text-lg md:text-xl font-medium text-gray-900 leading-relaxed">
          {question}
        </p>
      </div>

      {/* Likert Scale - Mobile */}
      <div className="flex flex-col gap-3 md:hidden">
        {LIKERT_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSelect(option.value)}
            className={`
              px-4 py-3 rounded-lg border-2 transition-all duration-200
              ${
                selected === option.value
                  ? 'bg-blue-500 text-white border-blue-500 shadow-lg'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50'
              }
            `}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{option.label}</span>
              <span className="text-sm opacity-75">{option.value}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Likert Scale - Desktop */}
      <div className="hidden md:block">
        <div className="flex justify-between gap-2">
          {LIKERT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`
                flex-1 px-3 py-4 rounded-lg border-2 transition-all duration-200
                min-h-[80px] flex flex-col items-center justify-center
                ${
                  selected === option.value
                    ? 'bg-blue-500 text-white border-blue-500 shadow-lg transform scale-105'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                }
              `}
            >
              <span className="text-2xl font-bold mb-1">{option.value}</span>
              <span className="text-xs text-center">{option.label}</span>
            </button>
          ))}
        </div>

        {/* Labels */}
        <div className="flex justify-between mt-2 px-2">
          <span className="text-xs text-gray-500">Strongly Disagree</span>
          <span className="text-xs text-gray-500">Strongly Agree</span>
        </div>
      </div>

      {/* Helper Text */}
      <div className="mt-4 text-sm text-gray-500 text-center">
        Select the option that best describes you
      </div>
    </div>
  );
}
