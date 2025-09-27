const normaliseOrigin = (value) => (value ? value.replace(/\/$/, '') : value);
const normaliseBasePath = (value, fallback) => {
  if (!value) {
    return fallback;
  }
  if (!value.startsWith('/')) {
    return `/${value.replace(/^\/+/, '')}`;
  }
  return value.replace(/\/$/, '') || '/';
};

const resolveEnv = (...keys) => {
  for (const key of keys) {
    const value = process.env[key];
    if (value) {
      return value;
    }
  }
  return undefined;
};

const SURVEY_BASE_PATH = normaliseBasePath(process.env.SURVEY_BASE_PATH, '/survey');
const CHAT_BASE_PATH = normaliseBasePath(process.env.CHAT_BASE_PATH, '/chat');

const NEXT_PUBLIC_SURVEY_ORIGIN = normaliseOrigin(
  resolveEnv('NEXT_PUBLIC_SURVEY_ORIGIN', 'SURVEY_ORIGIN')
);
const NEXT_PUBLIC_CHAT_ORIGIN = normaliseOrigin(
  resolveEnv('NEXT_PUBLIC_CHAT_ORIGIN', 'CHAT_ORIGIN')
);
const SURVEY_PROXY_ENABLED = process.env.SURVEY_PROXY_ENABLED !== 'false';
const CHAT_PROXY_ENABLED = process.env.CHAT_PROXY_ENABLED !== 'false';

const joinOriginPath = (origin, basePath) => {
  if (!origin) {
    return origin;
  }
  if (!basePath || basePath === '/') {
    return origin;
  }
  return `${origin}${basePath}`;
};

const withTrailingSlash = (value) => (value.endsWith('/') ? value : `${value}/`);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true
  },
  async rewrites() {
    const rules = [];

    if (SURVEY_PROXY_ENABLED && NEXT_PUBLIC_SURVEY_ORIGIN) {
      const surveyDestination = joinOriginPath(NEXT_PUBLIC_SURVEY_ORIGIN, SURVEY_BASE_PATH);
      rules.push(
        {
          source: SURVEY_BASE_PATH,
          destination: surveyDestination
        },
        {
          source: `${SURVEY_BASE_PATH}/:path*`,
          destination: `${surveyDestination}/:path*`
        }
      );
    }

    if (CHAT_PROXY_ENABLED && NEXT_PUBLIC_CHAT_ORIGIN) {
      const chatDestination = joinOriginPath(NEXT_PUBLIC_CHAT_ORIGIN, CHAT_BASE_PATH);
      rules.push(
        {
          source: CHAT_BASE_PATH,
          destination: withTrailingSlash(chatDestination)
        },
        {
          source: `${CHAT_BASE_PATH}/:path*`,
          destination: `${chatDestination}/:path*`
        }
      );
    }

    console.log('Rewrites rules:', rules);
    return rules;
  }
};

export default nextConfig;
