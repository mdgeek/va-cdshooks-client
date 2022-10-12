import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {filter, map, Observable, of, repeat, Subscription, switchMap, take, timeout} from 'rxjs';
import {CdsHooksCard, CdsHooksResponse} from './cds-hooks.protocol';

@Injectable({providedIn: "root"})
export class ProxyClient {

  constructor(
    private readonly httpClient: HttpClient,
    private readonly route: ActivatedRoute) {
  }

  private getHandle(): Observable<String> {
    return this.route.queryParamMap.pipe(
      map(map => map.get('handle')),
      filter(handle => handle != null),
      timeout(2000),
      take(1));
  }

  nextInstance(): Observable<string> {
    return this.getHandle().pipe(switchMap(handle =>
      this.httpClient.get(`../../next/${handle}`, {
        observe: 'response',
        responseType: 'text'
      }).pipe(
        repeat({delay: 500, count: 50}),
        map(r => r.ok ? r.body : null),
        timeout(20000),
        filter(r => r !== ''),
        take(1)
      )));
  }

  getResponse(instance: string): Observable<CdsHooksResponse> {
    return this.getHandle().pipe(switchMap(handle =>
      <Observable<any>>this.httpClient.get(`../../response/${handle}/${instance}`, {
        observe: 'body',
        responseType: 'json'
      })));
  }

  nextResponse(): Observable<CdsHooksResponse> {
    return this.nextInstance().pipe(
      switchMap(instance => instance == null ? of(null) : this.getResponse(instance))
    );
  }

  abortAll(): void {
    const s: Subscription = this.getHandle().pipe(switchMap(handle =>
      this.httpClient.get(`../../abort/${handle}`))).subscribe(_ => s.unsubscribe());
  }

  processResponse(response: CdsHooksResponse): void {
    for (const card of response.cards || []) {
      this.processCard(card);
    }
  }

  private processCard(card: CdsHooksCard) {
    alert(card);
  }
}
