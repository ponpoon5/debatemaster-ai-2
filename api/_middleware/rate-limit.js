// Simple in-memory rate limiter
const requests = new Map();

export function rateLimit(ip, limit = 100, windowMs = 60000) {
  const now = Date.now();
  const windowStart = now - windowMs;

  // Get or create request history for this IP
  if (!requests.has(ip)) {
    requests.set(ip, []);
  }

  const ipRequests = requests.get(ip);

  // Remove old requests outside the window
  const recentRequests = ipRequests.filter(time => time > windowStart);
  requests.set(ip, recentRequests);

  // Check if limit exceeded
  if (recentRequests.length >= limit) {
    return false;
  }

  // Add this request
  recentRequests.push(now);
  return true;
}

export function getClientIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0] ||
         req.headers['x-real-ip'] ||
         req.socket?.remoteAddress ||
         'unknown';
}
