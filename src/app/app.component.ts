import {AfterViewInit, Component} from '@angular/core';
import {ProxyClient} from './proxy-client';
import {CdsHooksResponse} from './cds-hooks.protocol';

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
      complete: () => window.close(),
      error: e => this.status = e
    });
  }

  private processResponse(response: CdsHooksResponse): void {
    if (response == null) {
      window.close();
    }

    this.status = JSON.stringify(response, null, 2);
  }
}
