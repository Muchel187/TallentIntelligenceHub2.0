/**
 * Webhook Utilities
 * Helper functions for webhook management and delivery
 */

import crypto from 'crypto';
import { prisma } from './db';

export interface WebhookPayload {
  event: string;
  timestamp: string;
  data: Record<string, any>;
}

/**
 * Generate webhook signature for verification
 */
export function generateWebhookSignature(
  payload: string,
  secret: string
): string {
  return crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = generateWebhookSignature(payload, secret);
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

/**
 * Deliver webhook to external endpoint
 */
export async function deliverWebhook(
  webhookId: number,
  event: string,
  data: Record<string, any>
): Promise<void> {
  const webhook = await prisma.webhook.findUnique({
    where: { id: webhookId },
  });

  if (!webhook || !webhook.isActive) {
    return;
  }

  // Check if this event is subscribed
  const events = webhook.events as string[];
  if (!events.includes(event)) {
    return;
  }

  const payload: WebhookPayload = {
    event,
    timestamp: new Date().toISOString(),
    data,
  };

  const payloadString = JSON.stringify(payload);
  const signature = generateWebhookSignature(payloadString, webhook.webhookSecret);

  try {
    const response = await fetch(webhook.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': signature,
        'X-Webhook-Event': event,
      },
      body: payloadString,
    });

    if (!response.ok) {
      throw new Error(`Webhook delivery failed: ${response.statusText}`);
    }

    // Reset failure count on success
    await prisma.webhook.update({
      where: { id: webhookId },
      data: {
        lastTriggeredAt: new Date(),
        failureCount: 0,
      },
    });
  } catch (error) {
    console.error(`Webhook delivery error for ${webhookId}:`, error);

    // Increment failure count
    const updatedWebhook = await prisma.webhook.update({
      where: { id: webhookId },
      data: {
        failureCount: { increment: 1 },
      },
    });

    // Disable webhook after 5 consecutive failures
    if (updatedWebhook.failureCount >= 5) {
      await prisma.webhook.update({
        where: { id: webhookId },
        data: { isActive: false },
      });
    }
  }
}

/**
 * Trigger webhooks for an event
 */
export async function triggerWebhooks(
  companyId: number,
  event: string,
  data: Record<string, any>
): Promise<void> {
  const webhooks = await prisma.webhook.findMany({
    where: {
      companyId,
      isActive: true,
    },
  });

  // Deliver to all applicable webhooks in parallel
  await Promise.all(
    webhooks.map((webhook) => deliverWebhook(webhook.id, event, data))
  );
}
