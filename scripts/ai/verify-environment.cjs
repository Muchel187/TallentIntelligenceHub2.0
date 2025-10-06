#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying NOBA EXPERTS Development Environment...\n');

const checks = [
  { file: 'CLAUDE.md', desc: 'AI guide' },
  { file: 'COMMANDS.md', desc: 'Commands reference' },
  { file: 'TESTING.md', desc: 'Test strategy' },
  { file: 'FEATURES.md', desc: 'Feature tracking' },
  { file: 'TROUBLESHOOTING.md', desc: 'Troubleshooting guide' },
  { file: '.ai/context.json', desc: 'AI context' },
  { file: '.ai/patterns.md', desc: 'Code patterns' },
  { file: '.ai/decisions.log', desc: 'Technical decisions' },
  { file: 'package.json', desc: 'Package config' },
  { file: '.gitignore', desc: 'Git ignore rules' },
];

const directories = [
  'src/core',
  'src/services',
  'src/api',
  'src/utils',
  'src/types',
  'test/unit',
  'test/integration',
  'test/e2e',
  'test/smoke',
  'database/migrations',
  'scripts/ai',
  '.ai'
];

let passed = 0;
let total = checks.length + directories.length;

console.log('📄 Checking files...');
checks.forEach(({ file, desc }) => {
  if (fs.existsSync(file)) {
    console.log(`  ✅ ${desc} (${file})`);
    passed++;
  } else {
    console.log(`  ❌ Missing: ${file}`);
  }
});

console.log('\n📁 Checking directories...');
directories.forEach((dir) => {
  if (fs.existsSync(dir)) {
    console.log(`  ✅ ${dir}`);
    passed++;
  } else {
    console.log(`  ❌ Missing: ${dir}`);
  }
});

// Check CLAUDE.md is lean (< 50 lines)
console.log('\n📏 Checking CLAUDE.md length...');
if (fs.existsSync('CLAUDE.md')) {
  const content = fs.readFileSync('CLAUDE.md', 'utf8');
  const lines = content.split('\n').length;
  if (lines < 50) {
    console.log(`  ✅ CLAUDE.md is lean (${lines} lines)`);
  } else {
    console.log(`  ⚠️  CLAUDE.md is too long (${lines} lines, should be < 50)`);
  }
}

console.log(`\n📊 Result: ${passed}/${total} checks passed`);

if (passed === total) {
  console.log('\n✨ Environment is ready!\n');
  console.log('Next steps:');
  console.log('  • npm install');
  console.log('  • npm run ai:status');
  console.log('  • npm run ai:next\n');
  process.exit(0);
} else {
  console.log('\n⚠️  Some checks failed. Please fix before continuing.\n');
  process.exit(1);
}
