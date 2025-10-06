#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('\n📊 NOBA EXPERTS - Project Status\n');
console.log('═'.repeat(50) + '\n');

// Load context
const contextPath = '.ai/context.json';
if (!fs.existsSync(contextPath)) {
  console.error('❌ Context file not found. Run npm run ai:verify first.');
  process.exit(1);
}

const context = JSON.parse(fs.readFileSync(contextPath, 'utf8'));

// Project Info
console.log('📋 Project Information:');
console.log(`  Name: ${context.projectName}`);
console.log(`  Type: ${context.projectType}`);
console.log(`  Language: ${context.language}`);
console.log(`  Created: ${context.created}`);
console.log(`  Last Updated: ${context.lastUpdated}`);
console.log('');

// Stage
console.log('🎯 Current Stage:');
console.log(`  Current: ${context.stage.current}`);
console.log(`  Next: ${context.stage.next}`);
console.log(`  Progression: ${context.stage.progression.join(' → ')}`);
console.log('');

// Stack
console.log('🛠️  Tech Stack:');
Object.entries(context.stack).forEach(([key, value]) => {
  if (value) {
    console.log(`  ${key}: ${value}`);
  }
});
console.log('');

// Features
console.log('✅ Features:');
console.log(`  Implemented: ${context.features.implemented.length}`);
context.features.implemented.forEach(f => console.log(`    • ${f}`));
console.log(`  In Progress: ${context.features.inProgress.length}`);
context.features.inProgress.forEach(f => console.log(`    • ${f}`));
console.log(`  Planned: ${context.features.planned.length}`);
console.log('');

// Metrics
console.log('📈 Metrics:');
console.log(`  Files: ${context.metrics.files}`);
console.log(`  Tests: ${context.metrics.tests}`);
console.log(`  Coverage: ${context.metrics.coverage}%`);
console.log(`  TODOs: ${context.metrics.todos}`);
console.log('');

// Requirements
console.log('📖 Requirements:');
console.log(`  Source: ${context.requirements.source}`);
console.log(`  User Stories: ${context.requirements.userStories}`);
console.log(`  NFRs: ${context.requirements.nfrCount}`);
console.log(`  Phases: ${context.requirements.phases}`);
console.log(`  Timeline: ${context.requirements.totalWeeks} weeks`);
console.log('');

// Next Steps
console.log('🚀 Next Steps:');
context.nextSteps.forEach((step, i) => {
  console.log(`  ${i + 1}. ${step}`);
});
console.log('');

// Check for blockers
const blockersPath = '.ai/blockers.md';
if (fs.existsSync(blockersPath)) {
  const blockers = fs.readFileSync(blockersPath, 'utf8');
  const currentBlockers = blockers.match(/## Current Blockers\n\n([^#]*)/);
  if (currentBlockers && !currentBlockers[1].includes('*No blockers yet')) {
    console.log('⚠️  Active Blockers:');
    console.log('  Check .ai/blockers.md for details');
    console.log('');
  }
}

console.log('═'.repeat(50));
console.log('\nFor more details:');
console.log('  • Features: cat FEATURES.md');
console.log('  • Decisions: cat .ai/decisions.log');
console.log('  • Blockers: cat .ai/blockers.md');
console.log('  • Next: npm run ai:next\n');
