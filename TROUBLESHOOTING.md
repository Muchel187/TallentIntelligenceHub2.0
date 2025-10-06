# Troubleshooting

## Quick Fixes

### Environment Issues
**Problem**: Database connection fails
**Solution**: Check `.env` file has correct `DATABASE_URL`

**Problem**: NextAuth error
**Solution**: Set `NEXTAUTH_SECRET` in `.env` (generate with `openssl rand -base64 32`)

### Build Errors
**Problem**: TypeScript errors on build
**Solution**: Run `npm run typecheck` to see detailed errors

**Problem**: Prisma client out of sync
**Solution**: Run `npm run db:generate`

### Test Failures
**Problem**: Database tests fail
**Solution**: Ensure test database is running, run `npm run db:push`

**Problem**: E2E tests timeout
**Solution**: Increase timeout in Playwright config

### Runtime Errors
**Problem**: 500 error on API routes
**Solution**: Check server logs, verify database connection

**Problem**: Authentication not working
**Solution**: Verify Google OAuth credentials in `.env`

## How to Debug

1. Check environment: `npm run ai:verify`
2. Check status: `npm run ai:status`
3. Check logs: `npm run dev -- --verbose`
4. Clear cache: `npm run clean`
5. Regenerate Prisma: `npm run db:generate`
6. Reset database (DANGER): `npm run db:reset`

## Common Issues

### Prisma
**Issue**: `@prisma/client did not initialize yet`
**Fix**: Run `npm run db:generate`

**Issue**: Migration conflicts
**Fix**: Check `database/migrations/` folder, resolve manually or reset

### Next.js
**Issue**: Module not found
**Fix**: Check `tsconfig.json` paths, restart dev server

**Issue**: Fast Refresh not working
**Fix**: Ensure component names start with capital letter

### Authentication
**Issue**: Session not persisting
**Fix**: Check cookie settings in NextAuth config

**Issue**: OAuth redirect fails
**Fix**: Verify redirect URL in Google Console matches `NEXTAUTH_URL`

## Performance Issues

**Slow API responses**: Check database query performance with Prisma Studio
**High memory usage**: Check for memory leaks in long-running processes
**Slow build times**: Use `npm run analyze` to identify large dependencies

## Getting Help

1. Check `.ai/blockers.md` for known issues
2. Check `.ai/decisions.log` for context
3. Run `npm run ai:status` for health check
4. Check application logs in `logs/` directory

---
*Document issues and solutions as encountered*
