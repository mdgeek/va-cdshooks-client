import {AfterViewInit, Component, Input, ViewEncapsulation} from '@angular/core';
import {CdsHooksResponse} from './cds-hooks.protocol';
import {ProxyClient} from './proxy-client';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'cdshooks-response',
  templateUrl: './response-container.component.html',
  styleUrls: ['./response-container.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ResponseContainerComponent implements AfterViewInit {

  @Input()
  response: CdsHooksResponse;

  constructor(
    private readonly proxyClient: ProxyClient,
    private readonly title: Title) {
  }

  ngAfterViewInit(): void {
    const instanceHandle = {
      hookId: this.proxyClient.getParameter('hookId'),
      hookInstance: this.proxyClient.getParameter('instance')
    }

    this.title.setTitle(instanceHandle.hookId);
    this.proxyClient.getResponse(instanceHandle).subscribe(r => this.response = r);
  }

}
