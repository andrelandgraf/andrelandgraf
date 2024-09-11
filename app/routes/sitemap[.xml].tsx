import { db } from '~/modules/db.server';

function getUrlElementWithDate(url: string, date: string) {
  return `<url>
        <loc>${url}</loc>
        <lastmod>${date}</lastmod>
        </url>`;
}

function generateSiteMap(articles: { slug: string; date: Date }[], questions: { question: string }[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
            ${getUrlElementWithDate('https://andrelandgraf.dev/', new Date().toISOString())}
            ${getUrlElementWithDate('https://andrelandgraf.dev/blog', new Date().toISOString())}
            ${articles
              .map(
                (article) =>
                  `${getUrlElementWithDate(
                    `https://andrelandgraf.dev/blog/${article.slug}`,
                    article.date.toISOString(),
                  )}`,
              )
              .join('\n')}
        </urlset>`;
}

export async function loader() {
  const questionAnswerQuery = db.questionAndAnswer.findMany({
    select: {
      question: true,
    },
    where: {
      verified: true,
    },
  });
  const articlesQuery = db.article.findMany({
    select: {
      slug: true,
      date: true,
    },
  });
  const [articles, questions] = await Promise.all([articlesQuery, questionAnswerQuery]);
  return new Response(generateSiteMap(articles, questions), {
    headers: {
      'content-type': 'application/xml',
    },
  });
}
