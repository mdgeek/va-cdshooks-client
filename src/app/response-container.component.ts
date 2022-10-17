import {Component, Input} from '@angular/core';
import {CdsHooksResponse} from './cds-hooks.protocol';

@Component({
  selector: 'cdshooks-response',
  templateUrl: './response-container.component.html',
  styleUrls: ['./response-container.component.css']
})
export class ResponseContainerComponent {

  @Input()
  response: CdsHooksResponse;


}
