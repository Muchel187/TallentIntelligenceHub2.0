/**
 * Company CRUD API
 * Manages company profiles for B2B customers
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';

const createCompanySchema = z.object({
  name: z.string().min(1).max(200),
  domain: z.string().optional(),
  industry: z.string().optional(),
  size: z.enum(['1-10', '10-50', '50-200', '200-1000', '1000+']).optional(),
  billingEmail: z.string().email().optional(),
});

const updateCompanySchema = createCompanySchema.partial();

/**
 * GET /api/company
 * Get all companies or specific company by ID
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const companyId = searchParams.get('id');

    if (companyId) {
      // Get specific company
      const company = await prisma.company.findUnique({
        where: { id: parseInt(companyId) },
        include: {
          admins: true,
          departments: true,
          employees: {
            take: 10,
            orderBy: { createdAt: 'desc' },
          },
          _count: {
            select: {
              employees: true,
              objectives: true,
            },
          },
        },
      });

      if (!company) {
        return NextResponse.json({ error: 'Company not found' }, { status: 404 });
      }

      return NextResponse.json(company);
    }

    // Get all companies for user (admin role)
    const companies = await prisma.company.findMany({
      where: {
        admins: {
          some: {
            userId: session.user.id,
          },
        },
      },
      include: {
        _count: {
          select: {
            employees: true,
            departments: true,
          },
        },
      },
    });

    return NextResponse.json({ companies });
  } catch (error) {
    console.error('Get company error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/company
 * Create new company
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = createCompanySchema.parse(body);

    // Create company with admin
    const company = await prisma.company.create({
      data: {
        ...data,
        admins: {
          create: {
            userId: session.user.id!,
            email: session.user.email!,
            role: 'owner',
            permissions: JSON.stringify(['all']),
          },
        },
      },
      include: {
        admins: true,
      },
    });

    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    console.error('Create company error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PUT /api/company?id=123
 * Update company
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const companyId = searchParams.get('id');

    if (!companyId) {
      return NextResponse.json({ error: 'Company ID required' }, { status: 400 });
    }

    // Check if user is admin of this company
    const admin = await prisma.companyAdmin.findFirst({
      where: {
        companyId: parseInt(companyId),
        userId: session.user.id,
        role: { in: ['owner', 'admin'] },
      },
    });

    if (!admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const data = updateCompanySchema.parse(body);

    const company = await prisma.company.update({
      where: { id: parseInt(companyId) },
      data,
    });

    return NextResponse.json(company);
  } catch (error) {
    console.error('Update company error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/company?id=123
 * Delete company (soft delete by changing status)
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const companyId = searchParams.get('id');

    if (!companyId) {
      return NextResponse.json({ error: 'Company ID required' }, { status: 400 });
    }

    // Check if user is owner
    const admin = await prisma.companyAdmin.findFirst({
      where: {
        companyId: parseInt(companyId),
        userId: session.user.id,
        role: 'owner',
      },
    });

    if (!admin) {
      return NextResponse.json({ error: 'Only company owner can delete' }, { status: 403 });
    }

    // Soft delete by updating status
    await prisma.company.update({
      where: { id: parseInt(companyId) },
      data: { subscriptionStatus: 'cancelled' },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete company error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
