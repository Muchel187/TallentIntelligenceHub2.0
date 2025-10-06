/**
 * Test Submission API
 * Handles Big Five test submissions, calculates scores, generates test IDs
 * @route POST /api/test/submit
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { calculateBigFiveScores } from '@/core/big-five-scorer';
import { nanoid } from 'nanoid';

// Validation schema
const submitSchema = z.object({
  answers: z.array(
    z.object({
      questionId: z.number().int().min(1).max(120),
      score: z.number().int().min(1).max(5),
    })
  ).length(120), // Must answer all 120 questions
  userDetails: z.object({
    age: z.number().int().min(16).max(100),
    currentJob: z.string().min(1).max(200),
    experienceLevel: z.enum(['junior', 'mid', 'senior', 'lead', 'executive']),
    industry: z.string().min(1).max(100),
    careerGoal: z.string().min(10).max(500),
    biggestChallenge: z.string().min(10).max(500),
    workEnvironment: z.enum(['remote', 'office', 'hybrid']),
  }),
  email: z.string().email(),
  voucher: z.string().optional(),
});

/**
 * Generate unique test ID
 */
function generateTestId(): string {
  const timestamp = Date.now();
  const random = nanoid(10);
  return `test_${timestamp}_${random}`;
}

/**
 * Validate voucher code
 */
async function validateVoucher(code: string): Promise<{ valid: boolean; error?: string }> {
  const voucher = await prisma.voucher.findUnique({
    where: { code },
  });

  if (!voucher) {
    return { valid: false, error: 'Voucher code not found' };
  }

  // Check expiry
  if (voucher.validUntil < new Date()) {
    return { valid: false, error: 'Voucher has expired' };
  }

  // Check max uses
  if (voucher.currentUses >= voucher.maxUses) {
    return { valid: false, error: 'Voucher has reached maximum uses' };
  }

  // Increment usage
  await prisma.voucher.update({
    where: { code },
    data: { currentUses: { increment: 1 } },
  });

  return { valid: true };
}

/**
 * POST /api/test/submit
 * Submit test answers and create test result
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const data = submitSchema.parse(body);

    // Validate voucher if provided
    let isPaid = false;
    if (data.voucher) {
      const voucherResult = await validateVoucher(data.voucher);
      if (!voucherResult.valid) {
        return NextResponse.json(
          { error: voucherResult.error },
          { status: 402 }
        );
      }
      isPaid = true; // Voucher grants paid access
    }

    // Calculate Big Five scores
    const scores = calculateBigFiveScores(data.answers);

    // Generate unique test ID
    const testId = generateTestId();

    // Create test result in database
    const testResult = await prisma.testResult.create({
      data: {
        testId,
        scores: scores as any,
        rawAnswers: data.answers as any,
        userDetails: data.userDetails as any,
        email: data.email,
        paid: isPaid,
        voucher: data.voucher || null,
        completedAt: new Date(),
      },
    });

    // Calculate interpretations
    const interpretations = {
      O: interpretScore(scores.O as number),
      C: interpretScore(scores.C as number),
      E: interpretScore(scores.E as number),
      A: interpretScore(scores.A as number),
      N: interpretScore(scores.N as number),
    };

    // Send email with results link (async, don't wait)
    // TODO: Implement email service
    // sendTestCompleteEmail(data.email, testId).catch(console.error);

    // Return success response
    return NextResponse.json({
      success: true,
      testId,
      scores,
      interpretations,
      reportUrl: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/report/${testId}`,
      paid: isPaid,
    });
  } catch (error) {
    console.error('Test submission error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation error',
          details: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Interpret score level
 */
function interpretScore(score: number): 'low' | 'average' | 'high' {
  if (score < 60) return 'low';
  if (score > 90) return 'high';
  return 'average';
}

/**
 * GET /api/test/submit
 * Method not allowed
 */
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
