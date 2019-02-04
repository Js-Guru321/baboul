import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FollowPromoButtonComponent} from './follow-promo-button.component';
import {THEMEMODULE} from '../app.module';

@NgModule({
  imports: [
    CommonModule,
    ...THEMEMODULE
  ],
  declarations: [FollowPromoButtonComponent],
  exports: [FollowPromoButtonComponent]
})
export class FollowPromoButtonModule { }
