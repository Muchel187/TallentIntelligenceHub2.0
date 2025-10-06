# Testing Strategy

## Philosophy
- **No Mocks** - Test with real implementations when possible
- **Progressive** - Add tests as features grow
- **Fast Feedback** - Smoke tests run in <30 seconds
- **Test-Driven** - Write tests before implementation

## Test Structure
```
test/
├── smoke/          # Quick verification (always run first)
├── unit/           # Business logic tests (Big Five scoring)
├── integration/    # Service interaction tests (API, DB)
├── e2e/            # User workflow tests (Playwright)
└── ai-verify/      # Structure verification
```

## Test Types

### Smoke Tests (30 seconds)
- Project structure exists
- Configuration valid
- Basic dependencies work
- Database connection available

### Unit Tests
- Big Five scoring algorithm
- Compatibility calculation
- Retention risk calculation
- Voucher validation
- All utility functions

### Integration Tests
- API endpoints (test submission, results)
- Database operations (CRUD)
- Authentication flow (NextAuth)
- Payment flow (Stripe webhooks)
- Email service (Resend)

### E2E Tests
- Complete test flow (Landing → Test → Report)
- Payment flow (Stripe checkout)
- Company admin flow (Employee management)
- Chat interaction (AI Coach)

## Current Coverage
- [x] Smoke tests - Basic structure
- [ ] Unit tests - 0% (implementing Big Five scorer first)
- [ ] Integration - 0% (after API setup)
- [ ] E2E tests - 0% (after UI implementation)

## Test Patterns

### Unit Test Example
```typescript
describe('Big Five Scorer', () => {
  it('should calculate Openness score correctly', () => {
    const answers = [{ questionId: 1, score: 5 }];
    const score = calculateDimensionScore(answers, 'O', questionConfig);
    expect(score).toBe(120);
  });
});
```

### Integration Test Example
```typescript
describe('POST /api/test/submit', () => {
  it('should create test result and return testId', async () => {
    const response = await request(app)
      .post('/api/test/submit')
      .send({ answers, userDetails, email });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('testId');
  });
});
```

---
*See `.ai/patterns.md` for more test patterns*
