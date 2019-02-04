import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {HomeComponent} from './home.component';
import { routes } from './home.routing';
import { FormsModule } from '@angular/forms';
import { ArrayPipesModule} from 'ngx-custom-pipes';
import { SwiperModule } from 'ngx-swiper-wrapper';
import {SearchModule} from '../search/search.module';
import {FooterModule} from '../footer/footer.module';
import {THEMEMODULE} from '../app.module';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import {FollowButtonModule} from '../follow-button/follow-button.module';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import { LazyLoadImageModule } from 'ng-lazyload-image';

const ENTRY_COMPONENTS = [
];

const DECLARATIONS = [
  ...ENTRY_COMPONENTS,
];

@NgModule({
  imports: [
    CommonModule,
    SwiperModule,
    FormsModule,
    LazyLoadImageModule,
    RouterModule.forChild(routes),
    ...THEMEMODULE,
    ArrayPipesModule,
    SelectDropDownModule,
    SearchModule,
    FooterModule,
    FollowButtonModule,
    TooltipModule.forRoot(),
    // ChatModule
  ],
  declarations: [HomeComponent, ...DECLARATIONS],
  entryComponents: [...ENTRY_COMPONENTS],
  exports: [HomeComponent],
  providers: []

})
export class HomeModule { }
