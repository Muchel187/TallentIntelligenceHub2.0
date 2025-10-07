/**
 * Admin Tests API
 * Get all test results for admin dashboard
 * @route GET /api/admin/tests
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

/**
 * GET /api/admin/tests
 * Get all tests (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Simple admin check (in production, use proper role-based auth)
    const isAdmin = session.user.email === 'tester@teste.de' || session.user.email === 'Jurakb1986@gmail.com';

    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get all tests
    const tests = await prisma.testResult.findMany({
      select: {
        id: true,
        testId: true,
        email: true,
        completedAt: true,
        paid: true,
        reportGeneratedAt: true,
      },
      orderBy: {
        completedAt: 'desc',
      },
    });

    return NextResponse.json({ tests });
  } catch (error) {
    console.error('Failed to fetch tests:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
