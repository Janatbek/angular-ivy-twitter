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

  averageTweetsPerMinute$: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  // Math.round(
  //   totalTweetsPerMinute$.value / tweetsPerMinute$.value.length
  // )
  averageTweetsPerHour$: BehaviorSubject<number> = new BehaviorSubject<number>(
    0
  );
  averageTweetsPerDay$: BehaviorSubject<number> = new BehaviorSubject<number>(
    0
  );
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
        const perMinute = tweetPerMinuteResult.data.filter(
          (t) => +t.tweet_count > 0
        );
        const perHour = tweetPerHourResult.data.filter(
          (t) => +t.tweet_count > 0
        );
        const perDay = tweetPerDayResult.data.filter((t) => +t.tweet_count > 0);

        const perMinuteTotal = perMinute.reduce(
          (acc, curr) => (acc += +curr.tweet_count),
          0
        );
        const perHourTotal = perHour.reduce(
          (acc, curr) => (acc += +curr.tweet_count),
          0
        );
        const perDayTotal = perDay.reduce(
          (acc, curr) => (acc += +curr.tweet_count),
          0
        );
        // tweets result
        this.tweetsPerMinute$.next(perMinute);
        this.tweetsPerHour$.next(perHour);
        this.tweetsPerDay$.next(perDay);
        // Total tweets
        this.totalTweetsPerMinute$.next(perMinuteTotal);
        this.totalTweetsPerHour$.next(perHourTotal);
        this.totalTweetsPerDay$.next(perDayTotal);
        // average
        this.averageTweetsPerMinute$.next(
          Math.round(perMinuteTotal / perMinute.length)
        );
        this.averageTweetsPerHour$.next(
          Math.round(perHourTotal / perHour.length)
        );
        this.averageTweetsPerDay$.next(Math.round(perDayTotal / perDay.length));
      }
    );
  }

  searchByHashtag(): void {
    const hashtag = this.hashtag.value;
    if (hashtag.length < 1) {
      return;
    }
    this.tweetsPerMinute$.next([]);
    this.tweetsPerHour$.next([]);
    this.tweetsPerDay$.next([]);

    this.totalTweetsPerMinute$.next(0);
    this.totalTweetsPerHour$.next(0);
    this.totalTweetsPerDay$.next(0);

    this.averageTweetsPerMinute$.next(0);
    this.averageTweetsPerHour$.next(0);
    this.averageTweetsPerDay$.next(0);

    this.tweetsService.params.next(hashtag);
  }
}
