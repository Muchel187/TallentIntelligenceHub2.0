# Code Patterns - NOBA EXPERTS

## Progressive Enhancement
Start simple, add complexity only when needed:

### Level 1: Make it work
```typescript
function calculateBigFiveScore(answers: Answer[]): number {
  return answers.reduce((sum, answer) => sum + answer.score, 0);
}
```

### Level 2: Make it right
```typescript
interface Answer {
  questionId: number;
  score: number; // 1-5 Likert scale
}

interface QuestionConfig {
  id: number;
  dimension: 'O' | 'C' | 'E' | 'A' | 'N';
  keyed: 'plus' | 'minus';
}

function calculateDimensionScore(
  answers: Answer[],
  dimension: 'O' | 'C' | 'E' | 'A' | 'N',
  questionConfig: QuestionConfig[]
): number {
  const dimensionQuestions = questionConfig.filter(q => q.dimension === dimension);

  let total = 0;
  for (const question of dimensionQuestions) {
    const answer = answers.find(a => a.questionId === question.id);
    if (!answer) continue;

    const score = question.keyed === 'plus'
      ? answer.score
      : (6 - answer.score);

    total += score;
  }

  return total; // Range: 24-120
}
```

### Level 3: Make it scale (with caching)
```typescript
class BigFiveScorer {
  private cache = new Map<string, BigFiveScores>();

  calculate(answers: Answer[]): BigFiveScores {
    const key = this.getCacheKey(answers);
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }

    const scores = {
      O: this.calculateDimension(answers, 'O'),
      C: this.calculateDimension(answers, 'C'),
      E: this.calculateDimension(answers, 'E'),
      A: this.calculateDimension(answers, 'A'),
      N: this.calculateDimension(answers, 'N'),
    };

    this.cache.set(key, scores);
    return scores;
  }
}
```

## Service Pattern

### Start with functions
```typescript
// src/services/test-service.ts
export async function submitTest(data: TestSubmission) {
  const scores = calculateScores(data.answers);
  const testId = generateTestId();

  await db.testResult.create({
    data: {
      testId,
      scores,
      rawAnswers: data.answers,
      userDetails: data.userDetails,
      email: data.email,
    }
  });

  return { testId, scores };
}
```

### Evolve to classes when needed
```typescript
// src/services/test-service.ts
export class TestService {
  constructor(
    private db: PrismaClient,
    private scorer: BigFiveScorer,
    private emailService: EmailService
  ) {}

  async submitTest(data: TestSubmission): Promise<TestResult> {
    const scores = this.scorer.calculate(data.answers);
    const testId = this.generateTestId();

    const result = await this.db.testResult.create({
      data: { testId, scores, rawAnswers: data.answers, email: data.email }
    });

    await this.emailService.sendTestComplete(data.email, testId);

    return { testId, scores };
  }
}
```

## Error Handling

```typescript
// src/types/result.ts
export interface Result<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export function success<T>(data: T): Result<T> {
  return { success: true, data };
}

export function failure(error: string): Result<never> {
  return { success: false, error };
}

// Usage in API route
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await submitTest(body);
    return Response.json(success(result));
  } catch (error) {
    return Response.json(
      failure(error instanceof Error ? error.message : 'Unknown error'),
      { status: 500 }
    );
  }
}
```

## Database Patterns (Prisma)

### Basic CRUD
```typescript
// Create
const user = await prisma.user.create({
  data: { email, name, password: hashedPassword }
});

// Read
const testResult = await prisma.testResult.findUnique({
  where: { testId },
  include: { chatHistory: true }
});

// Update
await prisma.testResult.update({
  where: { testId },
  data: { paid: true }
});

// Delete
await prisma.user.delete({ where: { id: userId } });
```

### Transactions
```typescript
await prisma.$transaction(async (tx) => {
  const employee = await tx.employee.create({ data: employeeData });
  await tx.employeeInvitation.create({
    data: { email: employee.email, token: generateToken() }
  });
  await tx.integrationLog.create({
    data: { action: 'employee.added', details: { employeeId: employee.id } }
  });
});
```

## Authentication Pattern (NextAuth)

```typescript
// src/lib/auth.ts
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        // Verify credentials
        const user = await verifyCredentials(credentials);
        return user;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub!;
      return session;
    },
  },
});
```

## API Route Pattern

```typescript
// src/app/api/test/submit/route.ts
import { NextRequest } from 'next/server';
import { z } from 'zod';

const submitSchema = z.object({
  answers: z.array(z.object({
    questionId: z.number(),
    score: z.number().min(1).max(5)
  })),
  userDetails: z.object({
    age: z.number(),
    currentJob: z.string(),
    industry: z.string(),
    careerGoal: z.string()
  }),
  email: z.string().email(),
  voucher: z.string().optional()
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = submitSchema.parse(body);

    // Validate voucher if provided
    if (data.voucher) {
      const voucherValid = await validateVoucher(data.voucher);
      if (!voucherValid.valid) {
        return Response.json(
          { error: voucherValid.error },
          { status: 402 }
        );
      }
    }

    const result = await submitTest(data);
    return Response.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: 'Validation error', details: error.errors }, { status: 400 });
    }
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

## Mobile-First CSS (Tailwind)

```tsx
// Mobile first approach
<div className="
  w-full px-4 py-8           /* Mobile: full width, padding */
  md:max-w-2xl md:mx-auto   /* Tablet: constrained width, centered */
  lg:max-w-4xl lg:px-8      /* Desktop: wider, more padding */
">
  <h1 className="
    text-2xl font-bold       /* Mobile: 24px */
    md:text-3xl              /* Tablet: 30px */
    lg:text-4xl              /* Desktop: 36px */
  ">
    Big Five Personality Test
  </h1>
</div>
```

## React Component Pattern

```tsx
// src/components/test/QuestionCard.tsx
'use client';

import { useState } from 'react';

interface QuestionCardProps {
  question: string;
  questionId: number;
  onAnswer: (questionId: number, score: number) => void;
}

export function QuestionCard({ question, questionId, onAnswer }: QuestionCardProps) {
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (score: number) => {
    setSelected(score);
    onAnswer(questionId, score);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-lg mb-4">{question}</p>
      <div className="flex justify-between gap-2">
        {[1, 2, 3, 4, 5].map((score) => (
          <button
            key={score}
            onClick={() => handleSelect(score)}
            className={`
              px-4 py-2 rounded-lg border-2 transition
              ${selected === score
                ? 'bg-blue-500 text-white border-blue-500'
                : 'border-gray-300 hover:border-blue-300'
              }
            `}
          >
            {score}
          </button>
        ))}
      </div>
    </div>
  );
}
```

## Testing Patterns

### Unit Test (Vitest)
```typescript
// test/unit/big-five-scorer.test.ts
import { describe, it, expect } from 'vitest';
import { calculateDimensionScore } from '@/core/big-five-scorer';

describe('Big Five Scorer', () => {
  it('should calculate Openness score correctly', () => {
    const answers = [
      { questionId: 1, score: 5 }, // plus question
      { questionId: 2, score: 1 }, // minus question (reversed)
    ];

    const score = calculateDimensionScore(answers, 'O', questionConfig);
    expect(score).toBe(10); // 5 + (6-1) = 10
  });

  it('should handle missing answers', () => {
    const answers = [{ questionId: 1, score: 5 }];
    const score = calculateDimensionScore(answers, 'O', questionConfig);
    expect(score).toBeGreaterThan(0);
  });
});
```

### Integration Test
```typescript
// test/integration/api/test-submit.test.ts
import { describe, it, expect } from 'vitest';
import { POST } from '@/app/api/test/submit/route';

describe('POST /api/test/submit', () => {
  it('should create test result and return testId', async () => {
    const request = new Request('http://localhost/api/test/submit', {
      method: 'POST',
      body: JSON.stringify({
        answers: mockAnswers,
        userDetails: mockUserDetails,
        email: 'test@example.com'
      })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('testId');
    expect(data).toHaveProperty('scores');
  });
});
```

---

*Patterns will evolve as the project grows. Keep this document updated with proven patterns.*
