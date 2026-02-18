import { withSentryConfig } from '@sentry/nextjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/qr.png',
        destination: '/api/qr-png',
      },
      {
        source: '/blog/:slug.png',
        destination: '/blog/:slug/png',
      },
    ];
  },
};

const hasSentryUploadConfig = Boolean(process.env.SENTRY_AUTH_TOKEN && process.env.SENTRY_ORG && process.env.SENTRY_PROJECT);

export default withSentryConfig(
  nextConfig,
  {
    authToken: process.env.SENTRY_AUTH_TOKEN,
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
    silent: true,
    dryRun: !hasSentryUploadConfig,
    disable: !hasSentryUploadConfig,
  },
  {
    disableLogger: true,
  },
);
