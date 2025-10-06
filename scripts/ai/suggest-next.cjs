#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('\n🤔 NOBA EXPERTS - Next Steps Suggestion\n');
console.log('═'.repeat(50) + '\n');

const context = JSON.parse(fs.readFileSync('.ai/context.json', 'utf8'));

console.log('📍 Current stage:', context.stage.current);
console.log('');

const suggestions = {
  'skeleton': {
    title: '🏗️  Skeleton Phase - Foundation Setup',
    steps: [
      'Initialize Next.js 14 with TypeScript',
      'Set up package.json with all scripts',
      'Configure Tailwind CSS',
      'Set up Prisma with PostgreSQL',
      'Create initial database schema',
      'Set up NextAuth.js',
      'Create first smoke tests'
    ],
    commands: [
      '# Initialize Next.js',
      'npx create-next-app@latest . --typescript --tailwind --app --no-src',
      '',
      '# Install core dependencies',
      'npm install @prisma/client next-auth@beta zod',
      'npm install -D prisma vitest @testing-library/react',
      '',
      '# Initialize Prisma',
      'npx prisma init',
      '',
      '# Run verification',
      'npm run ai:verify'
    ]
  },
  'prototype': {
    title: '🚀 Prototype Phase - Core Features',
    steps: [
      'Implement Big Five test UI (119 questions)',
      'Create scoring algorithm',
      'Build result display page',
      'Add authentication flow',
      'Set up database migrations',
      'Add basic tests for core logic'
    ],
    commands: [
      'npm run dev              # Start development',
      'npm run db:migrate:dev   # Create migrations',
      'npm run test             # Run tests'
    ]
  },
  'mvp': {
    title: '🎯 MVP Phase - Complete Feature Set',
    steps: [
      'Integrate OpenAI for AI coach',
      'Add PDF generation',
      'Implement Stripe payments',
      'Build company dashboard',
      'Add comprehensive tests',
      'Set up CI/CD pipeline'
    ],
    commands: [
      'npm run test:coverage   # Check test coverage',
      'npm run build           # Build for production',
      'npm run preview         # Test production build'
    ]
  },
  'production': {
    title: '🌟 Production Phase - Polish & Launch',
    steps: [
      'Performance optimization',
      'Security audit',
      'Data migration from old system',
      'Beta testing',
      'Production deployment'
    ],
    commands: [
      'npm run analyze         # Analyze bundle',
      'npm run lighthouse      # Performance audit'
    ]
  }
};

const currentSuggestion = suggestions[context.stage.current];

if (currentSuggestion) {
  console.log(currentSuggestion.title);
  console.log('');
  console.log('📝 Recommended steps:');
  currentSuggestion.steps.forEach((step, i) => {
    console.log(`  ${i + 1}. ${step}`);
  });
  console.log('');

  if (currentSuggestion.commands.length > 0) {
    console.log('💻 Commands to run:');
    console.log('');
    currentSuggestion.commands.forEach(cmd => {
      console.log(`  ${cmd}`);
    });
    console.log('');
  }
}

// Phase-specific suggestions
if (context.stage.current === 'skeleton') {
  console.log('🎯 Priority Focus:');
  console.log('  1. Get Next.js running first');
  console.log('  2. Set up database connection');
  console.log('  3. Create first API endpoint');
  console.log('  4. Write first test');
  console.log('');

  console.log('📚 Key Files to Create:');
  console.log('  • package.json - Dependencies');
  console.log('  • prisma/schema.prisma - Database schema');
  console.log('  • src/app/page.tsx - Landing page');
  console.log('  • src/core/big-five-scorer.ts - Scoring logic');
  console.log('  • test/smoke/basic.test.ts - First test');
  console.log('');
}

console.log('📖 Documentation:');
console.log('  • Requirements: ANFORDERUNGSANALYSE_NEUENTWICKLUNG.md');
console.log('  • Features: FEATURES.md');
console.log('  • Commands: COMMANDS.md');
console.log('  • Patterns: .ai/patterns.md');
console.log('');

console.log('═'.repeat(50));
console.log('\n💡 Tip: After completing a step, update .ai/context.json');
console.log('and run npm run ai:status to track progress.\n');
