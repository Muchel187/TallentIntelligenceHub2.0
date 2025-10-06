import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';

const createVoucherSchema = z.object({
  code: z.string().min(3).max(50),
  discountPercent: z.number().min(0).max(100),
  maxUses: z.number().nullable().optional(),
  expiresAt: z.string().nullable().optional(),
});

/**
 * GET /api/admin/vouchers - List all vouchers
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Add admin authentication check
    // const session = await auth();
    // if (!session?.user?.role === 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const vouchers = await prisma.voucher.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ vouchers });
  } catch (error) {
    console.error('Failed to fetch vouchers:', error);
    return NextResponse.json({ error: 'Failed to fetch vouchers' }, { status: 500 });
  }
}

/**
 * POST /api/admin/vouchers - Create new voucher
 */
export async function POST(request: NextRequest) {
  try {
    // TODO: Add admin authentication check
    // const session = await auth();
    // if (!session?.user?.role === 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body = await request.json();
    const data = createVoucherSchema.parse(body);

    // Check if code already exists
    const existing = await prisma.voucher.findUnique({
      where: { code: data.code },
    });

    if (existing) {
      return NextResponse.json({ error: 'Voucher code already exists' }, { status: 400 });
    }

    const voucher = await prisma.voucher.create({
      data: {
        code: data.code,
        description: '',
        validUntil: data.expiresAt ? new Date(data.expiresAt) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        maxUses: data.maxUses || 999999,
        createdBy: 'admin', // TODO: Get from session
      },
    });

    return NextResponse.json({ voucher }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Failed to create voucher:', error);
    return NextResponse.json({ error: 'Failed to create voucher' }, { status: 500 });
  }
}
