import { images } from './images';

interface GetMetaTagsParams {
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  useCatchPhraseInTitle?: boolean;
  standaloneTitle?: boolean;
  noIndex?: boolean;
  meta?: Record<string, string>;
}

const getTitle = (standaloneTitle: boolean, useCatchPhraseInTitle: boolean, title: string) =>
  standaloneTitle
    ? title
    : useCatchPhraseInTitle
    ? `${title} | A tech enthusiast and student who loves to develop fullstack software solutions.`
    : `${title} | Andre Landgraf`;

// return a list of all meta tags for a route's meta function
const getMetaTags: (params: GetMetaTagsParams) => Record<string, string> = ({
  title = 'Andre Landgraf',
  description = 'A tech enthusiast and student who loves to develop fullstack software solutions.',
  image = images.resumeImage.src,
  imageAlt = images.resumeImage.alt,
  meta = {},
  useCatchPhraseInTitle = false,
  standaloneTitle = false,
  noIndex = false,
}) => {
  const metaTags: Record<string, string> = {
    title: getTitle(standaloneTitle, useCatchPhraseInTitle, title),
    'og:title': getTitle(standaloneTitle, useCatchPhraseInTitle, title),
    'twitter:title': getTitle(standaloneTitle, useCatchPhraseInTitle, title),
    description: description,
    'og:description': description,
    'twitter:description': description,
    robots: noIndex ? 'noindex' : 'all',
    ...meta,
  };
  if (image) {
    metaTags.image = image;
    metaTags['og:image'] = image;
    metaTags['twitter:image'] = image;
  }
  if (imageAlt) {
    metaTags['image:alt'] = imageAlt;
    metaTags['og:image:alt'] = imageAlt;
    metaTags['twitter:image:alt'] = imageAlt;
  }
  return metaTags;
};

export { getMetaTags };
