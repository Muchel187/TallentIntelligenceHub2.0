# NOBA EXPERTS

Scientific Big Five Personality Assessment Platform with AI-powered coaching and comprehensive HR analytics.

## Quick Start

```bash
# Verify setup
npm run ai:verify

# Get project status
npm run ai:status

# Get next steps
npm run ai:next

# Install dependencies (after setup)
npm install

# Start development
npm run dev
```

## What is NOBA EXPERTS?

NOBA EXPERTS is a comprehensive personality assessment platform based on the scientifically validated Big Five model. It serves both individual users (B2C) seeking career development insights and companies (B2B) looking for data-driven HR analytics.

### Key Features

**For Individuals (B2C):**
- 119-question Big Five personality test
- Detailed personality report with career insights
- AI-powered career coaching chat
- Downloadable PDF reports
- Progress tracking across multiple tests

**For Companies (B2B):**
- Employee personality profiling
- Team compatibility analysis
- Retention risk prediction
- Performance analytics dashboards
- Integration with HR tools (Slack, Teams, Personio, JIRA)

## Documentation

- **AI Guide**: `CLAUDE.md` - Essential guide for AI-assisted development
- **Commands**: `COMMANDS.md` - All available npm scripts
- **Testing**: `TESTING.md` - Testing strategy and patterns
- **Features**: `FEATURES.md` - Feature roadmap and status
- **Troubleshooting**: `TROUBLESHOOTING.md` - Common issues and solutions
- **Requirements**: `ANFORDERUNGSANALYSE_NEUENTWICKLUNG.md` - Complete specification

## Project Structure

```
TallentIntelligenceHub2.0/
├── .ai/                    # AI context & decisions
├── src/                    # Source code
│   ├── app/               # Next.js pages (App Router)
│   ├── components/        # React components
│   ├── core/              # Business logic
│   ├── services/          # Services (AI, PDF, Email)
│   ├── api/               # API endpoints
│   └── lib/               # Libraries & utilities
├── test/                   # All tests
├── database/              # Prisma schema & migrations
├── public/                # Static assets
└── docs/                  # Technical documentation
```

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, NestJS patterns
- **Database**: PostgreSQL 15 + Prisma ORM
- **Auth**: NextAuth.js v5 (Google OAuth + Credentials)
- **AI**: OpenAI GPT-4 Turbo
- **Payments**: Stripe
- **Email**: Resend + React Email
- **PDF**: Puppeteer
- **Testing**: Vitest + Playwright
- **Deployment**: Vercel

## Development Workflow

### 1. Initial Setup
```bash
npm run ai:verify        # Verify environment
npm install             # Install dependencies
npm run db:generate     # Generate Prisma client
```

### 2. Development
```bash
npm run dev             # Start dev server
npm run db:studio       # Open Prisma Studio
npm run test:watch      # Run tests in watch mode
```

### 3. Before Committing
```bash
npm run lint            # Check code style
npm run typecheck       # Check TypeScript
npm run test            # Run all tests
```

## Project Phases

**Current Phase**: Phase 1 - Foundation (6 weeks)

1. ✅ **Skeleton** - Project structure and tooling
2. 🚧 **Prototype** - Core features (Big Five test, basic UI)
3. 📋 **MVP** - Complete B2C features
4. 📋 **Production** - B2B features & polish
5. 📋 **Scale** - Optimizations & advanced features

See `FEATURES.md` for detailed roadmap.

## Contributing

This is an AI-optimized project. When working on it:

1. Read `CLAUDE.md` for core principles
2. Check `.ai/patterns.md` for code patterns
3. Update `.ai/context.json` after major changes
4. Log decisions in `.ai/decisions.log`
5. Document blockers in `.ai/blockers.md`

## Requirements

Based on comprehensive requirements analysis:
- 49 User Stories
- 30 Non-functional Requirements
- 23 Database Entities
- 36-week development timeline

See `ANFORDERUNGSANALYSE_NEUENTWICKLUNG.md` for complete specification.

## License

Proprietary - NOBA EXPERTS

---

*This is an AI-optimized project. Run `npm run ai:next` for guidance on next steps.*
