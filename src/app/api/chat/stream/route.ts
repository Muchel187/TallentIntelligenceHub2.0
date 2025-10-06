import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { generateStreamingChatResponse } from '@/services/openai';

const chatRequestSchema = z.object({
  testId: z.string(),
  message: z.string().min(1).max(2000),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = chatRequestSchema.parse(body);

    // Get test result with all required data
    const testResult = await prisma.testResult.findUnique({
      where: { testId: data.testId },
    });

    if (!testResult) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }

    if (!testResult.paid) {
      return NextResponse.json(
        { error: 'Payment required to access AI coach' },
        { status: 403 }
      );
    }

    // Check access expiry (7 days from completion)
    const paymentDate = testResult.completedAt;
    const expiryDate = new Date(paymentDate);
    expiryDate.setDate(expiryDate.getDate() + 7);

    if (new Date() > expiryDate) {
      return NextResponse.json(
        { error: 'AI coach access has expired (7-day limit)' },
        { status: 403 }
      );
    }

    // Get chat history
    const chatHistory = await prisma.chatHistory.findMany({
      where: { testId: data.testId },
      orderBy: { timestamp: 'asc' },
      take: 10, // Last 10 messages
    });

    // Check message limit (50 messages per test)
    const userMessageCount = chatHistory.filter((m) => m.role === 'user').length;
    if (userMessageCount >= 50) {
      return NextResponse.json(
        { error: 'Message limit reached (50 messages per test)' },
        { status: 429 }
      );
    }

    const scores = testResult.scores as any;
    const userDetails = testResult.userDetails as any;

    // Generate streaming response
    const stream = await generateStreamingChatResponse(
      data.message,
      scores,
      userDetails,
      chatHistory.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      }))
    );

    // Store user message
    await prisma.chatHistory.create({
      data: {
        testId: data.testId,
        role: 'user',
        content: data.message,
      },
    });

    // Accumulate response for storage
    let fullResponse = '';
    const transformStream = new TransformStream({
      transform(chunk, controller) {
        const text = new TextDecoder().decode(chunk);
        fullResponse += text;
        controller.enqueue(chunk);
      },
      flush: async () => {
        // Store assistant response after streaming completes
        await prisma.chatHistory.create({
          data: {
            testId: data.testId,
            role: 'assistant',
            content: fullResponse,
          },
        });
      },
    });

    return new Response(stream.pipeThrough(transformStream), {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Chat stream error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
