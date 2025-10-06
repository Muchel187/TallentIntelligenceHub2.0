/**
 * Team Analytics API
 * Provides team-level Big Five analytics and insights
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { calculateTeamMatrix } from '@/core/compatibility';
import { calculateTeamRetentionRisk } from '@/core/retention-risk';

/**
 * GET /api/analytics/team?companyId=123&departmentId=456
 * Get team analytics
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const departmentParam = searchParams.get('department');

    // Find company for this user
    const admin = await prisma.companyAdmin.findFirst({
      where: {
        email: session.user.email,
      },
    });

    if (!admin) {
      // Return empty analytics if no company
      return NextResponse.json({
        teamSize: 0,
        avgScores: { O: 0, C: 0, E: 0, A: 0, N: 0 },
        compatibility: 0,
        retentionRisk: { low: 0, medium: 0, high: 0, critical: 0 },
      });
    }

    const companyId = admin.companyId;
    const departmentId = departmentParam && departmentParam !== 'all' ? parseInt(departmentParam) : undefined;

    // Get employees with test results
    const employees = await prisma.employee.findMany({
      where: {
        companyId: parseInt(companyId),
        departmentId: departmentId ? parseInt(departmentId) : undefined,
        testCompleted: true,
      },
      include: {
        employeeTests: {
          orderBy: { completedAt: 'desc' },
          take: 1,
        },
        moodSurveys: {
          orderBy: { surveyDate: 'desc' },
          take: 5,
        },
        developmentPlans: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    const totalEmployees = employees.length;
    const testsCompleted = employees.filter((e) => e.testCompleted).length;

    // Calculate average scores
    const scoresData = employees
      .map((e) => e.employeeTests[0]?.scores)
      .filter(Boolean);

    const avgScores = {
      O: 0,
      C: 0,
      E: 0,
      A: 0,
      N: 0,
    };

    if (scoresData.length > 0) {
      scoresData.forEach((scores: any) => {
        avgScores.O += scores.O;
        avgScores.C += scores.C;
        avgScores.E += scores.E;
        avgScores.A += scores.A;
        avgScores.N += scores.N;
      });

      Object.keys(avgScores).forEach((key) => {
        avgScores[key as keyof typeof avgScores] = Math.round(
          avgScores[key as keyof typeof avgScores] / scoresData.length
        );
      });
    }

    // Calculate team health score (composite metric)
    const teamHealthScore = calculateTeamHealthScore(avgScores, employees);

    // Compatibility matrix
    const teamMembers = employees
      .filter((e) => e.employeeTests[0])
      .map((e) => ({
        id: e.id,
        name: `${e.firstName} ${e.lastName}`,
        scores: e.employeeTests[0].scores as any,
      }));

    const compatibilityMatrix =
      teamMembers.length > 1 ? calculateTeamMatrix(teamMembers) : null;

    // Retention risk analysis
    const retentionData = employees
      .filter((e) => e.employeeTests[0])
      .map((e) => ({
        id: e.id,
        name: `${e.firstName} ${e.lastName}`,
        scores: e.employeeTests[0].scores as any,
        moodHistory: e.moodSurveys.map((m) => ({
          moodScore: m.moodScore,
          date: m.surveyDate,
        })),
        hasDevelopmentPlan: e.developmentPlans.length > 0,
        skillGaps: e.developmentPlans[0]?.skillGaps as string[] | undefined,
      }));

    const retentionMetrics = calculateTeamRetentionRisk(retentionData);

    return NextResponse.json({
      teamSize: totalEmployees,
      avgScores,
      compatibility: retentionMetrics.avgCompatibility || 0,
      retentionRisk: {
        low: retentionMetrics.low || 0,
        medium: retentionMetrics.medium || 0,
        high: retentionMetrics.high || 0,
        critical: retentionMetrics.critical || 0,
      },
    });
  } catch (error) {
    console.error('Team analytics error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * Calculate team health score (0-100)
 */
function calculateTeamHealthScore(
  avgScores: any,
  employees: any[]
): number {
  // Ideal team profile (research-based)
  const ideal = {
    O: 75, // Moderate-high openness for innovation
    C: 80, // High conscientiousness for reliability
    E: 65, // Moderate extraversion for balance
    A: 75, // Moderate-high agreeableness for collaboration
    N: 45, // Low neuroticism for stability
  };

  // Calculate deviation from ideal
  const deviations = Object.keys(ideal).map((key) => {
    const diff = Math.abs(avgScores[key] - ideal[key as keyof typeof ideal]);
    return diff / 120; // Normalize to 0-1
  });

  const avgDeviation =
    deviations.reduce((sum, d) => sum + d, 0) / deviations.length;

  // Convert to health score (0-100)
  const healthScore = Math.round((1 - avgDeviation) * 100);

  return Math.max(0, Math.min(100, healthScore));
}
