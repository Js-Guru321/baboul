import { Component, OnInit, Inject, ChangeDetectorRef, ViewChildren, QueryList, ElementRef } from '@angular/core';
import {UserService} from '../api/user.service';
import {PreferitiService} from '../api/preferiti.service';
import {Subscription} from 'rxjs';
import {GeolocationService} from '../api/geolocation.service';
import { SpinnerVisibilityService } from 'ng-http-loader';
import {NbMediaBreakpointsService, NbSidebarService} from '@nebular/theme';
import {AppService, ScreenSize} from '../app.service';
import {LOCAL_STORAGE, WINDOW} from '../api/window.service';

@Component({
  selector: 'app-preferiti',
templateUrl: './preferiti.component.html',
  styleUrls: ['./preferiti.component.sass']
})
export class PreferitiComponent implements OnInit {

  lSubscription: Subscription;
  user: any;
  tab = 2;
  view = 1;
  negozi: any;
  promos: any;
  loading = true;
  isMobileScreen = false;
  isTabletScreen = false;
  isDesktopScreen = false;
  idToScroll: any;

  @ViewChildren('negozioRow') divs: QueryList<ElementRef>;
  goToSubscription: Subscription = new Subscription();
  private touchTime = 0;

  constructor(@Inject(WINDOW) private window: Window,
              @Inject(LOCAL_STORAGE) private localStorage: Storage,
              private userService: UserService,
              private preferiti: PreferitiService,
              private geo: GeolocationService,
              private mediaService: NbMediaBreakpointsService,
              private sidebarService: NbSidebarService,
              private ref: ChangeDetectorRef,
              private spinner: SpinnerVisibilityService,
              private appService: AppService) {
    // const _w = window.innerWidth;
    // console.log(_w);
    // if (_w >= this.mediaService.getByName('lg').width) {
    //   // console.log('Large screen');
      // this.isMobileScreen = false;
    // } else {
    //   // console.log('Small screen');
      // this.isMobileScreen = true;
    // }
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
          // this.isMobileScreen = _w <= this.mediaService.getByName('is').width;
          // this.isMobileScreen = ss.mobile;
      });
    this.appService.requestUpdateScreenSize();

    this.spinner.show();

    if (this.localStorage.getItem('utente') !== '' ) {
      this.user = JSON.parse(this.localStorage.getItem('utente'));
      this.reloadPromos();

    } else {
      this.spinner.hide();
    }

  }
  private getNegoziPreferiti(position?: any) {
      let _params;
      if (position) {
          _params = {
              latitudine: position.coords.latitude,
              longitudine: position.coords.longitude,
          };
      }
      this.preferiti.getNegoziPreferiti(this.user.token, _params).subscribe((res) => {
          this.negozi = res.negoziList;
          this.negozi.forEach((negozio) => {
              if (negozio.urls) {
                  negozio.urls.forEach((urls) => {
                      negozio[urls.tipo] = this.addHttp(urls.url);
                  });
              }
          });
          console.log(this.negozi);
      }, (error) => {

      }, () => {
          this.getPromosPreferiti(position);
      });
  }
  private getPromosPreferiti(position?: any) {
    this.ref.detectChanges();
    this.loading = false;
    let _params;
    if (position) {
      _params = {
        latitudine: position.coords.latitude,
        longitudine: position.coords.longitude,
      };
    }

    this.preferiti.getPromosPreferiti(this.user.token, _params).subscribe((res) => {
      this.promos = res.promos;
      console.log(`Promos with${position ? '' : 'out'} position`, this.promos, position);
    }, (error) => {
      console.log('Error while getting preferiti');
    }, () => {
      this.spinner.hide();
    });
  }

  toggle() {
    this.sidebarService.toggle(false, 'mainSidebar');
    return false;
  }

  switchView() {
    this.view = (this.view == 1) ? 2 : 1;
  }

  switchTab(tab) {
    this.tab = tab;
    this.view = 1;
    this.window.scrollBy(1, 1);
    console.log(this.tab);
  }

  scrollView(id) {
    if (this.view == 2) {
      const finded = this.divs.find(div => div.nativeElement.id == id);
      finded.nativeElement.scrollIntoView({block: 'start', inline: 'nearest'});
      this.window.scrollBy(-200, -200);
    } else {
      this.window.scrollTo(0, 0);
    }

  }

  ngOnInit() { }

  addHttp(url) {
    const pattern = /^((http|https|ftp):\/\/)/;

     if (!pattern.test(url)) {
      url = 'http://' + url;
     }

     return url;
   }

  // ngAfterViewInit() {
  //   this.divs.changes.subscribe(t => { });
  // }

    search(nameKey, prop,  myArray) {
      for (let i = 0; i < myArray.length; i++) {
          if (myArray[i][prop] === nameKey) {
              return i;
          }
      }
    }

  abuse(id) {
    if (this.window.confirm('Vuoi segnalare questo post?')) {
      this.preferiti.abuse({idUtente: this.user.id, idPromo: id}).subscribe((res) => {
        alert('Grazie!\n\nLa tua segnalazione è stata inviata correttamente');
        console.log(res);
      }, (error) => {
        console.log(error);
      });
    }
    console.log(id);
  }


  private friendlyUrl(s: string) {
    return s.replace(/à/g, 'a')
      .replace(/è/g, 'e')
      .replace(/é/g, 'e')
      .replace(/ù/g, 'u')
      .replace(/ì/g, 'i')
      .replace(/&/g, 'e')
      .replace(/[^a-zA-Z0-9]/g, ' ')
      .replace(/\s+/g, '-')
      .replace(/-$/g, '')
      .replace(/^-/, '')
      .toLowerCase();
  }

  goTo(id) {
    this.idToScroll = id;
    this.view = 2;
    this.goToSubscription.add(this.divs.changes.subscribe(t => {
      this.scrollView(this.idToScroll);
    }));
  }

  doubleClick(followButton) {
    followButton.onClick();
    followButton.animate();
  }

  mobileDoubleClick(followButton) {
    if (this.touchTime === 0) {
      // set first click
      this.touchTime = new Date().getTime();
    } else {
      // compare first click to this click and see if they occurred within double click threshold
      if (((new Date().getTime()) - this.touchTime) < 800) {
        // double click occurred
        followButton.onClick();
        followButton.animate();
        this.touchTime = 0;
      } else {
        // not a double click so set as a new first click
        this.touchTime = new Date().getTime();
      }
    }
  }

  public reloadPromos(controller?) {
    if (controller === undefined || controller == null) {
      controller = this;
    }

    const accuracy = {enableHighAccuracy: true};

    controller.geo.getLocation(accuracy).subscribe((position) => {
      controller.getNegoziPreferiti(position);
    }, (error) => {
      controller.getNegoziPreferiti();
    }, () => {
      // spinner.hide();
    });
  }
}
