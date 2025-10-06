/**
 * Performance Monitoring & Error Tracking
 * Integrates with Datadog/Sentry for production monitoring
 */

interface PerformanceMetric {
  name: string;
  value: number;
  tags?: Record<string, string>;
}

interface ErrorReport {
  message: string;
  stack?: string;
  context?: Record<string, any>;
  userId?: string;
}

/**
 * Log performance metric
 */
export function logMetric(metric: PerformanceMetric): void {
  if (process.env.NODE_ENV !== 'production') {
    console.log('[Metric]', metric);
    return;
  }

  // TODO: Send to Datadog
  // if (window.DD_RUM) {
  //   window.DD_RUM.addAction(metric.name, {
  //     value: metric.value,
  //     ...metric.tags,
  //   });
  // }
}

/**
 * Log error with context
 */
export function logError(error: ErrorReport): void {
  console.error('[Error]', error);

  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  // TODO: Send to Sentry
  // if (window.Sentry) {
  //   window.Sentry.captureException(new Error(error.message), {
  //     extra: error.context,
  //     user: error.userId ? { id: error.userId } : undefined,
  //   });
  // }
}

/**
 * Measure API response time
 */
export async function measureApiCall<T>(
  name: string,
  apiCall: () => Promise<T>
): Promise<T> {
  const startTime = performance.now();

  try {
    const result = await apiCall();
    const duration = performance.now() - startTime;

    logMetric({
      name: `api.${name}.duration`,
      value: duration,
      tags: { status: 'success' },
    });

    return result;
  } catch (error) {
    const duration = performance.now() - startTime;

    logMetric({
      name: `api.${name}.duration`,
      value: duration,
      tags: { status: 'error' },
    });

    logError({
      message: `API call failed: ${name}`,
      stack: error instanceof Error ? error.stack : undefined,
      context: { apiName: name, duration },
    });

    throw error;
  }
}

/**
 * Monitor database query performance
 */
export async function measureDbQuery<T>(
  queryName: string,
  query: () => Promise<T>
): Promise<T> {
  const startTime = performance.now();

  try {
    const result = await query();
    const duration = performance.now() - startTime;

    // Log slow queries (>1s)
    if (duration > 1000) {
      console.warn(`Slow query detected: ${queryName} took ${duration}ms`);

      logMetric({
        name: 'db.slow_query',
        value: duration,
        tags: { query: queryName },
      });
    }

    return result;
  } catch (error) {
    logError({
      message: `Database query failed: ${queryName}`,
      stack: error instanceof Error ? error.stack : undefined,
      context: { queryName },
    });

    throw error;
  }
}

/**
 * Track page view
 */
export function trackPageView(page: string, properties?: Record<string, any>): void {
  if (process.env.NODE_ENV !== 'production') {
    console.log('[PageView]', page, properties);
    return;
  }

  // TODO: Send to analytics
  // if (window.DD_RUM) {
  //   window.DD_RUM.startView(page, properties);
  // }
}

/**
 * Track user action
 */
export function trackAction(action: string, properties?: Record<string, any>): void {
  if (process.env.NODE_ENV !== 'production') {
    console.log('[Action]', action, properties);
    return;
  }

  // TODO: Send to analytics
  // if (window.DD_RUM) {
  //   window.DD_RUM.addAction(action, properties);
  // }
}

/**
 * Measure render performance
 */
export function measureRender(componentName: string, duration: number): void {
  if (duration > 100) {
    console.warn(`Slow render detected: ${componentName} took ${duration}ms`);

    logMetric({
      name: 'render.slow_component',
      value: duration,
      tags: { component: componentName },
    });
  }
}

/**
 * Monitor memory usage
 */
export function checkMemoryUsage(): void {
  if (typeof performance === 'undefined' || !(performance as any).memory) {
    return;
  }

  const memory = (performance as any).memory;

  logMetric({
    name: 'memory.used_js_heap_size',
    value: memory.usedJSHeapSize,
  });

  logMetric({
    name: 'memory.total_js_heap_size',
    value: memory.totalJSHeapSize,
  });

  // Warn if using >90% of available heap
  const usageRatio = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
  if (usageRatio > 0.9) {
    console.warn(`High memory usage: ${(usageRatio * 100).toFixed(1)}%`);

    logMetric({
      name: 'memory.high_usage_warning',
      value: usageRatio,
    });
  }
}

// Check memory every 30 seconds in production
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  setInterval(checkMemoryUsage, 30000);
}
