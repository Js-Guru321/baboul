import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VetrinaComponent } from './vetrina.component';
import {THEMEMODULE} from '../app.module';
import { routes } from './vetrina.routing';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {DropdownModule} from "ngx-dropdown";
import { SelectDropDownModule } from 'ngx-select-dropdown';
import {SearchModule} from '../search/search.module';
import {FooterModule} from '../footer/footer.module';
import {FollowButtonModule} from '../follow-button/follow-button.module';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ImgCacheModule } from 'ng-imgcache';
import {BaboulPipeModule} from '../pipe/baboul-pipe/baboul-pipe.module';
import {FollowPromoButtonModule} from '../follow-promo-button/follow-promo-button.module';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ...THEMEMODULE,
    DropdownModule,
    SelectDropDownModule,
    SearchModule,
    FooterModule,
    ImgCacheModule,
    FollowButtonModule,
    BaboulPipeModule,
    FollowPromoButtonModule,
  ],
  declarations: [VetrinaComponent]
})
export class VetrinaModule { }
