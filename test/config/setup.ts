import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import { setupTestDatabase, cleanTestDatabase, teardownTestDatabase } from './database';

// Setup test database once before all tests
beforeAll(async () => {
  await setupTestDatabase();
});

// Clean database after each test to ensure isolation
afterEach(async () => {
  cleanup();
  await cleanTestDatabase();
});

// Teardown and cleanup after all tests
afterAll(async () => {
  await teardownTestDatabase();
});
