import type { MetaFunction } from '@vercel/remix';

import { images } from './images';

type GetMetaTagsParams = {
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  useCatchPhraseInTitle?: boolean;
  standaloneTitle?: boolean;
  noIndex?: boolean;
  type?: 'website' | 'article';
  meta?: Record<string, string>;
};

const getTitle = (standaloneTitle: boolean, useCatchPhraseInTitle: boolean, title: string) =>
  standaloneTitle
    ? title
    : useCatchPhraseInTitle
    ? `${title} | A tech enthusiast and student who loves to develop fullstack software solutions.`
    : `${title} | Andre Landgraf`;

// return a list of all meta tags for a route's meta function
const getMetaTags: (params: GetMetaTagsParams) => ReturnType<MetaFunction> = ({
  title = 'Andre Landgraf',
  description = 'A tech enthusiast and student who loves to develop fullstack software solutions.',
  image = images.resumeImage.src,
  imageAlt = images.resumeImage.alt,
  meta = {},
  useCatchPhraseInTitle = false,
  standaloneTitle = false,
  noIndex = false,
  type = 'website',
}) => {
  const metaTags = [
    { title: getTitle(standaloneTitle, useCatchPhraseInTitle, title) },
    { name: 'og:title', content: getTitle(standaloneTitle, useCatchPhraseInTitle, title) },
    { name: 'og:locale', content: 'en-US' },
    { name: 'twitter:title', content: getTitle(standaloneTitle, useCatchPhraseInTitle, title) },
    { name: 'description', content: description },
    { name: 'og:description', content: description },
    { name: 'twitter:description', content: description },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: '@andrelandgraf94' },
    { name: 'twitter:creator', content: '@andrelandgraf94' },
    { name: 'theme-color', content: 'rgb(94 234 212)' },
    { name: 'og:type', content: type },
    { name: 'robots', content: noIndex ? 'noindex' : 'all' },
  ];
  if (image && imageAlt) {
    metaTags.push(
      { name: 'image', content: image },
      { name: 'og:image', content: image },
      { name: 'twitter:image', content: image },
      { name: 'twitter:image:src', content: image },
      { name: 'twitter:tile:image', content: image },
    );
    metaTags.push(
      { name: 'image:alt', content: imageAlt },
      { name: 'og:image:alt', content: imageAlt },
      { name: 'twitter:image:alt', content: imageAlt },
    );
  }
  return metaTags;
};

export { getMetaTags };
