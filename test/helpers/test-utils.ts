/**
 * Test Utilities - NO MOCKS
 * Helper functions for testing with real database
 */

import { getTestDb } from '../config/database';
import type { NextRequest } from 'next/server';

/**
 * Create a mock NextRequest for API route testing
 */
export function createMockRequest(options: {
  method: string;
  body?: any;
  headers?: Record<string, string>;
  url?: string;
  searchParams?: Record<string, string>;
}): NextRequest {
  const url = options.url || 'http://localhost:3000/api/test';
  const urlObj = new URL(url);

  if (options.searchParams) {
    Object.entries(options.searchParams).forEach(([key, value]) => {
      urlObj.searchParams.set(key, value);
    });
  }

  const headers = new Headers(options.headers || {});
  if (options.body && !headers.has('content-type')) {
    headers.set('content-type', 'application/json');
  }

  const init: RequestInit = {
    method: options.method,
    headers,
  };

  if (options.body) {
    init.body = JSON.stringify(options.body);
  }

  return new NextRequest(urlObj.toString(), init);
}

/**
 * Parse JSON response from API route
 */
export async function parseJsonResponse(response: Response): Promise<any> {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return { text };
  }
}

/**
 * Wait for async operation with timeout
 */
export function waitFor(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Create a session token for authenticated requests
 */
export async function createTestSession(userId: string): Promise<string> {
  const db = getTestDb();

  const session = await db.session.create({
    data: {
      userId,
      sessionToken: `test-session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
  });

  return session.sessionToken;
}

/**
 * Generate random test email
 */
export function generateTestEmail(prefix: string = 'test'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}@example.com`;
}

/**
 * Generate random test ID
 */
export function generateTestId(prefix: string = 'test'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Assert response status
 */
export function assertStatus(response: Response, expectedStatus: number): void {
  if (response.status !== expectedStatus) {
    throw new Error(
      `Expected status ${expectedStatus} but got ${response.status}: ${response.statusText}`
    );
  }
}

/**
 * Assert response is JSON
 */
export async function assertJson(response: Response): Promise<any> {
  const contentType = response.headers.get('content-type');
  if (!contentType?.includes('application/json')) {
    throw new Error(`Expected JSON response but got ${contentType}`);
  }
  return response.json();
}

/**
 * Create test answers for Big Five test
 */
export function createTestAnswers(scoreValue: number = 3): Array<{ questionId: number; score: number }> {
  return Array.from({ length: 120 }, (_, i) => ({
    questionId: i + 1,
    score: scoreValue,
  }));
}

/**
 * Verify database record exists
 */
export async function verifyRecordExists(
  model: string,
  where: any
): Promise<boolean> {
  const db = getTestDb();
  const count = await (db as any)[model].count({ where });
  return count > 0;
}

/**
 * Count database records
 */
export async function countRecords(
  model: string,
  where?: any
): Promise<number> {
  const db = getTestDb();
  return (db as any)[model].count({ where });
}
