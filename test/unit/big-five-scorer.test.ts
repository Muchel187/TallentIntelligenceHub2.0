import { describe, it, expect } from 'vitest';
import {
  calculateDimensionScore,
  calculateBigFiveScores,
  interpretScore,
  calculatePercentile,
  scoreTest,
  validateAnswers,
  getInterpretationText,
  type Answer,
} from '@/core/big-five-scorer';
import { questions } from '@/core/questions';

describe('Big Five Scorer', () => {
  // Sample answers for testing
  const sampleAnswers: Answer[] = questions.map((q) => ({
    questionId: q.id,
    score: 3, // Middle score
  }));

  describe('calculateDimensionScore', () => {
    it('should calculate correct score for plus-keyed questions', () => {
      const answers: Answer[] = [
        { questionId: 1, score: 5 }, // Openness, plus-keyed
      ];
      const score = calculateDimensionScore(answers, 'O');
      expect(score).toBe(5);
    });

    it('should calculate correct score for minus-keyed questions', () => {
      const answers: Answer[] = [
        { questionId: 2, score: 1 }, // Openness, minus-keyed
      ];
      const score = calculateDimensionScore(answers, 'O');
      expect(score).toBe(5); // 6 - 1 = 5 (reversed)
    });

    it('should handle mixed plus and minus keyed questions', () => {
      const answers: Answer[] = [
        { questionId: 1, score: 5 }, // plus: 5
        { questionId: 2, score: 1 }, // minus: 6-1=5
      ];
      const score = calculateDimensionScore(answers, 'O');
      expect(score).toBe(10);
    });

    it('should skip unanswered questions', () => {
      const answers: Answer[] = [
        { questionId: 1, score: 5 },
        // Question 2 missing
      ];
      const score = calculateDimensionScore(answers, 'O');
      expect(score).toBe(5);
    });

    it('should return 0 for no answers', () => {
      const score = calculateDimensionScore([], 'O');
      expect(score).toBe(0);
    });
  });

  describe('calculateBigFiveScores', () => {
    it('should calculate all five dimensions', () => {
      const scores = calculateBigFiveScores(sampleAnswers);

      expect(scores).toHaveProperty('O');
      expect(scores).toHaveProperty('C');
      expect(scores).toHaveProperty('E');
      expect(scores).toHaveProperty('A');
      expect(scores).toHaveProperty('N');
    });

    it('should return scores in valid range', () => {
      const scores = calculateBigFiveScores(sampleAnswers);

      // Openness (24 questions): 24-120
      expect(scores.O).toBeGreaterThanOrEqual(24);
      expect(scores.O).toBeLessThanOrEqual(120);

      // Neuroticism (23 questions): 23-115
      expect(scores.N).toBeGreaterThanOrEqual(23);
      expect(scores.N).toBeLessThanOrEqual(115);
    });

    it('should handle maximum scores', () => {
      const maxAnswers: Answer[] = questions.map((q) => ({
        questionId: q.id,
        score: 5,
      }));
      const scores = calculateBigFiveScores(maxAnswers);

      // With all 5s, plus-keyed get 5, minus-keyed get 1 (6-5)
      // Each dimension should be close to midpoint
      expect(scores.O).toBeGreaterThan(0);
      expect(scores.C).toBeGreaterThan(0);
    });

    it('should handle minimum scores', () => {
      const minAnswers: Answer[] = questions.map((q) => ({
        questionId: q.id,
        score: 1,
      }));
      const scores = calculateBigFiveScores(minAnswers);

      expect(scores.O).toBeGreaterThan(0);
      expect(scores.C).toBeGreaterThan(0);
    });
  });

  describe('interpretScore', () => {
    it('should interpret low scores correctly', () => {
      expect(interpretScore(30, 'O')).toBe('low');
      expect(interpretScore(40, 'C')).toBe('low');
    });

    it('should interpret average scores correctly', () => {
      expect(interpretScore(72, 'E')).toBe('average');
      expect(interpretScore(70, 'A')).toBe('average');
    });

    it('should interpret high scores correctly', () => {
      expect(interpretScore(100, 'O')).toBe('high');
      expect(interpretScore(110, 'C')).toBe('high');
    });

    it('should handle Neuroticism range (23-115)', () => {
      expect(interpretScore(30, 'N')).toBe('low');
      expect(interpretScore(70, 'N')).toBe('average');
      expect(interpretScore(100, 'N')).toBe('high');
    });
  });

  describe('calculatePercentile', () => {
    it('should return percentile in valid range (1-99)', () => {
      const percentile = calculatePercentile(72, 'O');
      expect(percentile).toBeGreaterThanOrEqual(1);
      expect(percentile).toBeLessThanOrEqual(99);
    });

    it('should return ~50 for midpoint scores', () => {
      const midScore = (120 + 24) / 2; // 72 for most dimensions
      const percentile = calculatePercentile(midScore, 'O');
      expect(percentile).toBeGreaterThan(45);
      expect(percentile).toBeLessThan(55);
    });

    it('should return higher percentile for higher scores', () => {
      const low = calculatePercentile(40, 'O');
      const high = calculatePercentile(100, 'O');
      expect(high).toBeGreaterThan(low);
    });
  });

  describe('scoreTest', () => {
    it('should return complete scored test object', () => {
      const result = scoreTest(sampleAnswers);

      expect(result).toHaveProperty('scores');
      expect(result).toHaveProperty('interpretations');
      expect(result).toHaveProperty('percentiles');
    });

    it('should have interpretations for all dimensions', () => {
      const result = scoreTest(sampleAnswers);

      expect(result.interpretations).toHaveProperty('O');
      expect(result.interpretations).toHaveProperty('C');
      expect(result.interpretations).toHaveProperty('E');
      expect(result.interpretations).toHaveProperty('A');
      expect(result.interpretations).toHaveProperty('N');
    });

    it('should have percentiles for all dimensions', () => {
      const result = scoreTest(sampleAnswers);

      expect(result.percentiles.O).toBeGreaterThanOrEqual(1);
      expect(result.percentiles.C).toBeGreaterThanOrEqual(1);
      expect(result.percentiles.E).toBeGreaterThanOrEqual(1);
      expect(result.percentiles.A).toBeGreaterThanOrEqual(1);
      expect(result.percentiles.N).toBeGreaterThanOrEqual(1);
    });
  });

  describe('validateAnswers', () => {
    it('should validate complete answer set', () => {
      const result = validateAnswers(sampleAnswers);
      expect(result.valid).toBe(true);
      expect(result.missing).toHaveLength(0);
    });

    it('should detect missing questions', () => {
      const incompleteAnswers = sampleAnswers.slice(0, 100);
      const result = validateAnswers(incompleteAnswers);

      expect(result.valid).toBe(false);
      expect(result.missing.length).toBeGreaterThan(0);
      expect(result.missing).toContain(119); // Last question should be missing
    });

    it('should list all missing question IDs', () => {
      const partialAnswers: Answer[] = [
        { questionId: 1, score: 3 },
        { questionId: 3, score: 4 },
      ];
      const result = validateAnswers(partialAnswers);

      expect(result.valid).toBe(false);
      expect(result.missing).toContain(2);
      expect(result.missing).toContain(4);
    });
  });

  describe('getInterpretationText', () => {
    it('should return text for all dimension-level combinations', () => {
      const dimensions: Array<'O' | 'C' | 'E' | 'A' | 'N'> = ['O', 'C', 'E', 'A', 'N'];
      const levels: Array<'low' | 'average' | 'high'> = ['low', 'average', 'high'];

      dimensions.forEach((dim) => {
        levels.forEach((level) => {
          const text = getInterpretationText(dim, level);
          expect(text).toBeTruthy();
          expect(text.length).toBeGreaterThan(10);
        });
      });
    });

    it('should return different texts for different levels', () => {
      const lowText = getInterpretationText('O', 'low');
      const highText = getInterpretationText('O', 'high');
      expect(lowText).not.toBe(highText);
    });
  });

  describe('Edge cases', () => {
    it('should handle duplicate question IDs (use first answer)', () => {
      const duplicates: Answer[] = [
        { questionId: 1, score: 5 },
        { questionId: 1, score: 1 }, // Duplicate
      ];
      const score = calculateDimensionScore(duplicates, 'O');
      expect(score).toBe(5); // Should use first answer
    });

    it('should handle invalid score values gracefully', () => {
      const invalidAnswers: Answer[] = [
        { questionId: 1, score: 10 }, // Out of range
      ];
      // Should still calculate, just with invalid data
      const score = calculateDimensionScore(invalidAnswers, 'O');
      expect(score).toBe(10); // Doesn't validate, just calculates
    });

    it('should handle empty question config', () => {
      const score = calculateDimensionScore(sampleAnswers, 'O', []);
      expect(score).toBe(0);
    });
  });

  describe('Real-world scenarios', () => {
    it('should handle typical high extraversion profile', () => {
      const extrovertAnswers: Answer[] = questions.map((q) => {
        if (q.dimension === 'E') {
          return { questionId: q.id, score: q.keyed === 'plus' ? 5 : 1 };
        }
        return { questionId: q.id, score: 3 };
      });

      const scores = calculateBigFiveScores(extrovertAnswers);
      expect(scores.E).toBeGreaterThan(90);
      expect(interpretScore(scores.E, 'E')).toBe('high');
    });

    it('should handle typical high neuroticism profile', () => {
      const neuroticAnswers: Answer[] = questions.map((q) => {
        if (q.dimension === 'N') {
          return { questionId: q.id, score: q.keyed === 'plus' ? 5 : 1 };
        }
        return { questionId: q.id, score: 3 };
      });

      const scores = calculateBigFiveScores(neuroticAnswers);
      expect(scores.N).toBeGreaterThan(85);
      expect(interpretScore(scores.N, 'N')).toBe('high');
    });

    it('should produce consistent results for same answers', () => {
      const result1 = scoreTest(sampleAnswers);
      const result2 = scoreTest(sampleAnswers);

      expect(result1.scores).toEqual(result2.scores);
      expect(result1.interpretations).toEqual(result2.interpretations);
    });
  });
});
