import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {filter, map, Observable, of, repeat, Subscription, switchMap, take, timeout} from 'rxjs';
import {CdsHooksCard, CdsHooksResponse} from './cds-hooks.protocol';

@Injectable({providedIn: "root"})
export class ProxyClient {

  private readonly handle: string;

  private readonly queryParameters: {[name: string]: string} = {};

  readonly noclose: boolean;

  constructor(
    private readonly httpClient: HttpClient) {
    this.parseQueryString();
    this.noclose = this.queryParameters['noclose'] != null;
    this.handle = this.queryParameters['handle'];

    if (this.handle == null) {
      throw new Error('No handle specified in query string.')
    }
  }

  private parseQueryString(): void {
    const qs: String = window.location.search;
    const params: String[] = qs == null ? [] : qs.substring(1).split('&');
    params.forEach(p => {
      const nv: string[] = p.split('=', 2);
      this.queryParameters[nv[0].trim()] = nv[1]?.trim() || '';
    })
  }

  nextInstance(): Observable<string> {
    return this.httpClient.get(`../../next/${this.handle}`, {
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
    return <Observable<any>>this.httpClient.get(`../../response/${this.handle}/${instance}`, {
      observe: 'body',
      responseType: 'json'
    });
  }

  nextResponse(): Observable<CdsHooksResponse> {
    return this.nextInstance().pipe(
      switchMap(instance => instance == null ? of(null) : this.getResponse(instance))
    );
  }

  abortAll(): void {
    const s: Subscription = this.httpClient.get(`../../abort/${this.handle}`).subscribe(_ => s.unsubscribe());
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
