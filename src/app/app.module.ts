import { NgtUniversalModule } from '@ng-toolkit/universal';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF , CommonModule} from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import {WINDOW_PROVIDERS} from './api/window.service';
import { HttpClientModule } from '@angular/common/http';
import {HashLocationStrategy, Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { routes } from './app.routes';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import {
  NbLayoutModule,
  NbSidebarModule,
  NbThemeModule,
  NbChatModule,
  NbPopoverModule,
  NbInfiniteListDirective,
  NbCheckboxModule,
  NbTabsetModule,
  NbAccordionModule,
  NbAlertModule,
  NbUserModule,
  NbListModule,
  NbMenuModule,
  NbContextMenuModule,
  NbMenuService,
  NbSpinnerModule,
  NbCardModule,
  NbActionsModule,
  NbButtonModule
} from '@nebular/theme';
import {HeaderModule} from './header/header.module';
import {SearchModule} from './search/search.module';
import {ApiModule} from './api/api.module';
// import { GalleryModule } from  '@ngx-gallery/core';
import { NguiMapModule} from '@ngui/map';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { SWIPER_CONFIG,
  SwiperAutoplayInterface, SwiperBreakpointsInterface,
  SwiperPaginationInterface, SwiperScrollbarInterface } from 'ngx-swiper-wrapper';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { BootstrapModalModule } from 'ng6-bootstrap-modal';
import { LoginModule } from './login/login.module';

// import {ArrayFilterPipe } from './api/array-pipe-filterBy.pipe';
import {FooterModule} from './footer/footer.module';
import {ChatModule} from './chat/chat.module';
import {TooltipModule} from 'ngx-bootstrap';
import {BaboulPipeModule} from './pipe/baboul-pipe/baboul-pipe.module';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import {SocialLoginModule, AuthServiceConfig} from 'angularx-social-login';
import {getSocialAuthServiceConfigs} from './social.constant';
import {GtagModule} from 'angular-gtag';
import {GTAG_ID} from './analytics.constant';
import {Angulartics2Facebook} from 'angulartics2/facebook';
import {Angulartics2Module} from 'angulartics2';
import {AppService} from './app.service';
import {TempPromoBannerComponent} from './temp-promo-banner/tempPromoBanner.component';
import {TempPromoBannerModule} from './temp-promo-banner/tempPromoBanner.module';
import {TempPromoModalComponent} from './temp-promo-dialog/temp-promo-modal.component';
import {TempPromoModalModule} from './temp-promo-dialog/temp-promo-modal.module';
import {RegistrazioneModule} from './registrazione/registrazione.module';
import {CustomPipesModule} from 'ngx-custom-pipes';

const autoplay: SwiperAutoplayInterface = {
  delay: 7000,
  disableOnInteraction: true
};

const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  slidesPerView: 'auto',
  autoplay: autoplay,
};

export interface AppConfig {
  BASE_URL: string;
}

export const APPCONFIG: AppConfig = {
  BASE_URL: '/shopadvisor',
};

export const THEMEMODULE = [
  NbSpinnerModule,
  NbButtonModule,
  NbPopoverModule,
  NbAccordionModule,
  NbAlertModule,
  NbUserModule,
  NbMenuModule,
  NbTabsetModule,
  NbLayoutModule,
  LazyLoadImageModule,
  NbCardModule,
  NbActionsModule,
  NbContextMenuModule,
  NbListModule,
  NbCheckboxModule,
  NbSidebarModule,
  NbChatModule,
  TooltipModule
];

@NgModule({
  declarations: [
    AppComponent,
    // ArrayFilterPipe
  ],
  imports: [
    CustomPipesModule,
    ApiModule,
    NguiMapModule.forRoot({apiUrl: 'https://maps.google.com/maps/api/js?key=AIzaSyCpId7NUs0tR1jYJWQYeH0_aj6y2aOygI8&v=3'}),
    HttpClientModule,
    SwiperModule,
    LoginModule,
    ...THEMEMODULE,
    NgHttpLoaderModule,
    BrowserModule,
    HeaderModule,
    SearchModule,
    BrowserAnimationsModule,
    HttpClientModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BootstrapModalModule.forRoot({container: document.querySelector('body > app-root') as HTMLElement}),
    NbThemeModule.forRoot({ name: 'dark' }),
    NbMenuModule.forRoot(),
    NbSidebarModule.forRoot(),
    FooterModule,
    ChatModule,
    TempPromoBannerModule,
    TempPromoModalModule,
    TooltipModule.forRoot(),
    BaboulPipeModule,
    SocialLoginModule,
    GtagModule.forRoot({ trackingId: GTAG_ID, trackPageviews: true, debug: true }),
    Angulartics2Module.forRoot([Angulartics2Facebook], {
      developerMode: false,
    }),
  ],
  providers: [
    ...WINDOW_PROVIDERS,
    NbMenuService,
    AppService,
    {provide: SWIPER_CONFIG, useValue: DEFAULT_SWIPER_CONFIG},
    {provide: 'APP_CONFIG_TOKEN', useValue: APPCONFIG},
    {provide: APP_BASE_HREF, useValue: '/'},
    {provide: LocationStrategy, useClass: PathLocationStrategy},
    {provide: AuthServiceConfig, useFactory: getSocialAuthServiceConfigs},
  ],
  entryComponents: [ ],
  bootstrap: [AppComponent]
})
export class AppModule { }
