/**
 * Rate Limiting & Security
 * Prevents abuse and DDoS attacks
 */

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

const requestCounts = new Map<string, { count: number; resetAt: number }>();

/**
 * Rate limit by IP address
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = { maxRequests: 100, windowMs: 60000 }
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const existing = requestCounts.get(identifier);

  // Reset if window expired
  if (!existing || now > existing.resetAt) {
    const resetAt = now + config.windowMs;
    requestCounts.set(identifier, { count: 1, resetAt });

    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetAt,
    };
  }

  // Increment count
  existing.count++;

  // Check if limit exceeded
  if (existing.count > config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: existing.resetAt,
    };
  }

  return {
    allowed: true,
    remaining: config.maxRequests - existing.count,
    resetAt: existing.resetAt,
  };
}

/**
 * Clean up old entries (run periodically)
 */
export function cleanupRateLimits(): void {
  const now = Date.now();

  for (const [key, value] of requestCounts.entries()) {
    if (now > value.resetAt) {
      requestCounts.delete(key);
    }
  }
}

// Cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimits, 5 * 60 * 1000);
}

/**
 * Detect suspicious patterns
 */
export function detectSuspiciousActivity(
  identifier: string,
  endpoint: string
): { suspicious: boolean; reason?: string } {
  // Check for rapid fire requests to sensitive endpoints
  const sensitiveEndpoints = ['/api/auth/register', '/api/payment', '/api/test/submit'];

  if (sensitiveEndpoints.some((e) => endpoint.startsWith(e))) {
    const existing = requestCounts.get(`${identifier}:${endpoint}`);

    if (existing && existing.count > 10) {
      return {
        suspicious: true,
        reason: 'Too many requests to sensitive endpoint',
      };
    }
  }

  return { suspicious: false };
}
