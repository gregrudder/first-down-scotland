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

export const fantasyNewsFeeds: NewsFeed[] = [
  {
    id: "espn-fantasy",
    label: "ESPN Fantasy",
    url: "https://www.espn.com/espn/rss/fantasy/news",
  },
  {
    id: "fantasy-footballers",
    label: "Fantasy Footballers",
    url: "https://www.thefantasyfootballers.com/feed/",
  },
  {
    id: "rotowire-nfl",
    label: "RotoWire",
    url: "https://www.rotowire.com/rss/news.php?sport=NFL",
  },
];

export const NEWS_REVALIDATE_SECONDS = 600;
export const NEWS_CACHE_TAG = "news";
export const FANTASY_NEWS_CACHE_TAG = "news-fantasy";
export const NEWS_ITEM_LIMIT = 36;
