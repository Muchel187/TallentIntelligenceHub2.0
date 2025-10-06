/**
 * Company Stats API
 * Get company overview statistics
 * @route GET /api/company/stats
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

    // Find company for this user
    const companyAdmin = await prisma.companyAdmin.findFirst({
      where: {
        email: session.user.email,
      },
      include: {
        company: true,
      },
    });

    if (!companyAdmin) {
      return NextResponse.json({
        stats: {
          totalEmployees: 0,
          testsCompleted: 0,
          invitationsSent: 0,
          departments: 0,
        },
      });
    }

    // Get company stats
    const [totalEmployees, testsCompleted, invitationsSent, departments] = await Promise.all([
      prisma.employee.count({
        where: { companyId: companyAdmin.companyId },
      }),
      prisma.employee.count({
        where: {
          companyId: companyAdmin.companyId,
          testCompleted: true,
        },
      }),
      prisma.employeeInvitation.count({
        where: { companyId: companyAdmin.companyId },
      }),
      prisma.department.count({
        where: { companyId: companyAdmin.companyId },
      }),
    ]);

    return NextResponse.json({
      company: {
        id: companyAdmin.companyId,
        name: companyAdmin.company.name,
        industry: companyAdmin.company.industry,
      },
      stats: {
        totalEmployees,
        testsCompleted,
        invitationsSent,
        departments,
      },
    });
  } catch (error) {
    console.error('Company stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
