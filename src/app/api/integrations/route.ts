/**
 * Integrations API
 * Manage third-party integrations
 * @route GET /api/integrations
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

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
    });

    if (!companyAdmin) {
      return NextResponse.json({ integrations: [] });
    }

    // Get integrations
    const integrations = await prisma.integration.findMany({
      where: {
        companyId: companyAdmin.companyId,
      },
      select: {
        id: true,
        integrationType: true,
        integrationName: true,
        isActive: true,
        connectionStatus: true,
        lastSyncAt: true,
        createdAt: true,
        // Don't expose credentials
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ integrations });
  } catch (error) {
    console.error('Integrations fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
