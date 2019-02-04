import {
  AfterContentChecked,
  AfterContentInit, ApplicationRef,
  Component, ComponentFactoryResolver, ContentChildren, ElementRef, EmbeddedViewRef,
  EventEmitter, Inject, Injector, OnDestroy,
  OnInit,
  Output,
  Renderer2, TemplateRef, ViewChild, ViewContainerRef,
} from '@angular/core';
import {UserService} from '../api/user.service';
import {getDeepFromObject} from '../api/helpers';
import {Utils} from '../utils';
import * as moment from 'moment';
import {DialogService} from 'ng6-bootstrap-modal';
import {Subscription} from 'rxjs';
import {LoginModalComponent} from '../login/login-modal.component';
import {LoginModalService} from '../login/login-modal.service';
import {AppService, ScreenSize} from '../app.service';
import {NbMediaBreakpointsService} from '@nebular/theme';
import {ActivatedRoute, Router} from '@angular/router';
import {DOCUMENT} from '../api/window.service';

@Component({
  selector: 'app-temp-promo-banner',
  templateUrl: './tempPromoBanner.component.html',
  styleUrls: ['./tempPromoBanner.component.sass'],
})
export class TempPromoBannerComponent implements OnInit {
  user: any;

  public isSending = false;
  private isLoading = false;

  private DEFAULT_NAME = 'Baboul';

  private userSubscription$: Subscription;

  private closeElementRef: HTMLElement = undefined;

  isMobileScreen = false;
  isTabletScreen = false;
  isDesktopScreen = false;

  constructor(private userService: UserService,
              private renderer: Renderer2,
              @Inject(DOCUMENT) private document: Document,
              private componentFactoryResolver: ComponentFactoryResolver,
              private appRef: ApplicationRef,
              private injector: Injector,
              private loginModalService: LoginModalService,
              private appService: AppService,
              private mediaService: NbMediaBreakpointsService,
              private router: Router) {

    this.userSubscription$ = this.userService.getUser().subscribe(user => {

      if (user != null) {
        this.user = user;

      } else {
        this.user = null;
      }
    });

    this.appService.onScreenResize().subscribe((ss: ScreenSize) => {
      const _w = parent.window.innerWidth;
        if (_w > this.mediaService.getByName('lg').width) {
            // console.log('Large screen');
            this.isDesktopScreen = true;
            this.isTabletScreen = false;
            this.isMobileScreen = false;
        } else if (_w >= this.mediaService.getByName('md').width) {
            // console.log('Small screen');
            this.isDesktopScreen = false;
            this.isTabletScreen = true;
            this.isMobileScreen = false;
        } else {
            this.isDesktopScreen = false;
            this.isTabletScreen = false;
            this.isMobileScreen = true;
        }
      // this.isMobileScreen = ss.mobile;
    });
  }

  ngOnInit() {
      this.appService.requestUpdateScreenSize();
  }
  bannerAction() {

  }

}
