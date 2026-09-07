export type NewsFeed = {
  id: string;
  label: string;
  url: string;
};

export const nflNewsFeeds: NewsFeed[] = [
  {
    id: "espn",
    label: "ESPN",
    url: "https://www.espn.com/espn/rss/nfl/news",
  },
  {
    id: "bbc",
    label: "BBC Sport",
    url: "https://feeds.bbci.co.uk/sport/american-football/rss.xml",
  },
  {
    id: "guardian",
    label: "The Guardian",
    url: "https://www.theguardian.com/sport/nfl/rss",
  },
];

export const NEWS_REVALIDATE_SECONDS = 600;
export const NEWS_CACHE_TAG = "news";
export const NEWS_ITEM_LIMIT = 36;
