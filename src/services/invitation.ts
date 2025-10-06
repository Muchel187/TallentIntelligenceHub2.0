/**
 * Invitation Service
 * Handles employee invitation logic for B2B
 */

import { prisma } from '@/lib/db';
import { sendEmployeeInvitation } from './email';
import { nanoid } from 'nanoid';

/**
 * Create and send employee invitation
 */
export async function createInvitation(
  companyId: number,
  email: string,
  createdBy: string
): Promise<string> {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
  });

  if (!company) {
    throw new Error('Company not found');
  }

  const invitationToken = nanoid(32);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30); // 30 days expiry

  await prisma.employeeInvitation.create({
    data: {
      companyId,
      email,
      token: invitationToken,
      expiresAt,
      createdBy,
    },
  });

  // Send invitation email
  await sendEmployeeInvitation(
    email,
    'Employee', // TODO: Get actual employee name
    company.name,
    'Admin', // TODO: Get actual inviter name
    invitationToken,
    expiresAt
  );

  return invitationToken;
}

/**
 * Validate invitation token
 */
export async function validateInvitation(token: string): Promise<{
  valid: boolean;
  companyId?: number;
  email?: string;
  error?: string;
}> {
  const invitation = await prisma.employeeInvitation.findUnique({
    where: { token },
    include: { company: true },
  });

  if (!invitation) {
    return { valid: false, error: 'Invitation not found' };
  }

  if (invitation.acceptedAt) {
    return { valid: false, error: 'Invitation already used' };
  }

  if (invitation.expiresAt < new Date()) {
    return { valid: false, error: 'Invitation expired' };
  }

  return {
    valid: true,
    companyId: invitation.companyId,
    email: invitation.email,
  };
}

/**
 * Accept invitation and link test result
 */
export async function acceptInvitation(
  token: string,
  testId: string
): Promise<void> {
  const validation = await validateInvitation(token);

  if (!validation.valid) {
    throw new Error(validation.error || 'Invalid invitation');
  }

  // Update invitation as accepted
  await prisma.employeeInvitation.update({
    where: { token },
    data: { acceptedAt: new Date() },
  });

  // Find or create employee record
  const employee = await prisma.employee.findFirst({
    where: {
      companyId: validation.companyId!,
      email: validation.email!,
    },
  });

  if (employee) {
    // Link test to employee
    await prisma.employee.update({
      where: { id: employee.id },
      data: {
        testId,
        testCompleted: true,
        testCompletedAt: new Date(),
      },
    });
  }
}
