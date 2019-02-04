import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {
  NbAccordionModule, NbActionsModule,
  NbAlertModule,
  NbButtonModule, NbCardModule, NbChatModule, NbCheckboxModule,  NbLayoutModule, NbListModule,
  NbMenuModule,
  NbPopoverModule, NbSidebarModule,
  NbSpinnerModule, NbTabsetModule,
  NbUserModule
} from '@nebular/theme';
import {LazyLoadImageModule} from 'ng-lazyload-image';
import {TooltipModule} from 'ngx-bootstrap';
import {AuthServiceConfig, SocialLoginModule} from 'angularx-social-login';
import {getSocialAuthServiceConfigs} from '../social.constant';
import {TempPromoModalComponent} from './temp-promo-modal.component';
import {LoginModalService} from '../login/login-modal.service';

const ENTRY_COMPONENTS = [
  TempPromoModalComponent
];

const DECLARATIONS = [
  ...ENTRY_COMPONENTS,
];

const EXPORTS = [
  ...ENTRY_COMPONENTS,
];

const PROVIDERS = [
  LoginModalService
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NbSpinnerModule,
    NbButtonModule,
    NbPopoverModule,
    NbAccordionModule,
    NbAlertModule,
    NbUserModule,
    NbMenuModule,
    NbTabsetModule,
    NbLayoutModule,
    LazyLoadImageModule,
    NbCardModule,
    NbActionsModule,
    NbListModule,
    NbCheckboxModule,
    NbSidebarModule,
    NbChatModule,
    TooltipModule,
    SocialLoginModule,
  ],
  entryComponents: [...ENTRY_COMPONENTS],
  declarations: [...DECLARATIONS],
  exports: [...EXPORTS],
  providers: [
    {provide: AuthServiceConfig, useFactory: getSocialAuthServiceConfigs},
    ...PROVIDERS,
  ]
})
export class TempPromoModalModule { }
