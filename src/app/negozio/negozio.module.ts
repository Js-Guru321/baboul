import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NegozioComponent } from './negozio.component';
import { NegozioBaseComponent } from './negozio-base.component';
import { LightboxComponent } from './lightbox.component';
import {THEMEMODULE} from '../app.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { routes } from './negozio.routing';
import {ArrayPipesModule, CustomPipesModule} from 'ngx-custom-pipes';
import {FooterModule} from '../footer/footer.module';
import { NguiMapModule} from '@ngui/map';
import { GalleryModule } from '@ngx-gallery/core';
import { BootstrapModalModule } from 'ng6-bootstrap-modal';
import {FollowButtonModule} from '../follow-button/follow-button.module';
import {NgxPaginationModule} from 'ngx-pagination';
import {BaboulPipeModule} from '../pipe/baboul-pipe/baboul-pipe.module';
import { SottocategoriePopupComponent } from './sottocategorie-popup/sottocategorie-popup.component';
import {LazyLoadImageModule} from 'ng-lazyload-image';
import {SwiperModule, SwiperConfigInterface, SWIPER_CONFIG} from 'ngx-swiper-wrapper';
import {FollowPromoButtonModule} from '../follow-promo-button/follow-promo-button.module';

const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  slidesPerView: 1
};

@NgModule({
  imports: [
    CustomPipesModule,
    FormsModule,
    GalleryModule.forRoot(),
    CommonModule,
    NguiMapModule.forRoot({apiUrl: 'https://maps.google.com/maps/api/js?key=AIzaSyCpId7NUs0tR1jYJWQYeH0_aj6y2aOygI8&v=3'}),
    ...THEMEMODULE,
    RouterModule.forChild(routes),
    NgxPaginationModule,
    FooterModule,
    BootstrapModalModule.forRoot({container: document.body}),
    FollowButtonModule,
    BaboulPipeModule,
    SwiperModule,
    LazyLoadImageModule,
    FollowPromoButtonModule,
  ],
  declarations: [
    NegozioComponent,
    NegozioBaseComponent,
    LightboxComponent,
    SottocategoriePopupComponent
  ],
  entryComponents: [LightboxComponent, SottocategoriePopupComponent],
  providers: [
    {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG
    }
  ]
})
export class NegozioModule { }
