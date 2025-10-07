/**
 * Regenerate AI Report API
 * Manually trigger AI report generation for a test
 * @route POST /api/reports/[testId]/regenerate
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generatePersonalityReport } from '@/services/openai';

export async function POST(
  request: NextRequest,
  { params }: { params: { testId: string } }
) {
  try {
    const testId = params.testId;

    // Get test result
    const testResult = await prisma.testResult.findUnique({
      where: { testId },
    });

    if (!testResult) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }

    const scores = testResult.scores as any;
    const userDetails = testResult.userDetails as any;

    // Check if AI API key is configured
    if (!process.env.GEMINI_API_KEY && !process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'No AI API key configured' },
        { status: 503 }
      );
    }

    // Generate AI report
    const reportHtml = await generatePersonalityReport(scores, userDetails);

    // Save report to database
    await prisma.testResult.update({
      where: { testId },
      data: {
        reportHtml,
        reportGeneratedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'AI report generated successfully',
    });
  } catch (error) {
    console.error('Report regeneration error:', error);
    return NextResponse.json(
      { error: 'Failed to generate report', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
