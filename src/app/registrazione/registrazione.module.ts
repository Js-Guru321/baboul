import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { RegistrazioneComponent } from './registrazione.component';
import { FormsModule } from '@angular/forms';
import { ArrayPipesModule} from 'ngx-custom-pipes';
import { SwiperModule } from 'ngx-swiper-wrapper';
// import {ArrayFilterPipe} from '../list/list.module';
// import {THEMEMODULE} from '../app.module';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import {NbLayoutModule, NbThemeModule, NbInfiniteListDirective, NbCheckboxModule, NbPopoverModule,  NbTabsetModule, NbAccordionModule, NbAlertModule, NbUserModule, NbListModule, NbMenuModule, NbContextMenuModule, NbMenuService, NbSpinnerModule, NbCardModule, NbActionsModule, NbButtonModule } from '@nebular/theme';
import {GtagModule} from 'angular-gtag';
import {GTAG_ID} from '../analytics.constant';
import {routes} from './registrazione.routing';
import {LoginModule} from '../login/login.module';
const THEMEMODULE = [
  NbSpinnerModule,
  NbButtonModule,
  NbAccordionModule,
  NbPopoverModule,
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
    SwiperModule,
    FormsModule,
    RouterModule.forChild(routes),
    ...THEMEMODULE,
    ArrayPipesModule,
    SelectDropDownModule,
    GtagModule.forRoot({ trackingId: GTAG_ID, trackPageviews: true, debug: true }),
    LoginModule,
  ],
  declarations: [RegistrazioneComponent],
  exports: [RegistrazioneComponent]
})
export class RegistrazioneModule { }
