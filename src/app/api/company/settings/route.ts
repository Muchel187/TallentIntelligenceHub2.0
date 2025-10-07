/**
 * Company Settings API
 * Get and update company settings
 * @route GET/PUT /api/company/settings
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const settingsSchema = z.object({
  name: z.string().min(1),
  domain: z.string().optional(),
  industry: z.string().optional(),
  size: z.string().optional(),
  billingEmail: z.string().email().optional(),
});

/**
 * GET /api/company/settings
 * Get company settings
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find company for this user
    const companyAdmin = await prisma.companyAdmin.findFirst({
      where: { email: session.user.email },
      include: { company: true },
    });

    if (!companyAdmin) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    return NextResponse.json({
      name: companyAdmin.company.name,
      domain: companyAdmin.company.domain,
      industry: companyAdmin.company.industry,
      size: companyAdmin.company.size,
      billingEmail: companyAdmin.company.billingEmail,
      subscriptionPlan: companyAdmin.company.subscriptionPlan,
      subscriptionStatus: companyAdmin.company.subscriptionStatus,
    });
  } catch (error) {
    console.error('Failed to fetch company settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PUT /api/company/settings
 * Update company settings
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find company for this user
    const companyAdmin = await prisma.companyAdmin.findFirst({
      where: { email: session.user.email },
      include: { company: true },
    });

    if (!companyAdmin) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    // Check permissions
    if (companyAdmin.role !== 'owner' && companyAdmin.role !== 'admin') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();
    const data = settingsSchema.parse(body);

    // Update company
    const updatedCompany = await prisma.company.update({
      where: { id: companyAdmin.companyId },
      data: {
        name: data.name,
        domain: data.domain || null,
        industry: data.industry || null,
        size: data.size || null,
        billingEmail: data.billingEmail || null,
      },
    });

    return NextResponse.json({
      success: true,
      company: {
        name: updatedCompany.name,
        domain: updatedCompany.domain,
        industry: updatedCompany.industry,
        size: updatedCompany.size,
        billingEmail: updatedCompany.billingEmail,
      },
    });
  } catch (error) {
    console.error('Failed to update company settings:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
