/**
 * Test Database Configuration - NO MOCKS
 * Uses real SQLite database for all tests
 */

import { PrismaClient } from '@/generated/prisma';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const TEST_DB_PATH = path.join(process.cwd(), 'test', 'test.db');
const TEST_DATABASE_URL = `file:${TEST_DB_PATH}`;

// Global test database instance
let testPrisma: PrismaClient | null = null;

/**
 * Get or create test database instance
 */
export function getTestDb(): PrismaClient {
  if (!testPrisma) {
    testPrisma = new PrismaClient({
      datasources: {
        db: {
          url: TEST_DATABASE_URL,
        },
      },
      log: process.env.DEBUG_TESTS ? ['query', 'error', 'warn'] : ['error'],
    });
  }
  return testPrisma;
}

/**
 * Setup test database - run migrations and create schema
 */
export async function setupTestDatabase(): Promise<void> {
  // Remove existing test database
  if (fs.existsSync(TEST_DB_PATH)) {
    fs.unlinkSync(TEST_DB_PATH);
  }

  // Set test database URL
  process.env.DATABASE_URL = TEST_DATABASE_URL;

  try {
    // Run migrations to create schema
    execSync('npx prisma migrate deploy', {
      env: { ...process.env, DATABASE_URL: TEST_DATABASE_URL },
      stdio: 'pipe',
    });
  } catch (error) {
    // If migrations fail, try pushing schema directly
    try {
      execSync('npx prisma db push --skip-generate', {
        env: { ...process.env, DATABASE_URL: TEST_DATABASE_URL },
        stdio: 'pipe',
      });
    } catch (pushError) {
      console.error('Failed to setup test database:', pushError);
      throw pushError;
    }
  }
}

/**
 * Clean all data from test database (keeps schema)
 */
export async function cleanTestDatabase(): Promise<void> {
  const db = getTestDb();

  // Delete in correct order to respect foreign key constraints
  await db.integrationLog.deleteMany();
  await db.webhook.deleteMany();
  await db.integration.deleteMany();
  await db.teamAnalytics.deleteMany();
  await db.developmentPlan.deleteMany();
  await db.moodSurvey.deleteMany();
  await db.objective.deleteMany();
  await db.employeeTest.deleteMany();
  await db.employeeInvitation.deleteMany();
  await db.employee.deleteMany();
  await db.department.deleteMany();
  await db.companyAdmin.deleteMany();
  await db.company.deleteMany();
  await db.chatAccess.deleteMany();
  await db.chatHistory.deleteMany();
  await db.userTestLink.deleteMany();
  await db.testProgress.deleteMany();
  await db.testResult.deleteMany();
  await db.account.deleteMany();
  await db.session.deleteMany();
  await db.user.deleteMany();
  await db.verificationToken.deleteMany();
  await db.voucher.deleteMany();
}

/**
 * Teardown test database - close connection and remove file
 */
export async function teardownTestDatabase(): Promise<void> {
  if (testPrisma) {
    await testPrisma.$disconnect();
    testPrisma = null;
  }

  if (fs.existsSync(TEST_DB_PATH)) {
    fs.unlinkSync(TEST_DB_PATH);
  }
}

/**
 * Reset test database - clean all data
 */
export async function resetTestDatabase(): Promise<void> {
  await cleanTestDatabase();
}
