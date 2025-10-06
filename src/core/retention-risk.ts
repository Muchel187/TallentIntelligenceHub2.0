/**
 * Retention Risk Calculator
 * Identifies employees at risk of leaving based on personality and engagement data
 */

import { BigFiveScores } from './compatibility';

export interface Employee {
  id: number;
  name: string;
  scores: BigFiveScores;
  moodHistory?: Array<{ moodScore: number; date: Date }>;
  hasDevelopmentPlan: boolean;
  skillGaps?: string[];
  timeInRole?: number; // months
  performanceRating?: number; // 1-5
}

export interface RetentionRiskResult {
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskScore: number; // 0-100
  factors: Array<{ factor: string; severity: 'low' | 'medium' | 'high' }>;
  recommendations: string[];
  interventionPriority: number; // 1-10
}

/**
 * Calculate retention risk for an employee
 *
 * Risk factors:
 * - High Neuroticism (stress-prone)
 * - Low Conscientiousness (disengagement)
 * - Negative mood trends
 * - No development plan
 * - Multiple skill gaps without training
 * - Long time in role without progression
 */
export function calculateRetentionRisk(employee: Employee): RetentionRiskResult {
  let riskScore = 0;
  const factors: Array<{ factor: string; severity: 'low' | 'medium' | 'high' }> = [];
  const recommendations: string[] = [];

  // Factor 1: High Neuroticism (max 25 points)
  if (employee.scores.N > 90) {
    riskScore += 25;
    factors.push({
      factor: 'High neuroticism indicates stress sensitivity and emotional instability',
      severity: 'high',
    });
    recommendations.push('Provide stress management resources and regular well-being check-ins');
  } else if (employee.scores.N > 75) {
    riskScore += 15;
    factors.push({
      factor: 'Elevated neuroticism may indicate vulnerability to workplace stress',
      severity: 'medium',
    });
    recommendations.push('Monitor workload and provide supportive management');
  }

  // Factor 2: Low Conscientiousness (max 20 points)
  if (employee.scores.C < 50) {
    riskScore += 20;
    factors.push({
      factor: 'Low conscientiousness may signal disengagement or job misfit',
      severity: 'high',
    });
    recommendations.push('Assess job fit and role alignment; consider role redesign');
  } else if (employee.scores.C < 65) {
    riskScore += 10;
    factors.push({
      factor: 'Below-average conscientiousness warrants attention to engagement',
      severity: 'medium',
    });
  }

  // Factor 3: Mood trends (max 25 points)
  if (employee.moodHistory && employee.moodHistory.length >= 3) {
    const recentMoods = employee.moodHistory.slice(-3);
    const avgMood = recentMoods.reduce((sum, m) => sum + m.moodScore, 0) / recentMoods.length;

    if (avgMood < 4) {
      riskScore += 25;
      factors.push({
        factor: `Consistently low mood scores (avg: ${avgMood.toFixed(1)}/10) indicate serious dissatisfaction`,
        severity: 'high',
      });
      recommendations.push('Schedule immediate 1-on-1 to understand concerns and dissatisfaction drivers');
    } else if (avgMood < 6) {
      riskScore += 15;
      factors.push({
        factor: `Below-average mood scores (avg: ${avgMood.toFixed(1)}/10) suggest growing disengagement`,
        severity: 'medium',
      });
      recommendations.push('Conduct engagement conversation and explore improvement opportunities');
    }

    // Check for negative trend
    if (recentMoods.length >= 2) {
      const isDecreasing = recentMoods.every((m, i) =>
        i === 0 ? true : m.moodScore <= recentMoods[i - 1].moodScore
      );
      if (isDecreasing) {
        riskScore += 10;
        factors.push({
          factor: 'Declining mood trend over recent surveys',
          severity: 'medium',
        });
      }
    }
  }

  // Factor 4: No development plan (max 15 points)
  if (!employee.hasDevelopmentPlan) {
    riskScore += 15;
    factors.push({
      factor: 'Absence of development plan may indicate lack of career progression',
      severity: 'medium',
    });
    recommendations.push('Create personalized development plan with clear career pathways');
  }

  // Factor 5: Skill gaps without training (max 10 points)
  if (employee.skillGaps && employee.skillGaps.length > 3 && !employee.hasDevelopmentPlan) {
    riskScore += 10;
    factors.push({
      factor: `${employee.skillGaps.length} identified skill gaps without training plan`,
      severity: 'medium',
    });
    recommendations.push('Implement targeted training program to address skill gaps');
  }

  // Factor 6: Time in role without progression (max 15 points)
  if (employee.timeInRole) {
    if (employee.timeInRole > 36 && !employee.hasDevelopmentPlan) {
      // >3 years
      riskScore += 15;
      factors.push({
        factor: `Extended time in role (${Math.floor(employee.timeInRole / 12)} years) without development plan`,
        severity: 'high',
      });
      recommendations.push('Discuss promotion opportunities or lateral moves for growth');
    } else if (employee.timeInRole > 24) {
      // >2 years
      riskScore += 7;
      factors.push({
        factor: 'Approaching tenure threshold where growth opportunities become critical',
        severity: 'low',
      });
    }
  }

  // Factor 7: Low performance (max 10 points)
  if (employee.performanceRating && employee.performanceRating < 3) {
    riskScore += 10;
    factors.push({
      factor: 'Below-average performance may indicate job misfit or disengagement',
      severity: 'medium',
    });
    recommendations.push('Performance improvement plan with clear goals and support');
  }

  // Determine risk level
  let riskLevel: 'low' | 'medium' | 'high' | 'critical';
  if (riskScore >= 75) riskLevel = 'critical';
  else if (riskScore >= 50) riskLevel = 'high';
  else if (riskScore >= 30) riskLevel = 'medium';
  else riskLevel = 'low';

  // Calculate intervention priority (1-10)
  const interventionPriority = Math.min(10, Math.ceil(riskScore / 10));

  // General recommendations based on risk level
  if (riskLevel === 'critical') {
    recommendations.unshift('URGENT: Schedule immediate retention conversation with senior leadership involvement');
  } else if (riskLevel === 'high') {
    recommendations.unshift('High priority: Initiate retention strategy within 1-2 weeks');
  }

  // Add positive reinforcement if low risk
  if (riskLevel === 'low') {
    recommendations.push('Continue positive engagement practices; recognize contributions');
  }

  return {
    riskLevel,
    riskScore: Math.min(100, riskScore),
    factors,
    recommendations,
    interventionPriority,
  };
}

/**
 * Calculate retention risk for entire team
 * Returns sorted list by risk level
 */
export function calculateTeamRetentionRisk(
  employees: Employee[]
): Array<{ employee: Employee; risk: RetentionRiskResult }> {
  const results = employees.map((employee) => ({
    employee,
    risk: calculateRetentionRisk(employee),
  }));

  // Sort by risk score (highest first)
  return results.sort((a, b) => b.risk.riskScore - a.risk.riskScore);
}

/**
 * Get aggregated team retention metrics
 */
export function getTeamRetentionMetrics(employees: Employee[]): {
  averageRiskScore: number;
  distribution: Record<string, number>;
  highRiskCount: number;
  topFactors: Array<{ factor: string; count: number }>;
} {
  const risks = employees.map((e) => calculateRetentionRisk(e));

  const averageRiskScore =
    risks.reduce((sum, r) => sum + r.riskScore, 0) / risks.length;

  const distribution: Record<string, number> = {
    low: 0,
    medium: 0,
    high: 0,
    critical: 0,
  };

  risks.forEach((r) => {
    distribution[r.riskLevel]++;
  });

  const highRiskCount = distribution.high + distribution.critical;

  // Aggregate factors
  const factorCounts = new Map<string, number>();
  risks.forEach((r) => {
    r.factors.forEach((f) => {
      const count = factorCounts.get(f.factor) || 0;
      factorCounts.set(f.factor, count + 1);
    });
  });

  const topFactors = Array.from(factorCounts.entries())
    .map(([factor, count]) => ({ factor, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    averageRiskScore: Math.round(averageRiskScore),
    distribution,
    highRiskCount,
    topFactors,
  };
}
