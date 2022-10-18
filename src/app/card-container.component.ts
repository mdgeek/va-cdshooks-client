import {Component, Input, ViewEncapsulation} from '@angular/core';
import {CdsHooksAction, CdsHooksCard, CdsHooksLink} from './cds-hooks.protocol';

@Component({
  selector: 'cdshooks-card',
  templateUrl: './card-container.component.html',
  styleUrls: ['./card-container.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CardContainerComponent {

  @Input()
  card: CdsHooksCard;


  smartLaunch(link: CdsHooksLink) {
    window.open(link.url);
  }

  onActionClick(action: CdsHooksAction<any>) {
    alert('Action was clicked.')
  }
}
