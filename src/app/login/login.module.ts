import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {LoginModalComponent} from './login-modal.component';
import {RegistrazioneModalComponent} from './registrazione-modal.component';
import {RecoverModalComponent} from './recover-modal.component';
import {
    NbAccordionModule, NbActionsModule,
    NbAlertModule,
    NbButtonModule, NbCardModule, NbChatModule, NbCheckboxModule, NbLayoutModule, NbListModule,
    NbMenuModule,
    NbPopoverModule, NbRadioModule, NbSidebarModule,
    NbSpinnerModule, NbTabsetModule,
    NbUserModule
} from '@nebular/theme';
import {LazyLoadImageModule} from 'ng-lazyload-image';
import {TooltipModule} from 'ngx-bootstrap';
import {InitialModalComponent} from './initial-modal.component';
import {AuthServiceConfig, SocialLoginModule} from 'angularx-social-login';
import {getSocialAuthServiceConfigs} from '../social.constant';
import {LoginModalService} from './login-modal.service';

const ENTRY_COMPONENTS = [
  LoginModalComponent,
  RegistrazioneModalComponent,
  RecoverModalComponent,
  InitialModalComponent,
];

const DECLARATIONS = [
  ...ENTRY_COMPONENTS,
];

const EXPORTS = [
  ...ENTRY_COMPONENTS,
];

const PROVIDERS = [
  LoginModalService,
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
    NbRadioModule
  ],
  entryComponents: [...ENTRY_COMPONENTS],
  declarations: [...DECLARATIONS],
  exports: [...EXPORTS],
  providers: [
    {provide: AuthServiceConfig, useFactory: getSocialAuthServiceConfigs},
    ...PROVIDERS,
  ]
})
export class LoginModule { }
