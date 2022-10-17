import {AfterViewInit, Component, Input, ViewEncapsulation} from '@angular/core';
import {CdsHooksResponse} from './cds-hooks.protocol';
import {ProxyClient} from './proxy-client';

@Component({
  selector: 'cdshooks-response',
  templateUrl: './response-container.component.html',
  styleUrls: ['./response-container.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ResponseContainerComponent implements AfterViewInit {

  @Input()
  response: CdsHooksResponse;

  constructor(private readonly proxyClient: ProxyClient) {
  }

  ngAfterViewInit(): void {
    this.proxyClient.getResponse(this.proxyClient.getParameter('instance')).subscribe(r => this.response = r);
  }

}
