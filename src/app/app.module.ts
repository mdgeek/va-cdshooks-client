import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule, Routes} from '@angular/router';
import {ShowdownModule} from 'ngx-showdown';
import {MatTabsModule} from '@angular/material/tabs';
import {ResponseContainerComponent} from './response-container.component';
import {CardContainerComponent} from './card-container.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {PollingComponent} from './polling.component';

const routes: Routes = [
  {path: '**', component: AppComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    ResponseContainerComponent,
    CardContainerComponent,
    PollingComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    ShowdownModule,
    RouterModule.forRoot(routes),
    MatTabsModule,
    MatTooltipModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule
  ],
  exports: [
    RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
