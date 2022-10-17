import {Component, ViewEncapsulation} from '@angular/core';
import {ProxyClient} from './proxy-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {

  constructor(readonly proxyClient: ProxyClient) {
  }

}
