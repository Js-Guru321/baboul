import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent} from './footer.component'

import {NbLayoutModule, NbThemeModule, NbInfiniteListDirective, NbCheckboxModule,  NbTabsetModule, NbAccordionModule, NbAlertModule, NbUserModule, NbListModule, NbMenuModule, NbSpinnerModule, NbCardModule, NbActionsModule, NbButtonModule } from '@nebular/theme';
import {RouterModule} from '@angular/router';
const THEMEMODULE = [
  NbSpinnerModule,
  NbButtonModule,
  NbAccordionModule,
  NbAlertModule,
  NbUserModule,
  NbMenuModule,
  NbTabsetModule,
  NbLayoutModule,
  NbCardModule,
  NbActionsModule,
  NbListModule,
  NbCheckboxModule
];
@NgModule({
  imports: [
    CommonModule,
    ...THEMEMODULE,
    RouterModule,
  ],
  declarations: [FooterComponent],
  exports: [FooterComponent],
  providers: []

})
export class FooterModule { }
