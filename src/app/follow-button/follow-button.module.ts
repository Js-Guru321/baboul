import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button.component';
import {THEMEMODULE} from '../app.module';
@NgModule({
  imports: [
    CommonModule,
    ...THEMEMODULE
  ],
  declarations: [ButtonComponent],
  exports: [ButtonComponent]
})
export class FollowButtonModule { }
