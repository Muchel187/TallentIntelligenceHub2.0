import { questions, type Question } from './questions';

export interface Answer {
  questionId: number;
  score: number; // 1-5 Likert scale
}

export interface BigFiveScores {
  O: number; // Openness (24-120)
  C: number; // Conscientiousness (24-120)
  E: number; // Extraversion (24-120)
  A: number; // Agreeableness (24-120)
  N: number; // Neuroticism (23-115)
}

export interface ScoredTest {
  scores: BigFiveScores;
  interpretations: Record<keyof BigFiveScores, 'low' | 'average' | 'high'>;
  percentiles: BigFiveScores;
}

/**
 * Calculate score for a single dimension
 */
export function calculateDimensionScore(
  answers: Answer[],
  dimension: 'O' | 'C' | 'E' | 'A' | 'N',
  questionConfig: Question[] = questions
): number {
  const dimensionQuestions = questionConfig.filter((q) => q.dimension === dimension);

  let total = 0;
  for (const question of dimensionQuestions) {
    const answer = answers.find((a) => a.questionId === question.id);
    if (!answer) continue; // Skip unanswered questions

    // Reverse scoring for 'minus' keyed questions
    const score = question.keyed === 'plus' ? answer.score : 6 - answer.score;

    total += score;
  }

  return total;
}

/**
 * Calculate all Big Five scores from answers
 */
export function calculateBigFiveScores(answers: Answer[]): BigFiveScores {
  return {
    O: calculateDimensionScore(answers, 'O'),
    C: calculateDimensionScore(answers, 'C'),
    E: calculateDimensionScore(answers, 'E'),
    A: calculateDimensionScore(answers, 'A'),
    N: calculateDimensionScore(answers, 'N'),
  };
}

/**
 * Interpret a score as low, average, or high
 */
export function interpretScore(score: number, dimension: 'O' | 'C' | 'E' | 'A' | 'N'): 'low' | 'average' | 'high' {
  // Neuroticism has 23 questions (max 115), others have 24 (max 120)
  const maxScore = dimension === 'N' ? 115 : 120;
  const minScore = dimension === 'N' ? 23 : 24;
  const range = maxScore - minScore;

  const lowThreshold = minScore + range * 0.33;
  const highThreshold = minScore + range * 0.67;

  if (score < lowThreshold) return 'low';
  if (score > highThreshold) return 'high';
  return 'average';
}

/**
 * Calculate percentile for a score
 * Based on approximate normal distribution
 */
export function calculatePercentile(score: number, dimension: 'O' | 'C' | 'E' | 'A' | 'N'): number {
  const maxScore = dimension === 'N' ? 115 : 120;
  const minScore = dimension === 'N' ? 23 : 24;
  const midpoint = (maxScore + minScore) / 2;
  const stdDev = (maxScore - minScore) / 6; // Approximate standard deviation

  // Z-score
  const z = (score - midpoint) / stdDev;

  // Convert z-score to percentile (approximate)
  const percentile = Math.round(50 + 50 * erf(z / Math.sqrt(2)));

  return Math.max(1, Math.min(99, percentile));
}

/**
 * Error function approximation for normal distribution
 */
function erf(x: number): number {
  // Abramowitz and Stegun approximation
  const sign = x >= 0 ? 1 : -1;
  x = Math.abs(x);

  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return sign * y;
}

/**
 * Complete scoring with interpretations and percentiles
 */
export function scoreTest(answers: Answer[]): ScoredTest {
  const scores = calculateBigFiveScores(answers);

  const interpretations = {
    O: interpretScore(scores.O, 'O'),
    C: interpretScore(scores.C, 'C'),
    E: interpretScore(scores.E, 'E'),
    A: interpretScore(scores.A, 'A'),
    N: interpretScore(scores.N, 'N'),
  };

  const percentiles = {
    O: calculatePercentile(scores.O, 'O'),
    C: calculatePercentile(scores.C, 'C'),
    E: calculatePercentile(scores.E, 'E'),
    A: calculatePercentile(scores.A, 'A'),
    N: calculatePercentile(scores.N, 'N'),
  };

  return {
    scores,
    interpretations,
    percentiles,
  };
}

/**
 * Get textual interpretation for a dimension
 */
export function getInterpretationText(
  dimension: 'O' | 'C' | 'E' | 'A' | 'N',
  level: 'low' | 'average' | 'high'
): string {
  const interpretations = {
    O: {
      low: 'Sie bevorzugen Routine und bewährte Methoden. Sie schätzen Praktisches und Konkretes mehr als abstrakte Ideen.',
      average: 'Sie haben ein ausgewogenes Interesse an neuen Erfahrungen und etablierten Routinen.',
      high: 'Sie sind offen für neue Erfahrungen, kreativ und neugierig. Sie schätzen Kunst, Ideen und Vielfalt.',
    },
    C: {
      low: 'Sie sind spontan und flexibel, bevorzugen aber weniger Struktur und Organisation.',
      average: 'Sie haben ein gutes Gleichgewicht zwischen Spontaneität und Planung.',
      high: 'Sie sind organisiert, zuverlässig und gewissenhaft. Sie planen voraus und arbeiten hart.',
    },
    E: {
      low: 'Sie sind eher introvertiert, bevorzugen kleinere Gruppen und benötigen Zeit allein zum Aufladen.',
      average: 'Sie sind sowohl in sozialen Situationen als auch allein wohl.',
      high: 'Sie sind extrovertiert, gesellig und energiegeladen. Sie genießen soziale Interaktionen.',
    },
    A: {
      low: 'Sie sind eher wettbewerbsorientiert und skeptisch gegenüber anderen.',
      average: 'Sie haben ein ausgewogenes Verhältnis zwischen Kooperation und Durchsetzungsvermögen.',
      high: 'Sie sind warmherzig, mitfühlend und kooperativ. Sie legen Wert auf Harmonie.',
    },
    N: {
      low: 'Sie sind emotional stabil, ruhig und können gut mit Stress umgehen.',
      average: 'Sie haben ein normales Maß an emotionaler Reaktivität.',
      high: 'Sie neigen zu Stress, Sorgen und emotionalen Schwankungen. Emotionale Stabilität könnte ein Entwicklungsbereich sein.',
    },
  };

  return interpretations[dimension][level];
}

/**
 * Validate that all questions are answered
 */
export function validateAnswers(answers: Answer[]): { valid: boolean; missing: number[] } {
  const answeredIds = new Set(answers.map((a) => a.questionId));
  const missing = questions.map((q) => q.id).filter((id) => !answeredIds.has(id));

  return {
    valid: missing.length === 0,
    missing,
  };
}
