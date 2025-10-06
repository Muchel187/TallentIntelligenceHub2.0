/**
 * Team Compatibility Algorithm
 * Calculates compatibility scores between team members based on Big Five traits
 */

export interface BigFiveScores {
  O: number;
  C: number;
  E: number;
  A: number;
  N: number;
}

export interface CompatibilityResult {
  score: number; // 0-100
  level: 'low' | 'medium' | 'high';
  riskFactors: string[];
  strengths: string[];
  recommendations: string[];
}

/**
 * Calculate compatibility between two individuals
 *
 * Algorithm based on research showing that:
 * - Agreeableness is most important for team harmony (30% weight)
 * - Similar Conscientiousness improves workflow (25% weight)
 * - Complementary Extraversion can be beneficial (20% weight)
 * - Low Neuroticism reduces conflict (15% weight)
 * - Openness similarity aids innovation (10% weight)
 */
export function calculateCompatibility(
  person1: BigFiveScores,
  person2: BigFiveScores
): CompatibilityResult {
  // Calculate differences for each dimension
  const diffs = {
    O: Math.abs(person1.O - person2.O),
    C: Math.abs(person1.C - person2.C),
    E: Math.abs(person1.E - person2.E),
    A: Math.abs(person1.A - person2.A),
    N: Math.abs(person1.N - person2.N),
  };

  // Weighted compatibility calculation
  // Lower differences = higher compatibility
  const maxDiff = 120; // Max possible difference

  const weights = {
    O: 0.10,
    C: 0.25,
    E: 0.20,
    A: 0.30,
    N: 0.15,
  };

  const weightedDiff =
    diffs.O * weights.O +
    diffs.C * weights.C +
    diffs.E * weights.E +
    diffs.A * weights.A +
    diffs.N * weights.N;

  // Convert to 0-100 compatibility score (inverted)
  const compatibilityScore = Math.round(100 - (weightedDiff / maxDiff) * 100);

  // Determine compatibility level
  let level: 'low' | 'medium' | 'high';
  if (compatibilityScore >= 80) level = 'high';
  else if (compatibilityScore >= 60) level = 'medium';
  else level = 'low';

  // Identify risk factors
  const riskFactors: string[] = [];
  const strengths: string[] = [];
  const recommendations: string[] = [];

  // Agreeableness check (most important)
  if (diffs.A > 40) {
    riskFactors.push('Significant difference in Agreeableness may lead to interpersonal conflicts');
    recommendations.push('Establish clear communication protocols and conflict resolution processes');
  } else if (person1.A > 85 && person2.A > 85) {
    strengths.push('Both individuals are highly agreeable, fostering harmonious collaboration');
  }

  // Conscientiousness check
  if (diffs.C > 50) {
    riskFactors.push('Very different work styles and organizational approaches');
    recommendations.push('Define clear roles, responsibilities, and workflow expectations');
  } else if (diffs.C < 20) {
    strengths.push('Similar conscientiousness levels enable smooth workflow coordination');
  }

  // Neuroticism check
  if (person1.N > 90 || person2.N > 90) {
    riskFactors.push('High neuroticism in one or both individuals may increase stress sensitivity');
    recommendations.push('Create supportive environment with regular check-ins and stress management resources');
  } else if (person1.N < 60 && person2.N < 60) {
    strengths.push('Both individuals show emotional stability, reducing conflict potential');
  }

  // Extraversion check (complementarity can be good)
  if (diffs.E > 60) {
    if ((person1.E > 90 && person2.E < 40) || (person1.E < 40 && person2.E > 90)) {
      strengths.push('Complementary extraversion levels can balance team dynamics');
    } else {
      riskFactors.push('Moderate difference in extraversion may create communication mismatches');
      recommendations.push('Ensure communication channels accommodate different interaction preferences');
    }
  }

  // Openness check
  if (diffs.O > 50) {
    riskFactors.push('Different approaches to innovation and change');
    recommendations.push('Foster mutual respect for different problem-solving approaches');
  } else if (person1.O > 85 && person2.O > 85) {
    strengths.push('Both individuals are highly open to new ideas and creative solutions');
  }

  // Overall team balance recommendations
  if (compatibilityScore < 60) {
    recommendations.push('Consider structured team-building activities to bridge differences');
    recommendations.push('Regular feedback sessions to address potential friction points');
  } else if (compatibilityScore >= 80) {
    recommendations.push('Leverage this strong compatibility for high-stakes collaborative projects');
  }

  return {
    score: compatibilityScore,
    level,
    riskFactors,
    strengths,
    recommendations,
  };
}

/**
 * Calculate team compatibility matrix
 * Returns NxN matrix of compatibility scores
 */
export function calculateTeamMatrix(
  team: Array<{ id: number; scores: BigFiveScores }>
): Array<Array<{ score: number; level: string }>> {
  const matrix: Array<Array<{ score: number; level: string }>> = [];

  for (let i = 0; i < team.length; i++) {
    matrix[i] = [];
    for (let j = 0; j < team.length; j++) {
      if (i === j) {
        matrix[i][j] = { score: 100, level: 'self' };
      } else {
        const result = calculateCompatibility(team[i].scores, team[j].scores);
        matrix[i][j] = { score: result.score, level: result.level };
      }
    }
  }

  return matrix;
}

/**
 * Find optimal team pairings
 * Returns pairs with highest compatibility
 */
export function findOptimalPairings(
  team: Array<{ id: number; name: string; scores: BigFiveScores }>
): Array<{ person1: string; person2: string; score: number }> {
  const pairings: Array<{ person1: string; person2: string; score: number }> = [];

  for (let i = 0; i < team.length; i++) {
    for (let j = i + 1; j < team.length; j++) {
      const result = calculateCompatibility(team[i].scores, team[j].scores);
      pairings.push({
        person1: team[i].name,
        person2: team[j].name,
        score: result.score,
      });
    }
  }

  // Sort by compatibility score (highest first)
  return pairings.sort((a, b) => b.score - a.score);
}
