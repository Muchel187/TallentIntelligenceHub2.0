/**
 * Test Data Factories - NO MOCKS
 * Creates real test data in the database
 */

import { getTestDb } from '../config/database';
import { hash } from 'argon2';
import type { User, Company, Employee, TestResult, Voucher } from '@/generated/prisma';

/**
 * Create a test user
 */
export async function createTestUser(overrides?: Partial<User>): Promise<User> {
  const db = getTestDb();

  const defaultPassword = await hash('TestPassword123!');

  return db.user.create({
    data: {
      email: overrides?.email || `test-${Date.now()}@example.com`,
      name: overrides?.name || 'Test User',
      password: defaultPassword,
      ...overrides,
    },
  });
}

/**
 * Create a test company
 */
export async function createTestCompany(overrides?: Partial<Company>): Promise<Company> {
  const db = getTestDb();

  return db.company.create({
    data: {
      name: overrides?.name || 'Test Company GmbH',
      domain: overrides?.domain || 'testcompany.com',
      industry: overrides?.industry || 'Technology',
      size: overrides?.size || '10-50',
      subscriptionStatus: overrides?.subscriptionStatus || 'active',
      subscriptionPlan: overrides?.subscriptionPlan || 'professional',
      maxEmployees: overrides?.maxEmployees || 50,
      billingEmail: overrides?.billingEmail || 'billing@testcompany.com',
      ...overrides,
    },
  });
}

/**
 * Create a test company admin
 */
export async function createTestCompanyAdmin(
  companyId: number,
  userId: string,
  role: string = 'admin'
) {
  const db = getTestDb();
  const user = await db.user.findUnique({ where: { id: userId } });

  return db.companyAdmin.create({
    data: {
      companyId,
      userId,
      email: user?.email || 'admin@testcompany.com',
      role,
      permissions: JSON.stringify(['manage_employees', 'view_reports', 'manage_integrations']),
    },
  });
}

/**
 * Create a test employee
 */
export async function createTestEmployee(
  companyId: number,
  overrides?: Partial<Employee>
): Promise<Employee> {
  const db = getTestDb();

  return db.employee.create({
    data: {
      companyId,
      email: overrides?.email || `employee-${Date.now()}@testcompany.com`,
      firstName: overrides?.firstName || 'John',
      lastName: overrides?.lastName || 'Doe',
      position: overrides?.position || 'Software Engineer',
      level: overrides?.level || 'mid',
      employmentType: overrides?.employmentType || 'full_time',
      startDate: overrides?.startDate || new Date(),
      status: overrides?.status || 'active',
      ...overrides,
    },
  });
}

/**
 * Create a test result with Big Five scores
 */
export async function createTestResult(overrides?: Partial<TestResult>): Promise<TestResult> {
  const db = getTestDb();

  const testId = overrides?.testId || `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const defaultScores = {
    O: 72,
    C: 68,
    E: 75,
    A: 70,
    N: 45,
  };

  const defaultUserDetails = {
    age: 30,
    currentJob: 'Software Engineer',
    industry: 'Technology',
    careerGoal: 'Senior Engineer',
  };

  const defaultAnswers = Array.from({ length: 120 }, (_, i) => ({
    questionId: i + 1,
    score: 3,
  }));

  return db.testResult.create({
    data: {
      testId,
      email: overrides?.email || `test-${Date.now()}@example.com`,
      scores: overrides?.scores || defaultScores,
      rawAnswers: overrides?.rawAnswers || defaultAnswers,
      userDetails: overrides?.userDetails || defaultUserDetails,
      paid: overrides?.paid ?? false,
      voucher: overrides?.voucher || null,
      ...overrides,
    },
  });
}

/**
 * Create a test voucher
 */
export async function createTestVoucher(overrides?: Partial<Voucher>): Promise<Voucher> {
  const db = getTestDb();

  return db.voucher.create({
    data: {
      code: overrides?.code || `VOUCHER-${Date.now()}`,
      description: overrides?.description || 'Test voucher',
      validUntil: overrides?.validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      maxUses: overrides?.maxUses || 100,
      currentUses: overrides?.currentUses || 0,
      createdBy: overrides?.createdBy || 'system',
      ...overrides,
    },
  });
}

/**
 * Create a test department
 */
export async function createTestDepartment(companyId: number, name: string = 'Engineering') {
  const db = getTestDb();

  return db.department.create({
    data: {
      companyId,
      name,
      description: `${name} department`,
    },
  });
}

/**
 * Create test chat history
 */
export async function createTestChatHistory(testId: string, messages: Array<{ role: string; content: string }>) {
  const db = getTestDb();

  const created = [];
  for (const msg of messages) {
    const history = await db.chatHistory.create({
      data: {
        testId,
        role: msg.role,
        content: msg.content,
      },
    });
    created.push(history);
  }

  return created;
}

/**
 * Create a complete test scenario with user, company, and employees
 */
export async function createCompleteTestScenario() {
  const user = await createTestUser({
    email: 'admin@scenario.com',
    name: 'Admin User',
  });

  const company = await createTestCompany({
    name: 'Scenario Company',
    domain: 'scenario.com',
  });

  const admin = await createTestCompanyAdmin(company.id, user.id, 'owner');

  const department = await createTestDepartment(company.id, 'Engineering');

  const employees = await Promise.all([
    createTestEmployee(company.id, {
      email: 'emp1@scenario.com',
      firstName: 'Alice',
      lastName: 'Smith',
      departmentId: department.id,
    }),
    createTestEmployee(company.id, {
      email: 'emp2@scenario.com',
      firstName: 'Bob',
      lastName: 'Johnson',
      departmentId: department.id,
    }),
  ]);

  const testResult = await createTestResult({
    email: 'emp1@scenario.com',
    paid: true,
  });

  return {
    user,
    company,
    admin,
    department,
    employees,
    testResult,
  };
}
