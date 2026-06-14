/**
 * In-memory sliding window rate limiter scaffold.
 */

interface RateLimitConfig {
  limit: number;     // Max requests
  windowMs: number;  // Time window in ms
}

const clientRequests = new Map<string, number[]>();

let lastCleanup = Date.now();

export function isRateLimited(
  clientId: string,
  config: RateLimitConfig = { limit: 60, windowMs: 60000 }
): { limited: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const windowStart = now - config.windowMs;

  // Retrieve existing request timestamps for the client
  let timestamps = clientRequests.get(clientId) || [];

  // Filter timestamps to keep only those within the active window
  timestamps = timestamps.filter((timestamp) => timestamp > windowStart);

  // Add the current request timestamp
  timestamps.push(now);
  clientRequests.set(clientId, timestamps);

  const requestCount = timestamps.length;
  const isLimited = requestCount > config.limit;
  
  const remaining = Math.max(0, config.limit - requestCount);
  const oldestTimestamp = timestamps[0];
  const resetTime = oldestTimestamp ? oldestTimestamp + config.windowMs : now + config.windowMs;

  // Perform periodic inline cleanup of all client records to prevent memory leaks
  if (now - lastCleanup > 600000) {
    lastCleanup = now;
    const expiryTime = now - 3600000; // 1 hour threshold
    for (const [id, times] of clientRequests.entries()) {
      const activeTimestamps = times.filter((t) => t > expiryTime);
      if (activeTimestamps.length === 0) {
        clientRequests.delete(id);
      } else {
        clientRequests.set(id, activeTimestamps);
      }
    }
  }

  return {
    limited: isLimited,
    remaining,
    resetTime
  };
}

