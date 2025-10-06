# Known Blockers & Limitations

## Current Blockers

*No blockers yet - project in initialization phase*

---

## Potential Future Blockers

### 1. OpenAI API Costs
**Risk**: High volume of chat interactions could lead to expensive API costs
**Mitigation**:
- Implement aggressive caching of reports
- Set hard limits on chat messages per test (max 50)
- Consider self-hosted LLM for cheaper queries
- Monitor costs daily

**Status**: Not blocking yet, monitor in Phase 2

---

### 2. PDF Generation Performance
**Risk**: Puppeteer can be slow (5-10s per PDF) and memory-intensive
**Mitigation**:
- Move to background job queue (BullMQ)
- Cache generated PDFs
- Consider serverless function with longer timeout
- Evaluate alternative: Playwright or native PDF library

**Status**: Not blocking yet, test in Phase 2

---

### 3. PostgreSQL Connection Limits
**Risk**: Vercel serverless functions create many connections
**Mitigation**:
- Use connection pooling (PgBouncer)
- Consider Prisma Data Proxy
- Implement proper connection cleanup
- Monitor active connections

**Status**: Not blocking yet, monitor in production

---

### 4. Data Migration from Old System
**Risk**: Complex migration from MySQL to PostgreSQL with data integrity
**Mitigation**:
- Create detailed migration script
- Dry-run on test data
- Implement data validation
- Keep old system running in parallel

**Status**: Blocking Phase 7 (Migration), prepare script early

---

### 5. DSGVO Compliance
**Risk**: Handling personal data requires legal review
**Mitigation**:
- Privacy by design from start
- Implement right-to-deletion
- Data encryption at rest
- Get legal review before launch

**Status**: Not blocking development, blocking production launch

---

### 6. Stripe Webhook Reliability
**Risk**: Webhooks can fail, leading to payment/access mismatch
**Mitigation**:
- Implement idempotency keys
- Retry logic with exponential backoff
- Manual reconciliation UI for admins
- Monitor webhook failures

**Status**: Not blocking yet, implement properly in Phase 2

---

### 7. Mobile App Store Approval
**Risk**: App Store/Play Store rejection could delay launch
**Mitigation**:
- Follow all guidelines from start
- Test on real devices
- Prepare detailed privacy policy
- Have backup plan (PWA)

**Status**: Blocking Phase 6, not urgent

---

## Resolved Blockers

*No resolved blockers yet*

---

## How to Report a Blocker

When you encounter a blocker:

1. Add it to this file with:
   - Clear description
   - Impact on project
   - Proposed mitigation
   - Current status

2. Log in `.ai/decisions.log` if decision is needed

3. Update `TROUBLESHOOTING.md` if it's a common issue

4. Mark as resolved when fixed, move to "Resolved" section

---
