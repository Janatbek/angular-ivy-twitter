export interface TweetCount {
  end: string;
  start: string;
  tweet_count: string;
}

export interface TweetCountResult {
  data: TweetCount[];
  meta?: Meta;
}

export interface Meta {
  total_tweet_count: number;
}
