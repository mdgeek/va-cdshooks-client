import {Component} from '@angular/core';
import {ProxyClient} from './proxy-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(proxyClient: ProxyClient) {
  }
}
