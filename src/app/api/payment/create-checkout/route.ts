/**
 * Stripe Checkout API
 * Creates checkout sessions for premium upgrade
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

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
    // Note: This requires Stripe to be installed: npm install stripe
    // For now, this is a placeholder implementation

    const body = await request.json();
    const data = checkoutSchema.parse(body);

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

    // TODO: Implement Stripe checkout
    /*
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-10-16',
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
              description: 'Full personality report with AI coaching',
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
    */

    // Placeholder response
    return NextResponse.json({
      error: 'Stripe integration not yet configured',
      message: 'Install Stripe SDK and configure STRIPE_SECRET_KEY',
    }, { status: 501 });
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
