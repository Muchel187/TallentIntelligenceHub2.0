# NOBA EXPERTS - Technical Documentation

## Architecture Overview

NOBA EXPERTS is built as a modern, full-stack TypeScript application following a monorepo architecture with clear separation of concerns.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Client Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Web App    │  │  Mobile App  │  │   Admin UI   │  │
│  │  (Next.js)   │  │ (React Native)│  │  (Next.js)   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   API Layer (Next.js)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Test API     │  │ Company API  │  │  Auth API    │  │
│  │ /api/test    │  │ /api/company │  │ /api/auth    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  Service Layer                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │Big Five Scorer│  │   AI Coach   │  │ PDF Generator│  │
│  │  Email Sender │  │Analytics Calc│  │  Integrations│  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   Data Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  PostgreSQL  │  │    Redis     │  │   S3/R2      │  │
│  │   (Prisma)   │  │  (Caching)   │  │   (PDFs)     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts / Chart.js
- **State**: Zustand (lightweight) or React Query (server state)

### Backend
- **Runtime**: Node.js 20
- **Framework**: Next.js API Routes
- **Database ORM**: Prisma
- **Authentication**: NextAuth.js v5
- **Password Hashing**: Argon2
- **Validation**: Zod

### Database
- **Primary**: PostgreSQL 15
- **Cache**: Redis 7
- **Features Used**:
  - JSONB for flexible data (scores, userDetails)
  - Full-text search
  - Row-level security (multi-tenancy)
  - Transactions
  - Indexes on frequently queried fields

### External Services
- **AI**: OpenAI GPT-4 Turbo
- **Payments**: Stripe
- **Email**: Resend + React Email
- **PDF**: Puppeteer
- **Storage**: AWS S3 / Cloudflare R2
- **Monitoring**: Sentry + Datadog

### Testing
- **Unit**: Vitest
- **Integration**: Vitest
- **E2E**: Playwright
- **Coverage**: Vitest with v8

## Database Schema

### Entity Relationship Overview

```
Users (NextAuth)
├── Accounts (OAuth)
├── Sessions
├── UserTestLinks → TestResults
└── TestProgress

TestResults (B2C)
├── ChatHistory
├── ChatAccess
└── EmployeeTests

Companies (B2B)
├── CompanyAdmins → Users
├── Departments
├── Employees → EmployeeTests → TestResults
├── Objectives
├── MoodSurveys
├── DevelopmentPlans
├── TeamAnalytics
├── Integrations
│   ├── Webhooks
│   └── IntegrationLogs
└── EmployeeInvitations

Vouchers (Admin)
```

### Key Design Decisions

1. **JSONB for Flexibility**: Scores and userDetails stored as JSON to allow schema evolution
2. **Composite Indexes**: Multi-column indexes for common query patterns
3. **Soft Deletes**: Most deletions cascade, but important data preserved
4. **Audit Trail**: Timestamps on all entities
5. **Multi-tenancy**: Company isolation via companyId foreign keys

## API Design

### REST Conventions

All APIs follow RESTful conventions:

```
GET    /api/resource       # List
GET    /api/resource/:id   # Read
POST   /api/resource       # Create
PUT    /api/resource/:id   # Update (full)
PATCH  /api/resource/:id   # Update (partial)
DELETE /api/resource/:id   # Delete
```

### Response Format

```typescript
// Success
{
  "success": true,
  "data": { ... }
}

// Error
{
  "success": false,
  "error": "Error message",
  "details": { ... } // Optional
}
```

### Authentication

All protected routes use NextAuth.js middleware:

```typescript
import { auth } from '@/lib/auth';

export async function GET() {
  const session = await auth();
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // ... protected logic
}
```

## Core Business Logic

### Big Five Scoring Algorithm

```typescript
// Location: src/core/big-five-scorer.ts

interface Answer {
  questionId: number;
  score: number; // 1-5 Likert scale
}

interface QuestionConfig {
  id: number;
  dimension: 'O' | 'C' | 'E' | 'A' | 'N';
  keyed: 'plus' | 'minus'; // Reverse scoring
}

function calculateDimensionScore(
  answers: Answer[],
  dimension: 'O' | 'C' | 'E' | 'A' | 'N',
  config: QuestionConfig[]
): number {
  const questions = config.filter(q => q.dimension === dimension);

  let total = 0;
  for (const q of questions) {
    const answer = answers.find(a => a.questionId === q.id);
    if (!answer) continue;

    // Reverse scoring for 'minus' keyed questions
    const score = q.keyed === 'plus'
      ? answer.score
      : (6 - answer.score);

    total += score;
  }

  return total; // Range: 24-120 per dimension
}
```

### Team Compatibility Algorithm

```typescript
// Location: src/core/compatibility.ts

function calculateCompatibility(
  person1: BigFiveScores,
  person2: BigFiveScores
): number {
  const weights = {
    A: 0.30, // Agreeableness most important
    C: 0.25, // Work style alignment
    E: 0.20,
    N: 0.15,
    O: 0.10
  };

  const diffs = {
    O: Math.abs(person1.O - person2.O),
    C: Math.abs(person1.C - person2.C),
    E: Math.abs(person1.E - person2.E),
    A: Math.abs(person1.A - person2.A),
    N: Math.abs(person1.N - person2.N)
  };

  const weightedDiff =
    diffs.A * weights.A +
    diffs.C * weights.C +
    diffs.E * weights.E +
    diffs.N * weights.N +
    diffs.O * weights.O;

  // Normalize to 0-100% (lower diff = higher compatibility)
  return Math.round(100 - (weightedDiff / 120 * 100));
}
```

### Retention Risk Calculator

```typescript
// Location: src/core/retention-risk.ts

function calculateRetentionRisk(
  employee: Employee,
  scores: BigFiveScores,
  moodHistory: MoodSurvey[],
  devPlan: DevelopmentPlan | null
): { level: 'low' | 'medium' | 'high'; factors: string[] } {
  let riskScore = 0;
  const factors = [];

  // High Neuroticism = stress prone
  if (scores.N > 90) {
    riskScore += 30;
    factors.push('High stress levels');
  }

  // Low Conscientiousness = potential job mismatch
  if (scores.C < 60) {
    riskScore += 20;
    factors.push('Low job engagement signals');
  }

  // Negative mood trends
  const recentMoods = moodHistory.slice(-3);
  const avgMood = recentMoods.reduce((s, m) => s + m.moodScore, 0) / 3;
  if (avgMood < 5) {
    riskScore += 25;
    factors.push('Declining mood scores');
  }

  // No development plan
  if (!devPlan) {
    riskScore += 15;
    factors.push('No career development plan');
  }

  const level = riskScore < 30 ? 'low' : riskScore < 60 ? 'medium' : 'high';
  return { level, factors };
}
```

## Security

### Password Hashing

```typescript
import argon2 from 'argon2';

// Hash password
const hash = await argon2.hash(password, {
  type: argon2.argon2id,
  memoryCost: 65536, // 64 MB
  timeCost: 3,
  parallelism: 4
});

// Verify password
const valid = await argon2.verify(hash, password);
```

### Encryption (for API credentials)

```typescript
import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const key = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');

function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

function decrypt(encrypted: string): string {
  const parts = encrypted.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encryptedText = parts[1];
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
```

### SQL Injection Prevention

Prisma automatically uses parameterized queries:

```typescript
// Safe - Prisma handles escaping
const user = await prisma.user.findUnique({
  where: { email: userInput }
});

// Avoid raw queries unless necessary
const result = await prisma.$queryRaw`
  SELECT * FROM users WHERE email = ${userInput}
`;
```

### XSS Prevention

- All user inputs sanitized
- Content-Security-Policy headers set
- React automatically escapes JSX
- DOMPurify for HTML content

## Performance Optimizations

### Database

1. **Indexes**: All foreign keys and frequently queried fields indexed
2. **Connection Pooling**: Prisma connection pool (10-100 connections)
3. **Read Replicas**: For reporting queries (production)
4. **Query Optimization**: Use `select` to fetch only needed fields

### Caching Strategy

```typescript
// Redis caching for reports
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

async function getCachedReport(testId: string) {
  const cached = await redis.get(`report:${testId}`);
  if (cached) return JSON.parse(cached);

  const report = await generateReport(testId);
  await redis.setex(`report:${testId}`, 86400, JSON.stringify(report)); // 24h TTL
  return report;
}
```

### Frontend

1. **Code Splitting**: Dynamic imports for heavy components
2. **Image Optimization**: Next.js Image component
3. **Static Generation**: ISR for marketing pages
4. **Bundle Analysis**: `npm run analyze`

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Environment variables set via Vercel dashboard
```

### Docker (Alternative)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Monitoring

### Sentry (Error Tracking)

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV
});
```

### Logging

```typescript
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: { colorize: true }
  }
});

logger.info({ userId: 123 }, 'User logged in');
logger.error({ err }, 'Payment failed');
```

## Development Workflow

1. **Feature Branch**: Create from `main`
2. **Tests**: Write tests first (TDD)
3. **Implementation**: Follow patterns in `.ai/patterns.md`
4. **Type Check**: `npm run typecheck`
5. **Lint**: `npm run lint:fix`
6. **Test**: `npm run test`
7. **PR**: Create pull request
8. **Review**: Code review required
9. **Merge**: Squash and merge to `main`
10. **Deploy**: Auto-deploy to staging

## Scaling Considerations

### Horizontal Scaling

- Stateless API design (no session affinity)
- Load balancer with round-robin
- Database connection pooling
- Redis for shared state

### Database Scaling

- Read replicas for analytics
- Sharding by `companyId` (future)
- Partitioning for large tables

### Cost Optimization

- Cache aggressively (Redis)
- Use edge functions where possible
- Optimize images
- Monitor API usage (OpenAI)

---

For implementation details, see `.ai/patterns.md` and `ANFORDERUNGSANALYSE_NEUENTWICKLUNG.md`.
