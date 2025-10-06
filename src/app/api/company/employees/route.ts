/**
 * Company Employees API
 * Manage company employees
 * @route GET /api/company/employees
 * @route POST /api/company/employees
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const createEmployeeSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  departmentId: z.number().optional(),
  position: z.string().optional(),
});

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
    });

    if (!companyAdmin) {
      return NextResponse.json({ employees: [] });
    }

    // Get URL search params
    const searchParams = request.nextUrl.searchParams;
    const departmentId = searchParams.get('department');
    const search = searchParams.get('search');

    // Build query
    const where: any = {
      companyId: companyAdmin.companyId,
    };

    if (departmentId && departmentId !== 'all') {
      where.departmentId = parseInt(departmentId);
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const employees = await prisma.employee.findMany({
      where,
      include: {
        department: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ employees });
  } catch (error) {
    console.error('Employees fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const companyAdmin = await prisma.companyAdmin.findFirst({
      where: {
        email: session.user.email,
      },
    });

    if (!companyAdmin) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const data = createEmployeeSchema.parse(body);

    // Check if employee already exists
    const existing = await prisma.employee.findFirst({
      where: {
        companyId: companyAdmin.companyId,
        email: data.email,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Employee already exists' },
        { status: 409 }
      );
    }

    // Create employee
    const employee = await prisma.employee.create({
      data: {
        companyId: companyAdmin.companyId,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        departmentId: data.departmentId || null,
        position: data.position || null,
      },
    });

    return NextResponse.json({ employee }, { status: 201 });
  } catch (error) {
    console.error('Employee creation error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
