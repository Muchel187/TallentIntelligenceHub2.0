/**
 * Voucher Validation API
 * Validates voucher codes for free access
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';

const validateSchema = z.object({
  code: z.string().min(1).max(50),
});

/**
 * POST /api/voucher/validate
 * Validate voucher code
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = validateSchema.parse(body);

    const voucher = await prisma.voucher.findUnique({
      where: { code: data.code },
    });

    if (!voucher) {
      return NextResponse.json(
        { valid: false, error: 'Voucher code not found' },
        { status: 404 }
      );
    }

    // Check expiry
    if (voucher.validUntil < new Date()) {
      return NextResponse.json(
        { valid: false, error: 'Voucher has expired' },
        { status: 400 }
      );
    }

    // Check usage limit
    if (voucher.currentUses >= voucher.maxUses) {
      return NextResponse.json(
        { valid: false, error: 'Voucher has reached maximum uses' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      description: voucher.description,
      remainingUses: voucher.maxUses - voucher.currentUses,
    });
  } catch (error) {
    console.error('Voucher validation error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
