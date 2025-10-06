/**
 * Reports API
 * Get list of user's test results
 * @route GET /api/reports
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Find all test results for this user
    const testResults = await prisma.testResult.findMany({
      where: {
        email: session.user.email,
      },
      select: {
        testId: true,
        completedAt: true,
        scores: true,
        paid: true,
      },
      orderBy: {
        completedAt: 'desc',
      },
    });

    return NextResponse.json({
      reports: testResults,
    });
  } catch (error) {
    console.error('Reports fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
