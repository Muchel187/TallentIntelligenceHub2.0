/**
 * Employee Invitation API
 * Send invitation emails to employees
 * @route POST /api/company/employees/invite
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { nanoid } from 'nanoid';

const singleInviteSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  position: z.string().optional(),
  departmentId: z.number().optional(),
});

/**
 * POST /api/company/employees/invite
 * Send single employee invitation
 */
export async function POST(request: NextRequest) {
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
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const data = singleInviteSchema.parse(body);

    // Check if employee already exists
    const existingEmployee = await prisma.employee.findFirst({
      where: {
        companyId: companyAdmin.companyId,
        email: data.email,
      },
    });

    if (existingEmployee) {
      return NextResponse.json(
        { error: 'Employee already exists' },
        { status: 409 }
      );
    }

    // Check if invitation already sent
    const existingInvitation = await prisma.employeeInvitation.findFirst({
      where: {
        companyId: companyAdmin.companyId,
        email: data.email,
      },
    });

    if (existingInvitation) {
      return NextResponse.json(
        { error: 'Invitation already sent to this email' },
        { status: 409 }
      );
    }

    // Generate invitation token
    const invitationToken = nanoid(32);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

    // Create employee invitation
    const invitation = await prisma.employeeInvitation.create({
      data: {
        companyId: companyAdmin.companyId,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        position: data.position || null,
        departmentId: data.departmentId || null,
        invitationToken,
        expiresAt,
        status: 'pending',
      },
    });

    // Send invitation email (async, don't wait)
    // TODO: Implement email service
    const invitationUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/test?token=${invitationToken}`;
    console.log(`Invitation URL for ${data.email}: ${invitationUrl}`);

    // sendInvitationEmail(data.email, {
    //   firstName: data.firstName,
    //   companyName: companyAdmin.company.name,
    //   invitationUrl,
    // }).catch(console.error);

    return NextResponse.json({
      success: true,
      invitation: {
        id: invitation.id,
        email: invitation.email,
        invitationUrl,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Employee invitation error:', error);

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
