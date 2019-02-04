import { NgModule } from '@angular/core';
import { LogoutComponent } from './logout.component';
import {THEMEMODULE} from '../app.module';
import {RouterModule, Routes} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: LogoutComponent
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    ...THEMEMODULE,
  ],
  declarations: [LogoutComponent],
  exports: [LogoutComponent]
})
export class LogoutModule { }
