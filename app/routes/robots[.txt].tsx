function generateRobotsTxt() {
  return `User-agent: *
  Allow: /
  Sitemap: https://andrelandgraf.dev/sitemap.xml`;
}

export function loader() {
  return new Response(generateRobotsTxt(), {
    headers: {
      'content-type': 'text/plain',
    },
  });
}
