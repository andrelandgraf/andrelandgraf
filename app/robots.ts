import type { MetadataRoute } from 'next';

const origin = process.env.ORIGIN?.trim() || 'https://andrelandgraf.dev';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: [`${origin}/sitemap.xml`],
  };
}
