# NOBA EXPERTS - Essential Guide

## Core Principles
1. **Check Before Creating** - Verify files/directories exist first
2. **Test First** - Write tests before implementation
3. **Single Source of Truth** - No duplication
4. **Iterate Incrementally** - Small, verified changes
5. **Mobile First** - Design for mobile, enhance for desktop
6. **Progressive Enhancement** - Start simple, add complexity when needed

## Project Structure
```
TallentIntelligenceHub2.0/
├── .ai/                    # AI context & decisions
├── src/                    # Source code
│   ├── app/               # Next.js app router
│   ├── components/        # React components
│   ├── core/              # Business logic (Big Five scoring)
│   ├── services/          # Service layer (AI, PDF, Email)
│   ├── api/               # API endpoints (NestJS style)
│   ├── lib/               # Libraries (auth, db, integrations)
│   ├── utils/             # Utilities
│   └── types/             # TypeScript types
├── test/                   # Test files
├── public/                 # Static assets & PWA
├── database/              # Prisma schema & migrations
├── scripts/               # AI & setup utilities
└── docs/                  # Technical documentation
```

## Quick Reference
- **Commands**: See `COMMANDS.md`
- **Testing**: See `TESTING.md`
- **Features**: See `FEATURES.md`
- **Troubleshooting**: See `TROUBLESHOOTING.md`
- **Technical Details**: See `docs/TECHNICAL.md`

## Current State
- **Type**: Web App (B2C + B2B SaaS)
- **Language**: TypeScript
- **Frontend**: Next.js 14 (App Router)
- **Backend**: Next.js API Routes + NestJS patterns
- **Database**: PostgreSQL + Prisma
- **Stage**: Skeleton → Prototype → MVP → Production
- **Next Steps**: Run `npm run ai:next`

---
*AI Context: `.ai/` | Patterns: `.ai/patterns.md` | Decisions: `.ai/decisions.log`*
