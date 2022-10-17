import {AfterViewInit, Component, ViewEncapsulation} from '@angular/core';
import {ProxyClient} from './proxy-client';
import {noop} from 'rxjs';

@Component({
  selector: 'cdshooks-polling',
  templateUrl: './polling.component.html',
  styleUrls: ['./polling.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PollingComponent implements AfterViewInit {

  status: string = 'Processing CDSHooks trigger...';

  count: number = 0;

  constructor(private readonly proxyClient: ProxyClient) {
  }

  ngAfterViewInit(): void {
    this.proxyClient.nextInstance().subscribe({
      next: r => this.processInstance(r),
      complete: () => this.close(),
      error: e => this.close()
    });
  }

  private processInstance(instance: string): void {
    if (instance == null) {
      this.close();
      return;
    }

    if (instance.length === 0) {
      return;
    }

    this.status = `Processing response ${instance}...`;
    this.count++;
    window.localStorage.setItem(instance, JSON.stringify(this.proxyClient.createSessionParams(instance)));
    window.open(`./?session=${instance}`, instance);
  }

  private close(): void {
    this.status = `Finished processing ${this.count} response(s).`;
    this.proxyClient.debug ? noop() : window.close();
  }

}
