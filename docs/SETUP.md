# NOBA EXPERTS - Setup Guide

## Prerequisites

- Node.js 20+ installed
- PostgreSQL 15+ installed and running
- npm 10+ installed
- Git installed

## Quick Setup

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# 3. Generate Prisma Client
npm run db:generate

# 4. Run database migrations (requires PostgreSQL running)
npm run db:migrate:dev

# 5. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

### Required Variables

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/noba_db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="<generate with: openssl rand -base64 32>"

# OAuth (get from Google Cloud Console)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### Optional (for production features)

```bash
# OpenAI (for AI Chat)
OPENAI_API_KEY="sk-..."

# Stripe (for payments)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Resend (for emails)
RESEND_API_KEY="re_..."

# AWS S3 (for PDF storage)
S3_BUCKET_NAME="noba-reports"
S3_ACCESS_KEY="..."
S3_SECRET_KEY="..."
```

## Database Setup

### Local PostgreSQL

```bash
# Install PostgreSQL (Ubuntu/Debian)
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL
sudo systemctl start postgresql

# Create database and user
sudo -u postgres psql
CREATE DATABASE noba_db;
CREATE USER noba_user WITH ENCRYPTED PASSWORD 'your-password';
GRANT ALL PRIVILEGES ON DATABASE noba_db TO noba_user;
\q
```

### Using Docker

```bash
# Start PostgreSQL in Docker
docker run --name noba-postgres \
  -e POSTGRES_DB=noba_db \
  -e POSTGRES_USER=noba_user \
  -e POSTGRES_PASSWORD=your-password \
  -p 5432:5432 \
  -d postgres:15
```

### Prisma Commands

```bash
# Generate Prisma Client (after schema changes)
npm run db:generate

# Create and apply migrations (development)
npm run db:migrate:dev

# Apply migrations (production)
npm run db:migrate

# Push schema without migration
npm run db:push

# Open Prisma Studio (GUI for database)
npm run db:studio

# Seed database with test data
npm run db:seed

# Reset database (DANGER - deletes all data)
npm run db:reset
```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure consent screen
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://your-domain.com/api/auth/callback/google` (production)
7. Copy Client ID and Client Secret to `.env`

## Stripe Setup (for payments)

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Get your API keys from Developers → API keys
3. Set up webhook endpoint: `/api/webhooks/stripe`
4. Add webhook events:
   - `checkout.session.completed`
   - `invoice.paid`
   - `invoice.payment_failed`
5. Copy webhook signing secret to `.env`

## Development Workflow

```bash
# Start development server
npm run dev

# Run in watch mode (tests)
npm run test:watch

# Type checking
npm run typecheck

# Linting
npm run lint

# Format code
npm run format
```

## Testing

```bash
# Run all tests
npm run test

# Smoke tests only (fast)
npm run test:smoke

# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests (requires dev server running)
npm run test:e2e

# Coverage report
npm run test:coverage
```

## Build & Deployment

```bash
# Build for production
npm run build

# Start production server
npm run start

# Preview production build
npm run preview

# Analyze bundle size
npm run analyze
```

## AI Development Tools

```bash
# Verify environment setup
npm run ai:verify

# Show project status
npm run ai:status

# Get next step suggestions
npm run ai:next
```

## Troubleshooting

### Prisma Client errors

**Problem**: `@prisma/client did not initialize yet`

**Solution**:
```bash
npm run db:generate
```

### Database connection fails

**Problem**: Cannot connect to PostgreSQL

**Solution**:
1. Check PostgreSQL is running: `sudo systemctl status postgresql`
2. Verify DATABASE_URL in `.env`
3. Test connection: `psql $DATABASE_URL`

### NextAuth errors

**Problem**: NEXTAUTH_SECRET missing

**Solution**:
```bash
# Generate secret
openssl rand -base64 32

# Add to .env
NEXTAUTH_SECRET="generated-secret-here"
```

### Port already in use

**Problem**: Port 3000 already in use

**Solution**:
```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

## Project Structure

```
TallentIntelligenceHub2.0/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   ├── core/            # Business logic (Big Five scoring)
│   ├── services/        # Services (AI, Email, PDF)
│   ├── lib/             # Libraries (auth, db)
│   ├── utils/           # Utility functions
│   └── types/           # TypeScript types
├── prisma/
│   └── schema.prisma    # Database schema (23 entities)
├── test/
│   ├── smoke/           # Quick verification tests
│   ├── unit/            # Unit tests
│   ├── integration/     # Integration tests
│   └── e2e/             # End-to-end tests
└── public/              # Static assets & PWA manifest
```

## Next Steps

After setup:

1. Read `CLAUDE.md` for development guidelines
2. Check `FEATURES.md` for roadmap
3. Review `ANFORDERUNGSANALYSE_NEUENTWICKLUNG.md` for requirements
4. Run `npm run ai:next` for next steps
5. Start implementing Phase 1 features

## Support

- Technical Documentation: `docs/TECHNICAL.md`
- Troubleshooting: `TROUBLESHOOTING.md`
- Feature Tracking: `FEATURES.md`
- Code Patterns: `.ai/patterns.md`

---

*For detailed requirements, see `ANFORDERUNGSANALYSE_NEUENTWICKLUNG.md`*
