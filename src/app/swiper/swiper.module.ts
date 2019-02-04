import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwiperPageComponent } from './swiper.component';
import { RouterModule } from '@angular/router';
import { routes } from './swiper.routing';
import {SearchModule} from '../search/search.module';
import {THEMEMODULE} from '../app.module';
import { ArrayPipesModule} from 'ngx-custom-pipes';


import {FooterModule} from '../footer/footer.module'


import { SwiperModule, SwiperConfigInterface,
  SWIPER_CONFIG } from 'ngx-swiper-wrapper';

@NgModule({
  imports: [
    CommonModule,
      RouterModule.forChild(routes),
      SwiperModule,
      SearchModule,
      THEMEMODULE,
      ArrayPipesModule,
      FooterModule
  ],
  declarations: [SwiperPageComponent]
})
export class SwiperPageModule { }
