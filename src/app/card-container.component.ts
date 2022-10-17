import {Component, Input} from '@angular/core';
import {CdsHooksAction, CdsHooksCard, CdsHooksLink, CdsHooksResponse} from './cds-hooks.protocol';

@Component({
  selector: 'cdshooks-card',
  templateUrl: './card-container.component.html',
  styleUrls: ['./card-container.component.css']
})
export class CardContainerComponent {

  displayedColumns: string[] = ['Recommended', 'Description', 'Actions'];

  @Input()
  card: CdsHooksCard;


  smartLaunch(link: CdsHooksLink) {
    window.open(link.url);
  }

  onActionClick(action: CdsHooksAction<any>) {

  }
}
