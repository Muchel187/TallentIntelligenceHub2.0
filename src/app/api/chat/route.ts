/**
 * Chat API
 * Handles AI career coaching conversations
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { generateChatResponse } from '@/services/openai';

const chatSchema = z.object({
  testId: z.string(),
  message: z.string().min(1).max(1000),
});

/**
 * Check if user has chat access
 */
async function checkChatAccess(testId: string, userEmail: string): Promise<boolean> {
  const testResult = await prisma.testResult.findUnique({
    where: { testId },
  });

  if (!testResult) return false;

  // Paid tests have chat access
  if (testResult.paid) {
    const chatAccess = await prisma.chatAccess.findUnique({
      where: {
        testId_email: {
          testId,
          email: userEmail,
        },
      },
    });

    if (!chatAccess) {
      // Create chat access (7 days)
      await prisma.chatAccess.create({
        data: {
          testId,
          email: userEmail,
          accessGrantedAt: new Date(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });
      return true;
    }

    // Check expiry
    return chatAccess.expiresAt > new Date();
  }

  return false;
}

/**
 * POST /api/chat
 * Send message and get AI response
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = chatSchema.parse(body);

    // Get test result
    const testResult = await prisma.testResult.findUnique({
      where: { testId: data.testId },
    });

    if (!testResult) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }

    // Check chat access
    const hasAccess = await checkChatAccess(data.testId, testResult.email);
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Chat access not available. Please upgrade to premium.' },
        { status: 403 }
      );
    }

    // Get chat history
    const history = await prisma.chatHistory.findMany({
      where: { testId: data.testId },
      orderBy: { timestamp: 'asc' },
      take: 50, // Max 50 messages
    });

    // Check message limit
    const userMessageCount = history.filter((m) => m.role === 'user').length;
    if (userMessageCount >= 50) {
      return NextResponse.json(
        { error: 'Message limit reached (50 messages maximum)' },
        { status: 429 }
      );
    }

    // Save user message
    await prisma.chatHistory.create({
      data: {
        testId: data.testId,
        role: 'user',
        content: data.message,
      },
    });

    // Generate AI response
    const scores = testResult.scores as any;
    const userDetails = testResult.userDetails as any;

    const aiResponse = await generateChatResponse(
      data.message,
      scores,
      userDetails,
      history.map((h) => ({ role: h.role as any, content: h.content }))
    );

    // Save assistant message
    await prisma.chatHistory.create({
      data: {
        testId: data.testId,
        role: 'assistant',
        content: aiResponse,
      },
    });

    return NextResponse.json({
      reply: aiResponse,
      messagesRemaining: 50 - userMessageCount - 1,
    });
  } catch (error) {
    console.error('Chat API error:', error);

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
 * GET /api/chat?testId=...
 * Get chat history
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const testId = searchParams.get('testId');

    if (!testId) {
      return NextResponse.json({ error: 'testId required' }, { status: 400 });
    }

    const history = await prisma.chatHistory.findMany({
      where: { testId },
      orderBy: { timestamp: 'asc' },
    });

    return NextResponse.json({
      messages: history.map((h) => ({
        role: h.role,
        content: h.content,
        timestamp: h.timestamp,
      })),
    });
  } catch (error) {
    console.error('Chat history error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
