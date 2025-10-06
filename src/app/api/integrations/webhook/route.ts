/**
 * Integration Webhook API
 * Manages webhook configurations for external integrations
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { nanoid } from 'nanoid';

const createWebhookSchema = z.object({
  companyId: z.number().int(),
  integrationId: z.number().int(),
  webhookUrl: z.string().url(),
  events: z.array(z.string()),
});

/**
 * GET /api/integrations/webhook?companyId=123
 * Get all webhooks for a company
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const companyId = searchParams.get('companyId');

    if (!companyId) {
      return NextResponse.json({ error: 'companyId required' }, { status: 400 });
    }

    // Check if user is admin
    const admin = await prisma.companyAdmin.findFirst({
      where: {
        companyId: parseInt(companyId),
        userId: session.user.id,
      },
    });

    if (!admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const webhooks = await prisma.webhook.findMany({
      where: { companyId: parseInt(companyId) },
      include: { integration: true },
    });

    return NextResponse.json({ webhooks });
  } catch (error) {
    console.error('Get webhooks error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/integrations/webhook
 * Create new webhook
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = createWebhookSchema.parse(body);

    // Check if user is admin
    const admin = await prisma.companyAdmin.findFirst({
      where: {
        companyId: data.companyId,
        userId: session.user.id,
        role: { in: ['owner', 'admin'] },
      },
    });

    if (!admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Generate webhook secret
    const webhookSecret = nanoid(32);

    const webhook = await prisma.webhook.create({
      data: {
        companyId: data.companyId,
        integrationId: data.integrationId,
        webhookUrl: data.webhookUrl,
        webhookSecret,
        events: data.events,
        isActive: true,
      },
    });

    return NextResponse.json(webhook, { status: 201 });
  } catch (error) {
    console.error('Create webhook error:', error);

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
 * DELETE /api/integrations/webhook?id=123
 * Delete webhook
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const webhookId = searchParams.get('id');

    if (!webhookId) {
      return NextResponse.json({ error: 'webhook ID required' }, { status: 400 });
    }

    const webhook = await prisma.webhook.findUnique({
      where: { id: parseInt(webhookId) },
    });

    if (!webhook) {
      return NextResponse.json({ error: 'Webhook not found' }, { status: 404 });
    }

    // Check if user is admin of the company
    const admin = await prisma.companyAdmin.findFirst({
      where: {
        companyId: webhook.companyId,
        userId: session.user.id,
        role: { in: ['owner', 'admin'] },
      },
    });

    if (!admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.webhook.delete({
      where: { id: parseInt(webhookId) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
