import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {filter, map, Observable, of, repeat, Subscription, switchMap, take, timeout} from 'rxjs';
import {CdsHooksResponse} from './cds-hooks.protocol';

export interface InstanceHandle {
  hookId: string;
  hookInstance: string;
}

@Injectable({providedIn: "root"})
export class ProxyClient {

  private readonly batchId: string;

  private readonly proxyUrl: string;

  private readonly parameters: { [name: string]: string } = {};

  readonly debug: boolean;

  readonly hasSession: boolean;

  constructor(
    private readonly httpClient: HttpClient) {
    this.parseQueryString();
    const session = this.parameters['session'];
    this.hasSession = session != null;

    if (this.hasSession) {
      this.parameters = JSON.parse(window.localStorage.getItem(session));
      window.localStorage.removeItem(session);
    }

    this.debug = this.parameters['debug'] != null;
    this.batchId = this.parameters['handle'];

    if (!this.hasSession && this.batchId == null) {
      throw new Error('No handle specified in query string.');
    }

    let proxy = decodeURIComponent(this.parameters['proxy'] || '');
    while (proxy.endsWith('/')) proxy = proxy.substring(0, proxy.length - 1);
    this.proxyUrl = proxy + '/';

  }

  getParameter(name: string): string {
    return this.parameters[name];
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
      this.parameters[nv[0].trim()] = nv[1]?.trim() || '';
    })
  }

  nextInstance(): Observable<InstanceHandle> {
    const url: string = this.getProxyEndpoint('next/{0}', this.batchId);
    return this.httpClient.get(url, {
      observe: 'response',
      responseType: 'json'
    }).pipe(
      repeat({delay: 500, count: 50}),
      map(r => r.ok ? <InstanceHandle> r.body : null),
      timeout(20000),
      filter(r => r != null),
      take(1)
    );
  }

  getResponse(handle: InstanceHandle): Observable<CdsHooksResponse> {
    const url: string = this.getProxyEndpoint('response/{0}/{1}', this.batchId, handle.hookInstance);
    return this.httpClient.get(url, {
      observe: 'body',
      responseType: 'json'
    }).pipe(map((r: any) => {
      const resp: CdsHooksResponse = r;
      resp._instanceHandle = handle;
      return resp;
    }));
  }

  nextResponse(): Observable<CdsHooksResponse> {
    return this.nextInstance().pipe(
      switchMap(handle => handle == null ? of(null) : this.getResponse(handle))
    );
  }

  abortAll(): void {
    const url: string = this.getProxyEndpoint('abort/{0}', this.batchId);
    const s: Subscription = this.httpClient.get(url).subscribe(_ => s.unsubscribe());
  }

  createSessionParams(instanceHandle: InstanceHandle): any {
    return {
      ...this.parameters,
      instance: instanceHandle.hookInstance,
      hookId: instanceHandle.hookId
    }
  }
}
