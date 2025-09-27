const logEnvironment = (() => {
  let logged = false;

  return () => {
    if (logged) {
      return;
    }
    logged = true;

    const phase = process.env.NEXT_PHASE ?? process.env.NODE_ENV ?? 'unknown';
    console.info('[microfe] Survey build configuration');
    console.info(`  phase: ${phase}`);
console.info(`  NEXT_PUBLIC_MAIN_API_BASE: ${process.env.NEXT_PUBLIC_MAIN_API_BASE ?? '<unset>'}`);
console.info('  basePath: /survey');
  };
})();

logEnvironment();

/** @type {import('next').NextConfig} */
const basePath = '/survey';

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true
  },
  basePath,
  assetPrefix: basePath
};

export default nextConfig;
