/**
 * Employee Management API
 * Handles employee CRUD operations for B2B companies
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { sendEmployeeInvitation } from '@/services/email';
import { nanoid } from 'nanoid';

const createEmployeeSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  position: z.string().optional(),
  level: z.enum(['junior', 'mid', 'senior', 'lead', 'manager', 'executive']).optional(),
  employmentType: z.enum(['full_time', 'part_time', 'contract', 'intern']).optional(),
  departmentId: z.number().int().optional(),
  startDate: z.string().optional(),
  sendInvitation: z.boolean().optional(),
});

interface PageParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/company/[id]/employees
 * Get all employees for a company
 */
export async function GET(request: NextRequest, { params }: PageParams) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: companyId } = await params;

    // Check if user is admin of this company
    const admin = await prisma.companyAdmin.findFirst({
      where: {
        companyId: parseInt(companyId),
        userId: session.user.id,
      },
    });

    if (!admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const employees = await prisma.employee.findMany({
      where: { companyId: parseInt(companyId) },
      include: {
        department: {
          select: {
            id: true,
            name: true,
          },
        },
        employeeTests: {
          select: {
            testId: true,
            completedAt: true,
            scores: true,
          },
          orderBy: { completedAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ employees });
  } catch (error) {
    console.error('Get employees error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/company/[id]/employees
 * Create new employee
 */
export async function POST(request: NextRequest, { params }: PageParams) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: companyId } = await params;

    // Check if user is admin
    const admin = await prisma.companyAdmin.findFirst({
      where: {
        companyId: parseInt(companyId),
        userId: session.user.id,
        role: { in: ['owner', 'admin', 'hr_manager'] },
      },
    });

    if (!admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const data = createEmployeeSchema.parse(body);

    // Check if company has reached employee limit
    const company = await prisma.company.findUnique({
      where: { id: parseInt(companyId) },
      include: {
        _count: {
          select: { employees: true },
        },
      },
    });

    if (company && company._count.employees >= company.maxEmployees) {
      return NextResponse.json(
        { error: 'Employee limit reached. Please upgrade your plan.' },
        { status: 403 }
      );
    }

    // Create employee
    const employee = await prisma.employee.create({
      data: {
        companyId: parseInt(companyId),
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        position: data.position,
        level: data.level,
        employmentType: data.employmentType,
        departmentId: data.departmentId,
        startDate: data.startDate ? new Date(data.startDate) : null,
      },
    });

    // Create invitation if requested
    if (data.sendInvitation) {
      const invitationToken = nanoid(32);
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

      await prisma.employeeInvitation.create({
        data: {
          companyId: parseInt(companyId),
          email: data.email,
          token: invitationToken,
          expiresAt,
          createdBy: session.user.id!,
        },
      });

      // Send invitation email
      await sendEmployeeInvitation(
        data.email,
        `${data.firstName} ${data.lastName}`,
        company?.name || 'Your Company',
        session.user.name || 'Team Admin',
        invitationToken,
        expiresAt
      ).catch(console.error);
    }

    return NextResponse.json(employee, { status: 201 });
  } catch (error) {
    console.error('Create employee error:', error);

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
 * DELETE /api/company/[id]/employees?employeeId=123
 * Delete employee
 */
export async function DELETE(request: NextRequest, { params }: PageParams) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: companyId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const employeeId = searchParams.get('employeeId');

    if (!employeeId) {
      return NextResponse.json({ error: 'Employee ID required' }, { status: 400 });
    }

    // Check if user is admin
    const admin = await prisma.companyAdmin.findFirst({
      where: {
        companyId: parseInt(companyId),
        userId: session.user.id,
        role: { in: ['owner', 'admin', 'hr_manager'] },
      },
    });

    if (!admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Delete employee
    await prisma.employee.delete({
      where: { id: parseInt(employeeId) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete employee error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
