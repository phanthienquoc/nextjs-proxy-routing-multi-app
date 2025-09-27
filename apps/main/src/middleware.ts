import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const PROXY_TIMEOUT_MS = Number(process.env.PROXY_HEALTH_TIMEOUT_MS ?? '1000');

const normaliseBasePath = (value: string | undefined, fallback: string) => {
  if (!value) {
    return fallback;
  }
  const ensured = value.startsWith('/') ? value : `/${value}`;
  return ensured === '/' ? ensured : ensured.replace(/\/$/, '');
};

const joinPath = (base: string, segment: string) => {
  const trimmedBase = base === '/' ? '' : base.replace(/\/$/, '');
  const trimmedSegment = segment.replace(/^\/+/, '');
  return `${trimmedBase}/${trimmedSegment}`.replace(/\/\//g, '/');
};

const combineOriginPath = (origin: string, basePath: string) => {
  if (!origin) {
    return origin;
  }
  if (!basePath || basePath === '/') {
    return origin;
  }
  return `${origin}${basePath}`;
};

const env = (primary: string, fallback: string) => process.env[primary] ?? process.env[fallback];

const CHAT_BASE_PATH = normaliseBasePath(process.env.CHAT_BASE_PATH, '/chat');
const SURVEY_BASE_PATH = normaliseBasePath(process.env.SURVEY_BASE_PATH, '/survey');

const proxies = [
  {
    routeBase: CHAT_BASE_PATH,
    origin: env('NEXT_PUBLIC_CHAT_ORIGIN', 'CHAT_ORIGIN'),
    originBase: CHAT_BASE_PATH,
    fallbackPath: joinPath(CHAT_BASE_PATH, 'unavailable'),
    enabled: process.env.CHAT_PROXY_ENABLED !== 'false'
  },
  {
    routeBase: SURVEY_BASE_PATH,
    origin: env('NEXT_PUBLIC_SURVEY_ORIGIN', 'SURVEY_ORIGIN'),
    originBase: SURVEY_BASE_PATH,
    fallbackPath: joinPath(SURVEY_BASE_PATH, 'unavailable'),
    enabled: process.env.SURVEY_PROXY_ENABLED !== 'false'
  }
] as const;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  for (const proxy of proxies) {
    if (!matchesRouteBase(pathname, proxy.routeBase)) {
      continue;
    }

    if (!proxy.enabled || !proxy.origin) {
      return NextResponse.rewrite(toFallbackUrl(request, proxy.fallbackPath));
    }

    if (isRootPath(pathname, proxy.routeBase)) {
      const reachable = await isOriginReachable(proxy.origin, proxy.originBase);
      if (!reachable) {
        return NextResponse.rewrite(toFallbackUrl(request, proxy.fallbackPath));
      }
    }

    break;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/chat/:path*', '/survey/:path*']
};

function isRootPath(pathname: string, basePath: string) {
  if (basePath === '/') {
    return pathname === '/' || pathname === '';
  }
  return pathname === basePath || pathname === `${basePath}/`;
}

function matchesRouteBase(pathname: string, basePath: string) {
  if (basePath === '/') {
    return true;
  }

  return pathname === basePath || pathname.startsWith(`${basePath}/`);
}

function toFallbackUrl(request: NextRequest, fallbackPath: string) {
  const rewriteUrl = request.nextUrl.clone();
  rewriteUrl.pathname = fallbackPath;
  return rewriteUrl;
}

async function isOriginReachable(origin: string, basePath: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), PROXY_TIMEOUT_MS);

  try {
    const response = await fetch(combineOriginPath(origin, basePath), {
      method: 'HEAD',
      cache: 'no-store',
      redirect: 'manual',
      signal: controller.signal
    });

    return response.ok || (response.status >= 200 && response.status < 500);
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}
