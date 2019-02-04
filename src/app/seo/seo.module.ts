import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ObjectToArrayFilterPipe, SeoComponent} from './seo.component';
import {routes} from './seo.routing';
import { ArrayPipesModule} from 'ngx-custom-pipes';
import {THEMEMODULE} from '../app.module';
import {FollowButtonModule} from '../follow-button/follow-button.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ...THEMEMODULE,
    ArrayPipesModule,
    FollowButtonModule
  ],
  declarations: [SeoComponent, ObjectToArrayFilterPipe],
  exports: [SeoComponent]
})
export class SeoModule {
}
