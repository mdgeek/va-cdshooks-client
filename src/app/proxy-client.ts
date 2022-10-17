import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {filter, map, Observable, of, repeat, Subscription, switchMap, take, tap, timeout} from 'rxjs';
import {CdsHooksCard, CdsHooksResponse} from './cds-hooks.protocol';

@Injectable({providedIn: "root"})
export class ProxyClient {

  private readonly handle: string;

  private readonly proxyUrl: string;

  private readonly queryParameters: { [name: string]: string } = {};

  private readonly sessionParameters: any;

  readonly debug: boolean;

  constructor(
    private readonly httpClient: HttpClient) {
    this.parseQueryString();
    this.debug = this.queryParameters['debug'] != null;
    this.handle = this.queryParameters['handle'];
    let proxy = decodeURIComponent(this.queryParameters['proxy'] || '');
    while (proxy.endsWith('/')) proxy = proxy.substring(0, proxy.length - 1);
    this.proxyUrl = proxy + '/';
    const session = this.queryParameters['session'];

    if (session != null) {
      this.sessionParameters = JSON.parse(window.localStorage.getItem(session));
      window.localStorage.removeItem(session);
    }

    if (this.handle == null) {
      throw new Error('No handle specified in query string.')
    }
  }

  private getProxyEndpoint(path: string, ...params: string[]): string {
    params.forEach((p, i) => path = path.replace(`{${i}}`, p));
    return this.proxyUrl + path;
  }

  private parseQueryString(): void {
    const qs: string = window.location.search;
    const params: string[] = qs == null ? [] : qs.substring(1).split('&');
    params.forEach(p => {
      const nv: string[] = p.split('=', 2);
      this.queryParameters[nv[0].trim()] = nv[1]?.trim() || '';
    })
  }

  nextInstance(): Observable<string> {
    const url: string = this.getProxyEndpoint('next/{0}', this.handle);
    return this.httpClient.get(url, {
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
    const url: string = this.getProxyEndpoint('response/{0}/{1}', this.handle, instance);
    return this.httpClient.get(url, {
      observe: 'body',
      responseType: 'json'
    }).pipe(map((r: any) => {
      const resp: CdsHooksResponse = r;
      resp._hookInstance = instance;
      return resp;
    }));
  }

  nextResponse(): Observable<CdsHooksResponse> {
    return this.nextInstance().pipe(
      switchMap(instance => instance == null ? of(null) : this.getResponse(instance))
    );
  }

  abortAll(): void {
    const url: string = this.getProxyEndpoint('abort/{0}', this.handle);
    const s: Subscription = this.httpClient.get(url).subscribe(_ => s.unsubscribe());
  }

  processResponse(response: CdsHooksResponse): void {
    for (const card of response.cards || []) {
      this.processCard(card);
    }
  }

  private processCard(card: CdsHooksCard): void {
  }
}
