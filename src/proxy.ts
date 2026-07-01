import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Allowed referers for image optimization requests.
// Add your production domain(s) here via ALLOWED_IMAGE_REFERERS env var.
const DEFAULT_ALLOWED_ORIGINS = [
  'localhost:3000',
  'lemon-blog.vercel.app',
];

const ALLOWED_ORIGINS = (process.env.ALLOWED_IMAGE_REFERERS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

if (ALLOWED_ORIGINS.length === 0) {
  ALLOWED_ORIGINS.push(...DEFAULT_ALLOWED_ORIGINS);
}

const RATE_LIMIT_WINDOW_MS = 60_000;
const IMAGE_RATE_LIMIT = 60;
const GENERAL_RATE_LIMIT = 200;

// In-memory sliding-window rate limiter.
// Note: Edge functions are stateless across regions, so this is a best-effort
// per-instance mitigation. For global, persistent rate limiting, use Redis.
const ipRequestCounts = new Map<string, number[]>();

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

function isAllowedReferer(referer: string | null): boolean {
  if (!referer) return false;
  return ALLOWED_ORIGINS.some((origin) => referer.includes(origin));
}

function isRateLimited(ip: string, limit: number): boolean {
  const now = Date.now();
  const timestamps = ipRequestCounts.get(ip) || [];
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const recent = timestamps.filter((t) => t > windowStart);

  if (recent.length >= limit) {
    return true;
  }

  recent.push(now);
  ipRequestCounts.set(ip, recent);

  // Simple cleanup to prevent unbounded growth.
  if (ipRequestCounts.size > 10_000) {
    const cutoff = now - RATE_LIMIT_WINDOW_MS;
    for (const [key, times] of ipRequestCounts) {
      const remaining = times.filter((t) => t > cutoff);
      if (remaining.length === 0) {
        ipRequestCounts.delete(key);
      } else {
        ipRequestCounts.set(key, remaining);
      }
    }
  }

  return false;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = getClientIp(request);
  const referer = request.headers.get('referer');

  // Protect Next.js image optimizer: it is the path through which external
  // OSS images are fetched and cached. Require a valid referer and rate limit.
  if (pathname.startsWith('/_next/image')) {
    if (!isAllowedReferer(referer)) {
      return new NextResponse('Forbidden: invalid referer', { status: 403 });
    }

    if (isRateLimited(ip, IMAGE_RATE_LIMIT)) {
      return new NextResponse('Too Many Requests', { status: 429 });
    }

    return NextResponse.next();
  }

  // Best-effort general rate limit for everything else.
  if (isRateLimited(ip, GENERAL_RATE_LIMIT)) {
    return new NextResponse('Too Many Requests', { status: 429 });
  }

  return NextResponse.next();
}

export const config = {
  // Apply to all routes except Next.js static assets (JS/CSS).
  matcher: ['/((?!_next/static|favicon.ico|apple-icon.jpg).*)'],
};

