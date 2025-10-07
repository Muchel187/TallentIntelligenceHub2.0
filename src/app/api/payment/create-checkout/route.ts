/**
 * Stripe Checkout API
 * Creates checkout sessions for premium upgrade
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import Stripe from 'stripe';

const checkoutSchema = z.object({
  testId: z.string(),
  email: z.string().email(),
});

/**
 * POST /api/payment/create-checkout
 * Create Stripe checkout session
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = checkoutSchema.parse(body);

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({
        error: 'Stripe not configured',
        message: 'STRIPE_SECRET_KEY is missing in environment variables',
      }, { status: 503 });
    }

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia',
    });

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card', 'klarna'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'NOBA EXPERTS Premium Report',
              description: 'Vollständiger Persönlichkeitsbericht mit KI-Coaching',
            },
            unit_amount: 4900, // 49.00 EUR in cents
          },
          quantity: 1,
        },
      ],
      customer_email: data.email,
      metadata: {
        testId: data.testId,
      },
      success_url: `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/report/${data.testId}`,
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Checkout error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
