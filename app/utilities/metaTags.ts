interface GetMetaTagsParams {
  title?: string;
  description?: string;
  image?: string;
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
  image,
  meta = {},
  useCatchPhraseInTitle = false,
  standaloneTitle = false,
  noIndex = false,
}) => {
  const metaTags: Record<string, string> = {
    title: getTitle(standaloneTitle, useCatchPhraseInTitle, title),
    ogTitle: getTitle(standaloneTitle, useCatchPhraseInTitle, title),
    twitterTitle: getTitle(standaloneTitle, useCatchPhraseInTitle, title),
    description: description,
    ogDescription: description,
    twitterDescription: description,
    robots: noIndex ? 'noindex' : 'all',
    ...meta,
  };
  if (image) {
    metaTags.image = image;
    metaTags.ogImage = image;
    metaTags.twitterImage = image;
  }
  return metaTags;
};

export { getMetaTags };
