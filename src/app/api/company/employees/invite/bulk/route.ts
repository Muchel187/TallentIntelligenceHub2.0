/**
 * Bulk Employee Invitation API
 * Send multiple invitation emails at once
 * @route POST /api/company/employees/invite/bulk
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { nanoid } from 'nanoid';

const bulkInviteSchema = z.object({
  emails: z.array(z.string().email()).min(1).max(100),
});

/**
 * POST /api/company/employees/invite/bulk
 * Send bulk employee invitations
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
    const data = bulkInviteSchema.parse(body);

    // Get existing employees and invitations
    const [existingEmployees, existingInvitations] = await Promise.all([
      prisma.employee.findMany({
        where: {
          companyId: companyAdmin.companyId,
          email: { in: data.emails },
        },
        select: { email: true },
      }),
      prisma.employeeInvitation.findMany({
        where: {
          companyId: companyAdmin.companyId,
          email: { in: data.emails },
        },
        select: { email: true },
      }),
    ]);

    const existingEmails = new Set([
      ...existingEmployees.map((e) => e.email),
      ...existingInvitations.map((i) => i.email),
    ]);

    // Filter out already existing emails
    const newEmails = data.emails.filter((email) => !existingEmails.has(email));

    if (newEmails.length === 0) {
      return NextResponse.json(
        { error: 'All emails already have invitations or are employees' },
        { status: 400 }
      );
    }

    // Create invitations
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

    const invitations = await Promise.all(
      newEmails.map(async (email) => {
        const invitationToken = nanoid(32);

        return prisma.employeeInvitation.create({
          data: {
            companyId: companyAdmin.companyId,
            email,
            firstName: '',
            lastName: '',
            invitationToken,
            expiresAt,
            status: 'pending',
          },
        });
      })
    );

    // Send invitation emails (async, don't wait)
    // TODO: Implement bulk email service
    invitations.forEach((invitation) => {
      const invitationUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/test?token=${invitation.invitationToken}`;
      console.log(`Bulk invitation URL for ${invitation.email}: ${invitationUrl}`);
    });

    return NextResponse.json({
      success: true,
      invited: invitations.length,
      skipped: data.emails.length - invitations.length,
      invitations: invitations.map((inv) => ({
        id: inv.id,
        email: inv.email,
      })),
    }, { status: 201 });
  } catch (error) {
    console.error('Bulk invitation error:', error);

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
