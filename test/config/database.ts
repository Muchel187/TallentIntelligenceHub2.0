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

  // Helper to safely delete from tables that may not exist
  const safeDelete = async (deleteFn: () => Promise<any>) => {
    try {
      await deleteFn();
    } catch (error: any) {
      // Ignore "table does not exist" errors
      if (!error.message?.includes('does not exist')) {
        throw error;
      }
    }
  };

  // Delete in correct order to respect foreign key constraints
  await safeDelete(() => db.integrationLog.deleteMany());
  await safeDelete(() => db.webhook.deleteMany());
  await safeDelete(() => db.integration.deleteMany());
  await safeDelete(() => db.teamAnalytics.deleteMany());
  await safeDelete(() => db.developmentPlan.deleteMany());
  await safeDelete(() => db.moodSurvey.deleteMany());
  await safeDelete(() => db.objective.deleteMany());
  await safeDelete(() => db.employeeTest.deleteMany());
  await safeDelete(() => db.employeeInvitation.deleteMany());
  await safeDelete(() => db.employee.deleteMany());
  await safeDelete(() => db.department.deleteMany());
  await safeDelete(() => db.companyAdmin.deleteMany());
  await safeDelete(() => db.company.deleteMany());
  await safeDelete(() => db.chatAccess.deleteMany());
  await safeDelete(() => db.chatHistory.deleteMany());
  await safeDelete(() => db.userTestLink.deleteMany());
  await safeDelete(() => db.testProgress.deleteMany());
  await safeDelete(() => db.testResult.deleteMany());
  await safeDelete(() => db.account.deleteMany());
  await safeDelete(() => db.session.deleteMany());
  await safeDelete(() => db.user.deleteMany());
  await safeDelete(() => db.verificationToken.deleteMany());
  await safeDelete(() => db.voucher.deleteMany());
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
