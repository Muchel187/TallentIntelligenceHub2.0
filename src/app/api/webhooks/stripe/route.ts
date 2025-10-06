/**
 * Stripe Webhook Handler
 * Processes payment events from Stripe
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendPaymentConfirmationEmail } from '@/services/email';

/**
 * POST /api/webhooks/stripe
 * Handle Stripe webhook events
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    // TODO: Verify webhook signature and process events
    /*
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;
      const testId = session.metadata?.testId;
      const customerEmail = session.customer_email;

      if (testId) {
        // Update test result to paid
        await prisma.testResult.update({
          where: { testId },
          data: { paid: true },
        });

        // Send confirmation email
        if (customerEmail) {
          await sendPaymentConfirmationEmail(customerEmail, testId);
        }
      }
    }

    return NextResponse.json({ received: true });
    */

    // Placeholder response
    console.log('Stripe webhook received (not processed - Stripe not configured)');
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
