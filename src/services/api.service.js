export function getApiService(cnf, log) {
  return {
    fetchRandomQuote: async () => {
      try {
        const response = await fetch(cnf.randomQuoteUrl);
        const result = await response.json();
        return result.data;
      } catch (error) {
        log.error(error, 'Quote Relay Error:');
        return {
          title: 'Moving along',
          author: 'LuKa',
          description: 'Keep moving forward...',
          content: `Couldn't fetch a quote at the moment.`,
        };
      }
    },
  };
}
