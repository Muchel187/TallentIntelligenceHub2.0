import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Smoke Tests - Project Structure', () => {
  it('should have essential documentation files', () => {
    const files = [
      'CLAUDE.md',
      'COMMANDS.md',
      'TESTING.md',
      'FEATURES.md',
      'TROUBLESHOOTING.md',
      'README.md',
    ];

    files.forEach((file) => {
      expect(fs.existsSync(file), `${file} should exist`).toBe(true);
    });
  });

  it('should have .ai directory with required files', () => {
    const aiFiles = [
      '.ai/context.json',
      '.ai/patterns.md',
      '.ai/decisions.log',
      '.ai/blockers.md',
    ];

    aiFiles.forEach((file) => {
      expect(fs.existsSync(file), `${file} should exist`).toBe(true);
    });
  });

  it('should have CLAUDE.md under 50 lines', () => {
    const content = fs.readFileSync('CLAUDE.md', 'utf8');
    const lines = content.split('\n').length;
    expect(lines).toBeLessThan(50);
  });

  it('should have valid package.json', () => {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    expect(packageJson.name).toBe('noba-experts');
    expect(packageJson.scripts).toBeDefined();
    expect(packageJson.scripts['ai:verify']).toBeDefined();
    expect(packageJson.scripts['ai:status']).toBeDefined();
    expect(packageJson.scripts['ai:next']).toBeDefined();
  });

  it('should have valid context.json', () => {
    const context = JSON.parse(fs.readFileSync('.ai/context.json', 'utf8'));
    expect(context.projectName).toBe('NOBA EXPERTS');
    expect(context.stage.current).toBeDefined();
    expect(context.stack).toBeDefined();
    expect(context.features).toBeDefined();
  });

  it('should have required directories', () => {
    const dirs = [
      'src',
      'test',
      'database',
      'scripts/ai',
      '.ai',
    ];

    dirs.forEach((dir) => {
      expect(fs.existsSync(dir), `${dir} should exist`).toBe(true);
    });
  });

  it('should have .gitignore', () => {
    expect(fs.existsSync('.gitignore')).toBe(true);
    const content = fs.readFileSync('.gitignore', 'utf8');
    expect(content).toContain('node_modules');
    expect(content).toContain('.env');
  });

  it('should have .env.example', () => {
    expect(fs.existsSync('.env.example')).toBe(true);
    const content = fs.readFileSync('.env.example', 'utf8');
    expect(content).toContain('DATABASE_URL');
    expect(content).toContain('NEXTAUTH_SECRET');
  });
});
