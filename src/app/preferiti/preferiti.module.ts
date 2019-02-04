import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PreferitiComponent} from './preferiti.component';
import {RouterModule} from '@angular/router';
import {routes} from './preferiti.routing';
import {THEMEMODULE} from '../app.module';
import {FooterModule} from '../footer/footer.module';
import {BootstrapModalModule} from 'ng6-bootstrap-modal';
import {FollowButtonModule} from '../follow-button/follow-button.module';
import {BaboulPipeModule} from '../pipe/baboul-pipe/baboul-pipe.module';
import {LazyLoadImageModule} from 'ng-lazyload-image';
import {LoginModule} from '../login/login.module';
import {FollowPromoButtonModule} from '../follow-promo-button/follow-promo-button.module';

@NgModule({
  imports: [
    CommonModule,
    LazyLoadImageModule,
    RouterModule.forChild(routes),
    ...THEMEMODULE,
    FooterModule,
    BootstrapModalModule.forRoot({container: document.body}),
    LoginModule,
    FollowButtonModule,
    FollowPromoButtonModule,
    BaboulPipeModule,
  ],
  declarations: [PreferitiComponent],
  // exports:
})
export class PreferitiModule { }
