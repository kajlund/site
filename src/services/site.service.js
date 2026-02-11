export function getSiteService(cnf, log) {
  return {
    fetchRandomQuote: async () => {
      try {
        const response = await fetch(cnf.randomQuoteUrl);
        const result = await response.json();
        log.info(result);
        return result.data;
      } catch (error) {
        log.error(error, 'Error fetching quote:');
        return {
          title: 'Moving along',
          author: 'LuKa',
          description: "Couldn't fetch a quote at the moment.",
          content: 'Keep moving forward...',
        };
      }
    },
    generateSiteMap: async () => {
      let xml = `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
          <url><loc>https://kajlund.com</loc></url>
        </urlset>`;
      return xml;
    },
  };
}
