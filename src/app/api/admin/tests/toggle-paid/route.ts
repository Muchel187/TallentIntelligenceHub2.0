/**
 * Admin Toggle Paid Status API
 * Toggle paid status for a test result
 * @route POST /api/admin/tests/toggle-paid
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const toggleSchema = z.object({
  testId: z.string(),
  paid: z.boolean(),
});

/**
 * POST /api/admin/tests/toggle-paid
 * Toggle paid status (admin only)
 */
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const data = toggleSchema.parse(body);

    // Update test paid status
    const updated = await prisma.testResult.update({
      where: { testId: data.testId },
      data: { paid: data.paid },
    });

    return NextResponse.json({
      success: true,
      testId: updated.testId,
      paid: updated.paid,
    });
  } catch (error) {
    console.error('Failed to toggle paid status:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
