import {AfterViewInit, Component, ViewEncapsulation} from '@angular/core';
import {InstanceHandle, ProxyClient} from './proxy-client';
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

  private processInstance(instance: InstanceHandle): void {
    if (instance == null) {
      this.close();
      return;
    }

    if (instance.hookInstance == null) {
      return;
    }

    this.status = `Processing response ${instance}...`;
    this.count++;
    window.localStorage.setItem(instance.hookInstance, JSON.stringify(this.proxyClient.createSessionParams(instance)));
    window.open(`./?session=${instance.hookInstance}`, instance.hookId);
  }

  private close(): void {
    this.status = `Finished processing ${this.count} response(s).`;
    this.proxyClient.debug ? noop() : window.close();
  }

}
