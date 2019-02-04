import {
    Component,
    HostListener,
    Inject,
    OnInit,
    AfterViewInit,
    ViewChild,
    OnDestroy,
    AfterViewChecked,
    AfterContentInit, ElementRef
} from '@angular/core';
import {NbMenuItem, NbMenuService, NbSidebarService} from '@nebular/theme';
import {DialogService} from 'ng6-bootstrap-modal';
import {filter, map, tap} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {UserService} from './api/user.service';
import {HeaderService} from './api/header.service';
import {ActivatedRoute, Router, NavigationEnd} from '@angular/router';
import {SearchComponent} from './search/search.component';
import {NbMediaBreakpointsService} from '@nebular/theme';
import {LanguageService} from './api/language.service';
import {ChatComponent} from './chat/chat.component';
import {RegistrazioneModalComponent} from './login/registrazione-modal.component';
import {LoginModalComponent} from './login/login-modal.component';
import {Gtag} from 'angular-gtag';
import {Angulartics2} from 'angulartics2';
import {Angulartics2Facebook} from 'angulartics2/facebook';
import {InitialModalComponent} from './login/initial-modal.component';
import {AppService, ScreenSize} from './app.service';
import {TempPromoBannerComponent} from './temp-promo-banner/tempPromoBanner.component';
import {TempPromoModalComponent} from './temp-promo-dialog/temp-promo-modal.component';
import * as moment from 'moment';
import {DOCUMENT, LOCAL_STORAGE, WINDOW} from './api/window.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit, AfterContentInit {

  @ViewChild('chat', {read: ChatComponent}) chat: ChatComponent;

  title = 'baboul';
  lSubscription: Subscription;
  hSubscription: Subscription;
  index: any;
  user: any;

  skipHeaders: any[] = ['no-loader-header'];

  items = [
    {
      title: ''
    },
    {
      title: 'ESCI',
      link: '/logout',
    },
  ];

  sidebarMenuItems: any[] = [];

  sidebarFooterMenuItems: NbMenuItem[] = [
    {
      title: 'LINGUA',
      group: true,
    },
    {
      title: 'ITALIANO',
      link: '',
    },
    {
      title: 'ENGLISH',
      link: '',
    },
  ];

  sidebarUserMenuItems: any[] = [
    {
      title: 'Profile',
      link: '/profile',
    }
  ];

  type: string = undefined;

  isMobileScreen = false;
  isTabletScreen = false;
  isDesktopScreen = false;

  showTempPromoPopup = true;
  showTempPromoBanner = false;

  POPUPSHOWED = 'popupShowed';
  POPUPTIMESTAMP = 'popupTimestamp';
  MODALOPEN = 'modal-open';

  currentPage: string = null;

  constructor(private router: Router,
              private dialogService: DialogService,
              private nbMenuService: NbMenuService,
              @Inject(WINDOW) private window: Window,
              @Inject(DOCUMENT) private document: Document,
              @Inject(LOCAL_STORAGE) private localStorage: Storage,
              private userService: UserService,
              private headerService: HeaderService,
              private sidebarService: NbSidebarService,
              private route: ActivatedRoute,
              private mediaService: NbMediaBreakpointsService,
              private langService: LanguageService,
              private gtag: Gtag,
              private angulartics2: Angulartics2,
              private appService: AppService) {

      this.router.events.pipe(
        filter((event) => event instanceof NavigationEnd),
      ).subscribe(
        x => {
        this.reloadUserMenu();
        });
    // this.user=(localStorage.getItem('utente'))?JSON.parse(localStorage.getItem('utente')) : null
    // this.angulartics2.eventTrack.next({
    //   action: 'PageView',
    //   properties: { },
    // });

    const currentUrl = this.document.location.href;
    this.currentPage = currentUrl.split('/')[3];
    if (this.localStorage.getItem('utente') != '') {
        this.user = JSON.parse(this.localStorage.getItem('utente'));
        this.userService.getUser().subscribe(user => {
            if (user != null) {
                this.user = user;
            } else {
                this.user = null;
            }
            this.reloadSidebar();
            this.reloadUserMenu();
        });
    }

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

      // adapt marginBottom
      const nbLayout: HTMLElement = this.document.querySelector ('#mainLayout div');
      const tempPromoBanner = this.document.querySelector('#tempPromoBanner');
      const chatButton: HTMLElement = this.document.querySelector('#chatButton');
      if (tempPromoBanner != null) {
        if (tempPromoBanner.children.length > 0) {
            let bannerHeight = tempPromoBanner.children[0].clientHeight;
            if (bannerHeight === 0) {
                const img = new Image();
                img.onload = function() {
                    const height = img.height;
                    const width = img.width;
                    const ratio = height / width;
                    bannerHeight = ss.size.width * ratio;

                    nbLayout.style.marginBottom = bannerHeight + 'px';
                    (chatButton.children[1] as HTMLElement).style.bottom = 30 + bannerHeight + 'px';
                }
                if (this.isMobileScreen){
                    img.src = 'assets/images/natale/banner-mobile.jpg';
                } else if (this.isTabletScreen) {
                    img.src = 'assets/images/natale/banner-tablet.jpg';
                } else {
                    img.src = 'assets/images/natale/banner-desktop.jpg';
                }
            } else {
                // console.log(bannerHeight + ' height');
                nbLayout.style.marginBottom = bannerHeight + 'px';
                (chatButton.children[1] as HTMLElement).style.bottom = 30 + bannerHeight + 'px';
            }
        }
      }
    });

    this.hSubscription = this.headerService.getIndex().subscribe(index => {
        this.index = index;
    });
  }

  // @HostListener('window:resize', ['$event'])
  // onResize(event) {
  //   // console.log(event.target.innerWidth); // window width
  //   // console.log(this.mediaService.getBreakpoints());
  //   const _w = event && event.target ? event.target.innerWidth : this.window.innerWidth;
  //   if (_w >= this.mediaService.getByName('lg').width) {
  //     // console.log('Large screen');
  //     this.isMobileScreen = false;
  //     this.sidebarService.collapse('mainSidebar');
  //   } else {
  //     // console.log('Small screen');
  //     this.isMobileScreen = true;
  //   }
  //
  //   if (this.isMobileScreen) {
  //     this.document.body.classList.add('app-mobile');
  //   } else {
  //     this.document.body.classList.remove('app-mobile');
  //   }
  // }



  reloadUserMenu() {
    const _m: any[] = this.items;
    if (this.user) {
      _m[0].title = `${this.user.nome} ${this.user.cognome}`;
    } else {
      _m[0].title = '';
    }

    this.items = [..._m];
  }

  reloadSidebar() {
    const _m: any[] = [
      {
        title: 'MENU',
        group: true,
      },
      {
        title: 'Store Locator',
        // link: '/home/locator',
      },
      {
        title: 'Vetrina',
        // link: '/vetrina',
      },
        {
            title: 'Sconti',
        }
    ];

    if (this.user) {
      _m.push({
        title: 'Preferiti',
        // link: '/preferiti',
      });
    }

    _m.push(
      {
        title: 'Blog (coming soon)',
        // link: '/0',
      },
      {
        title: 'Chat con Baboul',
        // link: '/chat',
      },
    );

    if (this.user) {
      _m.push({
        title: 'Esci',
        // link: '/logout',
      });
    } else {
      _m.push({
          title: 'Accedi',
          // link: '/home/accedi',
        },
        {
          title: 'Registrati',
          // link: '/home/registrati',
        },
      );
    }

    _m.push({
      title: 'Scarica l\'App',
      url: 'items',
      target: '_blank',
    });

    this.sidebarMenuItems = [..._m];
  }

  toggle() {
    this.sidebarService.toggle(false, 'mainSidebar');
    return false;
  }


  ngOnInit() {
    this.appService.requestUpdateScreenSize();

    // this.isMobileScreen = this.appService.getCurrentScreenSize().mobile;

    this.reloadSidebar();

    this.nbMenuService.onItemClick()
     .subscribe((bag) => {
       console.log('Clicked ', bag.tag);

       if (bag.tag === 'mainSidebarMenu') {
         console.log('Item:', bag.item);
         switch (bag.item.title) {
           case 'Store Locator':
             this.router.navigate(['/home', 'locator']);
             break;
           case 'Vetrina':
             this.router.navigate(['/vetrina']);
             break;
             case 'Sconti':
                 this.campaignAction();
                 break;
           case 'Preferiti':
             this.router.navigate(['/preferiti']);
             break;
           case 'Accedi':
             this.showInitial();
             break;
           case 'Registrati':
             this.showRegistrazione();
             break;
           case 'Esci':
             this.router.navigate(['/logout']);
             break;
           case 'Chat con Baboul':
             this.chat.toggle();
             break;
         }
         this.sidebarService.collapse('mainSidebar');
       }
       // if (title === 'Logout') {
       //   this.userService.clearUser();
       // }
     });

    // this.nbMenuService.onItemClick()
    //   .pipe(
    //     map((menuBag) => {
    //       console.log('Clicked item: ', menuBag);
    //       return menuBag;
    //     }),
    //     filter(({ tag, item }) => tag === 'mainSidebarMenu'),
    //   )
    //   .subscribe((menu: {item: NbMenuItem, tag: string}) => {
    //
    //   });

     if (this.localStorage.getItem('utente')) {
       this.userService.setUser(JSON.parse(this.localStorage.getItem('utente')));
     }

     const popupShowed = this.localStorage.getItem(this.POPUPSHOWED);
     const popupTimestamp = this.localStorage.getItem(this.POPUPTIMESTAMP);
     if (!JSON.parse(popupShowed)) {
         this.localStorage.setItem(this.POPUPTIMESTAMP, moment().toISOString());
         if (this.currentPage != null && (this.currentPage.toLocaleLowerCase() === 'home' || this.currentPage.toLocaleLowerCase() === '')) {
             this.showTempPromo();
         } else {
             this.showTempPromoBanner = true;
         }
     } else {
         if (popupTimestamp) {
           if (moment().diff(moment(popupTimestamp), 'd') > 0) {
               this.localStorage.setItem(this.POPUPSHOWED, 'false');
               this.localStorage.setItem(this.POPUPTIMESTAMP, moment().toISOString());
               if (this.currentPage != null && (this.currentPage.toLocaleLowerCase() === 'home' || this.currentPage.toLocaleLowerCase() === '')) {
                   this.showTempPromo();
               } else {
                   this.showTempPromoBanner = true;
               }
           } else {
               this.showTempPromoBanner = true;
           }
         } else {
             this.showTempPromoBanner = true;
         }
     }
  }

  // changeCarousel(index) {
  //   this.router.navigate(['home', this.carouselItems[index]]);
  //   setTimeout(() => this.headerService.setIndex(index), 100);
  // }

  showLogin() {
    const disposable = this.dialogService.addDialog(LoginModalComponent, {});
  }

  showRegistrazione() {
    return this.router.navigateByUrl('/registrazione');
    // const disposable = this.dialogService.addDialog(RegistrazioneModalComponent, {campaignAction: this.campaignAction.bind(this)});
  }

  showInitial() {
    const disposable = this.dialogService.addDialog(InitialModalComponent, {});
  }

  goToHome() {
    return this.router.navigateByUrl('home');
  }

  ngAfterViewInit(): void {
    this.sidebarService.collapse('mainSidebar');
  }

  setLanguage(lang: string) {
    this.langService.language(lang);
  }

  ngAfterContentInit(): void {
  }

  showTempPromo() {
    this.document.body.classList.add(this.MODALOPEN);
    const disposable = this.dialogService.addDialog(TempPromoModalComponent, {campaignAction: this.campaignAction.bind(this)}, {closeByClickingOutside: true});
    disposable.subscribe(() => {
      this.document.body.classList.remove(this.MODALOPEN);
      this.appService.requestUpdateScreenSize();
      this.showTempPromoBanner = true;
      this.appService.requestUpdateScreenSize();
    });
  }
  public redirectAfterRegistration(): void {

  }
  public campaignAction(): void  {
    if (this.user) {
        this.openLandingPage();
    } else {
        this.showRegistrazione();
    }
  }
  private openLandingPage(): void {
      this.localStorage.setItem(this.POPUPSHOWED, 'true');
      this.window.location.href = 'http://baboul.it/sconti';
  }
  // onCloseTempPromo(parent) {
  //   parent.showTempPromoBanner = true;
  // }
}
