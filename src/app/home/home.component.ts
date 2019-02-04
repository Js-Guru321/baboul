import {Component, Inject, OnInit, OnDestroy, ViewChild, ChangeDetectionStrategy, ElementRef, ChangeDetectorRef} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {HomeService} from '../api/home.service';
import {ListService} from '../api/list.service';
import {CacheService} from '../api/cache.service';
import {VetrinaService} from '../api/vetrina.service';
import {SpinnerVisibilityService} from 'ng-http-loader';
import { WINDOW } from '../api/window.service';
import {NbMediaBreakpointsService} from '@nebular/theme';

import {
  SwiperComponent,
SwiperDirective,
  SwiperConfigInterface,
  SwiperScrollbarInterface,
  SwiperPaginationInterface
} from 'ngx-swiper-wrapper';
import {GeolocationService} from '../api/geolocation.service';
import {DropdownModule} from 'ngx-dropdown';
import {HeaderService} from '../api/header.service';
import {AppService, ScreenSize} from '../app.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  messages: any = [];
  modelChanged: Subject<string> = new Subject<string>();
  negoziMost: any;
  categorieMost: any;
  search = '';
  configDropdown = {
    displayKey: 'name', // if objects array passed which key to be displayed defaults to description
    search: true,
    limitTo: 3
  };

  filterGender = [
    {
      name: 'UOMO',
    },
  ];

  options = [
    {
      name: 'UOMO'
    },
    {
      name: 'DONNA'
    }
  ];

  carouselItems = [
    'locator',
    'vetrina',
  ];

  listBrand: any;
  listCategories: any;
  listCategoriesTreeUomo: any;
  listCategoriesTreeDonna: any;
  listNegozi: any;
  showVetrina = false;
  vetrinaNegozi: any;

  private configAutoplay: any = {
    delay: 12500,
  };

  private forceDisableAutoplay = false;

  public config: SwiperConfigInterface = {
    a11y: true,
    direction: 'horizontal',
    slidesPerView: 1,
    keyboard: true,
    mousewheel: false,
    noSwipingSelector: 'app-search input[type="text"]',
    // setWrapperSize: true,
    autoHeight: true,
    scrollbar: false,
    navigation: true,
    pagination: true,
    autoplay: this.configAutoplay,
  };

 index = 1;
 isMobileScreen = false;
 isTabletScreen = false;
 isDesktopScreen = false;

 @ViewChild(SwiperComponent) componentRef?: SwiperComponent;
 @ViewChild('vetrinaDiv') vetrina: ElementRef;
 @ViewChild('item') accordion;

 searchResult: any = {
    'brand': ['Camicissima', 'Camper'],
    'categorie': ['Camicia Classica', 'Camicia alla Coreana', 'Camicia di jeans'],
    'scarpe': [],
    'accessori': [],
    'negozi': ['Camilla Boutique'],
  };
  hSubscription: Subscription;

  constructor(
    @Inject(WINDOW) private window: Window,
    private ref: ChangeDetectorRef,
    private spinner: SpinnerVisibilityService,
    private router: Router,
    private service: HomeService,
    private listService: ListService,
    private cache: CacheService,
    private mediaService: NbMediaBreakpointsService,
    private vetrinaService: VetrinaService,
    private headerService: HeaderService,
    private geo: GeolocationService,
    private route: ActivatedRoute,
    private appService: AppService,
  ) {

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


    this.hSubscription = this.headerService.getIndex().subscribe(index => {
      this.index = index;
    });

    this.cache.get('negoziMost', this.service.getNegozi(true)).subscribe((res) => {
      this.negoziMost = res.negoziList;
    });

    this.cache.get('negozi', this.listService.getNegozi(true)).subscribe((res) => {
      this.listNegozi = res.negoziList;
    });

    this.route.params.subscribe(params => {
      if (params && params.type) {
        console.log('Params:', params);
        const _i = this.carouselItems.indexOf(params.type);
        if (_i > -1) {
          this.index = _i;
        }
      } else {
        // none
      }
    });

    const accuracy = {enableHighAccuracy: true};

    this.geo.getLocation(accuracy).subscribe((position) => {
        this.ref.detectChanges();
        this.cache.get('vetrina', this.vetrinaService.getAllPromos({
          'latitudine': position.coords.latitude,
          'longitudine': position.coords.longitude
        }, true)).subscribe((res) => {
          this.vetrinaNegozi = res.promos;
        });
      }, (error) => {
        this.ref.detectChanges();
        this.cache.get('vetrina', this.vetrinaService.getAllPromos(undefined, true)).subscribe((res) => {
          this.vetrinaNegozi = res.promos;
        });
      }
    );
  }

  ngOnInit() {
    this.appService.requestUpdateScreenSize();
    this.headerService.setIndex(this.index);
  }

  clickSearch() {
    this.config.autoplay = false;
  }

  navigate(item, type) {
    this.router.navigate(['search/' + type, item]);
  }

  public onIndexChange(index: number) {
    return this.router.navigate(['/home', this.carouselItems[index]]);
    // this.index = index;
    // this.headerService.setIndex(index);
    // this.showVetrina = (index==1)? true: false;
  }

  ngOnDestroy() {
    this.headerService.setIndex(2);
  }

  scrollView(element) {
    this.vetrina.nativeElement.scrollIntoView({behavior: 'smooth', block: 'end'})
    this.config.autoplay = false;
    this.forceDisableAutoplay = true;
    // this.window.scrollBy(-150, -150)
  }

  searchFocus($event) {
    // console.log('Search focused...', $event);
    this.config.autoplay = false;
}

  searchBlur($event) {
    // console.log('Search blurred...', $event);
    if (!this.forceDisableAutoplay) {
      this.config.autoplay = !$event.search || $event.search === '' ? this.configAutoplay : false;
    }
  }

  setVetrina(id){
    this.vetrinaService.setVetrina(id);
    this.router.navigate(['/vetrina'])
  }

  private friendlyUrl(s: string) {
    return s.replace(/\s/g, '_').toLocaleLowerCase();
  }
}
