function generateRobotsTxt() {
  return `User-agent: *
  Allow: /
  Sitemap: https://andrelandgraf.dev/sitemap.xml`;
}

export async function loader() {
  return new Response(generateRobotsTxt(), {
    headers: {
      'content-type': 'text/plain',
    },
  });
}
