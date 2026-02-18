import type { Metadata } from 'next';

type BuildMetadataParams = {
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  useCatchPhraseInTitle?: boolean;
  standaloneTitle?: boolean;
  noIndex?: boolean;
  type?: 'website' | 'article';
};

const origin = process.env.ORIGIN?.trim() || 'http://localhost:3000';

function withOrigin(url: string): string {
  if (URL.canParse(url)) {
    return url;
  }
  return `${origin}${url.startsWith('/') ? url : `/${url}`}`;
}

function getTitle(standaloneTitle: boolean, useCatchPhraseInTitle: boolean, title: string): string {
  if (standaloneTitle) {
    return title;
  }
  if (useCatchPhraseInTitle) {
    return `${title} | A tech enthusiast and student who loves to develop fullstack software solutions.`;
  }
  return `${title} | Andre Landgraf`;
}

export function buildMetadata({
  title = 'Andre Landgraf',
  description = 'A tech enthusiast and student who loves to develop fullstack software solutions.',
  image = '/img?src=/profile.png&w=800&h=800',
  imageAlt = 'Andre smiles into the camera',
  useCatchPhraseInTitle = false,
  standaloneTitle = false,
  noIndex = false,
  type = 'website',
}: BuildMetadataParams): Metadata {
  const resolvedTitle = getTitle(standaloneTitle, useCatchPhraseInTitle, title);
  const imageUrl = withOrigin(image);

  return {
    title: resolvedTitle,
    description,
    themeColor: 'rgb(94 234 212)',
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
        },
    openGraph: {
      locale: 'en_US',
      type,
      title: resolvedTitle,
      description,
      images: [
        {
          url: imageUrl,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: resolvedTitle,
      description,
      creator: '@andrelandgraf94',
      site: '@andrelandgraf94',
      images: [imageUrl],
    },
  };
}
