import { Component, OnInit, Inject, ChangeDetectorRef, ViewChildren, QueryList, ElementRef, Directive } from '@angular/core';
import {Subscription, SchedulerLike, timer} from 'rxjs';
import {UserService} from '../api/user.service';
import {VetrinaService} from '../api/vetrina.service';
import {CacheService} from '../api/cache.service';
import {GeolocationService} from '../api/geolocation.service';
import { DialogService } from 'ng6-bootstrap-modal';
import {filter, map, timeInterval} from 'rxjs/operators';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {NbMediaBreakpointsService, NbSidebarService} from '@nebular/theme';
import { ImgCacheService } from 'ng-imgcache';
import {LoginModalComponent} from '../login/login-modal.component';
import {InitialModalComponent} from '../login/initial-modal.component';
import {PreferitiService} from '../api/preferiti.service';
import Animation = google.maps.Animation;
import {AppService, ScreenSize} from '../app.service';
import {WINDOW, LOCAL_STORAGE} from '../api/window.service';

@Component({
  selector: 'app-vetrina',
  templateUrl: './vetrina.component.html',
  styleUrls: ['./vetrina.component.sass']
})
export class VetrinaComponent implements OnInit {
  lSubscription: Subscription;
  promos: any;
  view = 1;
  showAs: string = 'grid';
  loading = true;
  idToScroll: any;
  scrolled = false;
  isMobileScreen = false;
  isTabletScreen = false;
  isDesktopScreen = false;
  animationTerminated = true;
  user: any;
  @ViewChildren('negozioRow') divs: QueryList<ElementRef>;
  @ViewChildren('grid') grid: QueryList<ElementRef>;
  goToSubscription: Subscription = new Subscription();

  private touchTime = 0;

  currentPage = 1;
  listPromos: any;

  constructor(@Inject(WINDOW) private window: Window,
              @Inject(LOCAL_STORAGE) private localStorage: Storage,
              private route: ActivatedRoute,
              private imgCache: ImgCacheService,
              private mediaService: NbMediaBreakpointsService,
              private router: Router,
              private sidebarService: NbSidebarService,
              private spinner: SpinnerVisibilityService,
              private ref: ChangeDetectorRef,
              private userService: UserService,
              private service: VetrinaService,
              private dialogService: DialogService,
              private cache: CacheService,
              private geo: GeolocationService,
              private preferitiService: PreferitiService,
              private appService: AppService) {
    this.scrolled = false;
    spinner.show();
    const _w = this.window.innerWidth;
    console.log(_w);

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
    //
    // if (_w >= this.mediaService.getByName('lg').width) {
    //   // console.log('Large screen');
    //   this.isMobileScreen = false;
    // } else {
    //   // console.log('Small screen');
    //   this.isMobileScreen = true;
    // }

    this.reloadPromos(true);

    if (this.localStorage.getItem('utente') !== '' && this.localStorage.getItem('utente') != null) {
      this.user = JSON.parse(this.localStorage.getItem('utente'));
      this.userService.getUser().subscribe((user) => {
          if (user == null) {
              const disposable = this.dialogService.addDialog(LoginModalComponent, {});
          } else {
              this.user = user;
          }
      });
    }
  }

  abuse(id) {
    if (this.window.confirm('Vuoi segnalare questo post?')) {
      this.service.abuse({'idPromo': id}).subscribe((res) => {
            console.log(res);
            alert('Grazie!\n\nLa tua segnalazione è stata inviata correttamente');
          },
        (error) => {console.log(error); });
    }
  //
  console.log(id);
  }

  switchView() {
    this.view = (this.view === 1) ? 2 : 1;
    if (this.showAs === 'grid') {
        this.currentPage = 1;
        this.listPromos = this.promos.slice(0, 10);
    }
    this.showAs = !this.showAs || this.showAs === 'grid' ? 'list' : 'grid';
  }

  toggle() {
    this.sidebarService.toggle(false, 'mainSidebar');
    return false;
  }


  scrollView(id) {

    if (this.showAs === 'list') {
      const found = this.divs.find(div => div.nativeElement.id == id);
      if (found) {
        console.log('scroll');
        found.nativeElement.scrollIntoView({block: 'start', inline: 'nearest'});
        const scrolledY = this.window.scrollY;
        if (scrolledY) {
          this.window.scroll(0, scrolledY - 200);
          this.scrolled = true;
        }
      }
    } else {
      this.window.scrollTo(0, 0);
    }
  }

  ngOnInit() {
      this.appService.requestUpdateScreenSize();
  }

  ngAfterViewInit() {
    this.service.getVetrina() > 0 ? this.goTo(this.service.getVetrina()) : null;
    this.service.setVetrina(0);
  }

  search(nameKey, prop, myArray) {
    for (let i = 0; i < myArray.length; i++) {
      if (myArray[i][prop] === nameKey) {
        return i;
      }
    }
  }
  private friendlyUrl(s: string) {
    return s.replace(/à/g, 'a').replace(/è/g, 'e').replace(/é/g, 'e').replace(/ù/g, 'u').replace(/ì/g, 'i').replace(/&/g, 'e').replace(/[^a-zA-Z0-9]/g, ' ').replace(/\s+/g, '-').replace(/-$/g, '').replace(/^-/, '').toLowerCase();
    }


  goTo(id) {
    console.log(id);
    this.idToScroll = id;
    this.view = 2;
    this.showAs = 'list';
    this.grid.changes.subscribe(
      t => {
        setTimeout(() => this.scrollView(this.idToScroll), 1);
      }
    );
  }

  doubleClick(followButton) {

      followButton.onClick();
      followButton.animate();
  }
  mobileDoubleClick(followButton) {
      if (this.touchTime == 0) {
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
  public reloadPromos(isFirstLoading, controller?) {

      if (!controller) {
          controller = this;
      }

      if (!isFirstLoading) {
          controller.spinner.show();
      }

      const accuracy = { enableHighAccuracy: true };
      controller.geo.getLocation(accuracy).subscribe(
          (position) => {
              controller.ref.detectChanges();
              controller.loading = false;
              controller.cache.get('vetrina', controller.service.getAllPromos({
                  'latitudine': position.coords.latitude,
                  'longitudine': position.coords.longitude
              })).subscribe((res) => {
                  controller.promos = res.promos;
                  controller.listPromos = controller.promos.length >= 10 ? controller.promos.slice(0, 10) : controller.promos;
                  controller.spinner.hide();

              });
          }, (error) => {
              controller.spinner.hide();
              controller.ref.detectChanges();
              controller.cache.get('vetrina', controller.service.getAllPromos()).subscribe((res) => {
                  controller.promos = res.promos;
                  controller.listPromos = controller.promos.length >= 10 ? controller.promos.slice(0, 10) : controller.promos;
                  controller.spinner.hide();

              });
          }
      );
  }
  loadNext() {
      let numberOfPages = this.promos.length / 10;
      numberOfPages = Math.ceil(numberOfPages);
      this.currentPage ++;
      if (this.currentPage <= numberOfPages) {
          const start = (this.currentPage - 1) * 10;
          const end = this.currentPage != numberOfPages ? this.currentPage * 10 : this.promos.length;
          this.promos.slice(start, end).forEach(v => {
              this.listPromos.push(v);
          });
      }
  }
}
