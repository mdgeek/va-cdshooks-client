import {AfterViewInit, Component} from '@angular/core';
import {ProxyClient} from './proxy-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {

  response: string;

  constructor(private readonly proxyClient: ProxyClient) {
  }

  ngAfterViewInit(): void {
    this.proxyClient.nextResponse().subscribe(r => {
      this.response = JSON.stringify(r,null,2);
    })
  }
}
