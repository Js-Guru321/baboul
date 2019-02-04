import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import { NbLayoutModule, NbSidebarModule, NbThemeModule, NbChatModule, NbPopoverModule, NbInfiniteListDirective,  NbCheckboxModule,  NbTabsetModule, NbAccordionModule, NbAlertModule, NbUserModule, NbListModule, NbMenuModule, NbSpinnerModule, NbCardModule, NbActionsModule, NbButtonModule } from '@nebular/theme';
import {BaboulPipeModule} from '../pipe/baboul-pipe/baboul-pipe.module';
import {LoginModule} from '../login/login.module';
import {LoginModalService} from '../login/login-modal.service';


const THEMEMODULE = [
  NbSpinnerModule,
  NbButtonModule,
  NbPopoverModule,
  NbAccordionModule,
  NbAlertModule,
  NbUserModule,
  NbMenuModule,
  NbTabsetModule,
  NbLayoutModule,
  NbCardModule,
  NbActionsModule,
  NbListModule,
  NbCheckboxModule,
  NbSidebarModule,
  NbChatModule.forRoot({
    messageGoogleMapKey: 'AIzaSyCpId7NUs0tR1jYJWQYeH0_aj6y2aOygI8',
  })
];


@NgModule({
  imports: [
    CommonModule,
    ...THEMEMODULE,
    BaboulPipeModule,
    LoginModule,
  ],
  declarations: [ChatComponent],
  exports: [ChatComponent]
})
export class ChatModule { }
