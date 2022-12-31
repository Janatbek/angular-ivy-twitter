import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { TweetCount } from './models/tweet-count';
import { TweetsService } from './services/tweet-service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  hashtag!: FormControl<string>;

  tweetsPerMinute$: BehaviorSubject<TweetCount[]> = new BehaviorSubject<
    TweetCount[]
  >([]);
  tweetsPerHour$: BehaviorSubject<TweetCount[]> = new BehaviorSubject<
    TweetCount[]
  >([]);
  tweetsPerDay$: BehaviorSubject<TweetCount[]> = new BehaviorSubject<
    TweetCount[]
  >([]);
  totalTweetsPerMinute$: BehaviorSubject<number> = new BehaviorSubject<number>(
    0
  );
  totalTweetsPerHour$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  totalTweetsPerDay$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  Math = Math;
  constructor(private tweetsService: TweetsService) {}

  ngOnInit(): void {
    this.hashtag = new FormControl('tsla', { nonNullable: true });
    combineLatest([
      this.tweetsService.tweetsPerMinute$,
      this.tweetsService.tweetsPerHour$,
      this.tweetsService.tweetsPerDay$,
    ]).subscribe(
      ([tweetPerMinuteResult, tweetPerHourResult, tweetPerDayResult]) => {
        this.tweetsPerMinute$.next(tweetPerMinuteResult.data);
        this.tweetsPerHour$.next(tweetPerHourResult.data);
        this.tweetsPerDay$.next(tweetPerDayResult.data);
        if (tweetPerMinuteResult.meta?.total_tweet_count) {
          this.totalTweetsPerMinute$.next(
            tweetPerMinuteResult.meta?.total_tweet_count
          );
        }
        if (tweetPerHourResult.meta?.total_tweet_count) {
          this.totalTweetsPerHour$.next(
            tweetPerHourResult.meta?.total_tweet_count
          );
        }
        if (tweetPerDayResult.meta?.total_tweet_count) {
          this.totalTweetsPerDay$.next(
            tweetPerDayResult.meta?.total_tweet_count
          );
        }
      }
    );
  }

  searchByHashtag(): void {
    const hashtag = this.hashtag.value;
    if (hashtag.length < 1) {
      return;
    }

    this.tweetsService.params.next(hashtag);
  }
}
