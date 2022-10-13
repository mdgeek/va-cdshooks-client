import {AfterViewInit, Component} from '@angular/core';
import {ProxyClient} from './proxy-client';
import {CdsHooksResponse} from './cds-hooks.protocol';
import {noop} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {

  status: string = 'Processing CDSHooks trigger...';

  constructor(private readonly proxyClient: ProxyClient) {
  }

  ngAfterViewInit(): void {
    this.proxyClient.nextResponse().subscribe({
      next: r => this.processResponse(r),
      complete: () => this.close(),
      error: e => this.close()
    });
  }

  private processResponse(response: CdsHooksResponse): void {
    if (response == null) {
      this.close();
    }

    this.status = JSON.stringify(response, null, 2);
  }

  private close(): void {
    this.proxyClient.noclose ? noop() : window.close();
  }
}
