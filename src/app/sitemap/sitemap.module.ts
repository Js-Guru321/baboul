import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {SitemapComponent} from './sitemap.component';
import {routes} from './sitemap.routing';
import {ArrayPipesModule} from 'ngx-custom-pipes';
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
  declarations: [SitemapComponent],
  exports: [SitemapComponent]
})
export class SitemapModule {
}
