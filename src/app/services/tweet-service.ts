import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApiPaths } from '../enums/api-path';
import { TweetCountResult } from '../models/tweet-count';

@Injectable({
  providedIn: 'root',
})
export class TweetsService {
  private apiUrl!: string;
  tweetsPerMinute$: BehaviorSubject<TweetCountResult> =
    new BehaviorSubject<TweetCountResult>({ data: [] });
  tweetsPerHour$: BehaviorSubject<TweetCountResult> =
    new BehaviorSubject<TweetCountResult>({ data: [] });
  tweetsPerDay$: BehaviorSubject<TweetCountResult> =
    new BehaviorSubject<TweetCountResult>({ data: [] });
  params: BehaviorSubject<string> = new BehaviorSubject<string>('tsla');
  httpParams!: HttpParams;
  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.baseUrl}${ApiPaths.Tweets}`;
    this.subsribeToParamsChange();
  }

  subsribeToParamsChange(): void {
    this.params.subscribe((hashtag: string) => {
      this.httpParams = new HttpParams().set('hashtag', hashtag);
      this.getTweetCountsPerMinute();
      this.getTweetCountsPerHour();
      this.getTweetCountsPerDay();
    });
  }

  getTweetCountsPerMinute(): void {
    let params = this.httpParams;
    params = params.set('granularity', 'minute');
    this.http
      .get<TweetCountResult>(this.apiUrl, { params })
      .pipe(
        catchError((error) => {
          console.error(error);
          return of([] as any);
        })
      )
      .subscribe((result) => this.tweetsPerMinute$.next(result));
  }
  getTweetCountsPerHour(): void {
    let params = this.httpParams;
    params = params.set('granularity', 'hour');
    this.http
      .get<TweetCountResult>(this.apiUrl, { params })
      .pipe(
        catchError((error) => {
          console.error(error);
          return of([] as any);
        })
      )
      .subscribe((result) => this.tweetsPerHour$.next(result));
  }
  getTweetCountsPerDay(): void {
    let params = this.httpParams;
    params = params.set('granularity', 'day');
    this.http
      .get<TweetCountResult>(this.apiUrl, { params })
      .pipe(
        catchError((error) => {
          console.error(error);
          return of([] as any);
        })
      )
      .subscribe((result) => this.tweetsPerDay$.next(result));
  }
}
