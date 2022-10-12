import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {filter, map, Observable, of, repeat, Subscription, switchMap, take, timeout} from 'rxjs';
import {CdsHooksCard, CdsHooksResponse} from './cds-hooks.protocol';

@Injectable({providedIn: "root"})
export class ProxyClient {

  private cprsHandle: string;

  constructor(
    private readonly httpClient : HttpClient,
    route: ActivatedRoute) {
      route.queryParamMap.subscribe(map => {
        this.cprsHandle = map.get('handle');
      });
  }

  nextInstance(): Observable<string> {
    return this.httpClient.get(`next/${this.cprsHandle}`, {
      observe: 'response',
      responseType: 'text'
    }).pipe(
      repeat({delay: 500, count: 50}),
      map(r => r.ok ? r.body : null),
      timeout(20000),
      filter(r => r !== ''),
      take(1)
    );
  }

  getResponse(instance: string): Observable<CdsHooksResponse> {
    return <Observable<any>> this.httpClient.get(`response/${this.cprsHandle}/${instance}`, {
      observe: 'body',
      responseType: 'json'
    })
  }

  nextResponse(): Observable<CdsHooksResponse> {
    return this.nextInstance().pipe(
      switchMap(instance => instance == null ? of(null) : this.getResponse(instance))
    );
  }

  abortAll(): void {
    const s: Subscription = this.httpClient.get(`abort/${this.cprsHandle}`).subscribe(_ => s.unsubscribe());
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
