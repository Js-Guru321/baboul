/// <reference types="@types/googlemaps" />

import {Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList, Inject, AfterContentChecked, AfterViewInit} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {Subscription, Observable} from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { NegozioService } from '../api/negozio.service';
import { VetrinaService } from '../api/vetrina.service';
// import { Gallery, GalleryItem, ImageItem, GalleryRef } from '@ngx-gallery/core';
declare let google: any;

import { DialogService } from 'ng6-bootstrap-modal';
import { LightboxComponent } from './lightbox.component';
import { SottocategoriePopupComponent } from './sottocategorie-popup/sottocategorie-popup.component';
import { HostListener} from '@angular/core';
import {CacheService} from '../api/cache.service';
import { ListService } from '../api/list.service';

import {NbMediaBreakpointsService} from '@nebular/theme';
import {StorePictureOrDefaultPipe} from '../pipe/baboul-pipe/store-picture-or-default.pipe';
import {Angulartics2} from 'angulartics2';
import {Angulartics2Facebook} from 'angulartics2/facebook';
import {SwiperConfigInterface} from 'ngx-swiper-wrapper';
import {GeolocationService} from '../api/geolocation.service';
import {AppService, ScreenSize} from '../app.service';
import {DOCUMENT, LOCAL_STORAGE, WINDOW} from '../api/window.service';

@Component({
  selector: 'app-negozio',
  templateUrl: './negozio.component.html',
  styleUrls: ['./negozio.component.sass']
})
export class NegozioComponent implements OnInit/*, AfterContentChecked */{
  negozio: any = {};

  public swiper: {config: SwiperConfigInterface, index: number} = {
    config: {
      // navigation: {
      //   nextEl: '.swiper-button-next',
      //   prevEl: '.swiper-button-prev',
      // },
      navigation: false,
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      observer: true,
      observeParents: true,
      // navigation: true,
      // lazy: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        type: 'bullets',
        // bulletClass: 'swiper-pagination-bullet',
        // bulletActiveClass: 'swiper-pagination-bullet-active',
      },
    },
    index: 0,
  };

  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;

  // images: GalleryItem[] = [];
  galleryId = 'gallery';
  promos: any = [];
  idToScroll: any;
  path = null;
  pathUomo = null;
  showMicroCatsUomo = null;
  showMicroCats = null;
  hideBrands = false;
  hideProducts = false;
  hidePromos = false;

  hasBrands = false;
  hasProducts = false;
  hasPromos = false;

  user: any = null;

  storePictureOrDefault: StorePictureOrDefaultPipe = new StorePictureOrDefaultPipe();

  microCats = {
    13: 'Tute',
    35: 'Abiti e Vestiti',
    28: 'Giacche, Giubbotti e Cappotti',
    43: 'Camicie e Camicette',
    25: 'Top e T-Shirt',
    470: 'Pellicce',
    58: 'Maglie e Felpe',
    18: 'Intimo',
    12: 'Gonne',
    48: 'Pantaloni e Shorts',
    37: 'Mare e Piscina',
    55: 'Jeans',
    46: 'Sportswear',
    50: 'Scarpe',
    19: 'Sport',
    56: 'Borse',
    34: 'Valigie',
    45: 'Accessori',
    543: 'Beauty',
    14: 'Hi-Tech',
    52: 'Occhiali',
    29: 'Portafogli',
    57: 'Gioielli',
    120: 'Cinture',
    325: 'Cappelli',

    5: 'Abbigliamento',
    9: 'Abiti e Giacche',
    42: 'Tute',
    38: 'Giacche, Giubbotti e Cappotti',
    59: 'Camicie',
    40: 'T-Shirt',
    10: 'Intimo',
    22: 'Maglie e Felpe',
    54: 'Pantaloni',
    31: 'Mare e Piscina',
    15: 'Sportswear',
    39: 'Jeans',
    21: 'Scarpe',
    33: 'Sport',
    20: 'Borse',
    78: 'Valigie',
    17: 'Accessori',
    16: 'Cinture',
    537: 'Beauty',
    41: 'Hi-Tech',
    30: 'Occhiali',
    24: 'Gioielli',
    51: 'Piccola Pelletteria',
    23: 'Orologi',
  };
  // microCats = [
  //  'Abbigliamento',
  //  'Abiti e Giacche',
  //  'Tute',
  //  'Giacche, Giubbotti e Cappotti',
  //  'Camicie',
  //  'T-Shirt',
  //  'Intimo',
  //  'Maglie e Felpe',
  //  'Pantaloni',
  //  'Mare e Piscina',
  //  'Sportswear',
  //  'Jeans',
  //  'Scarpe',
  //  'Sport',
  //  'Borse',
  //  'Valigie',
  //  'Accessori',
  //  'Cinture',
  //  'Beauty',
  //  'Hi-Tech',
  //  'Occhiali',
  //  'Gioielli',
  //  'Piccola Pelletteria',
  //  'Orologi',
  //
  // ]

  isMobileScreen = false;
  isTabletScreen = false;
  isDesktopScreen = false;

  categoriesNegozio = {
    '3': [],
    '4': [],
    '7': [],
    '515': [],
    '5': [],
    '8': [],
    '6': [],
    '501': [],
  };

  position: string;
  prevScroll: number;
  actionsFixed = false;
  showDonna = false;
  list: any;
  goToSubscription: Subscription = new Subscription();
  view: number = 1;

  public mapOptions: any = {
    zoom: 16,
    center: {lat: 44.4992192, lng: 11.2616458},
    // [center]="{'lat': negozio.latitudine, 'lng': negozio.longitudine}"
    // mapClick: this.onMapClick,
    // idle: this.onIdle,
    mapTypeId: 'roadmap',
  };

  private touchTime = 0;

  @ViewChildren('promosRow') divs: QueryList<ElementRef>;
  @ViewChildren('gridPromo') grid: QueryList<ElementRef>;
  @ViewChild('prodotti') prodotti: ElementRef;
  @ViewChild('info') info: ElementRef;
  @ViewChild('brand') brand: ElementRef;
  @ViewChild('vetrina') vetrinaDiv: ElementRef;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const number = this.window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
    const direction = (number > this.prevScroll) ? 1 : 0;
    console.log(direction);
    this.prevScroll = number;

    if (number > 620 && this.window.innerWidth > 980) {
      this.actionsFixed = true;
    } else if (number > 520 && this.window.innerWidth < 980) {
      this.actionsFixed = true;
    } else if (number > 380 && this.window.innerWidth < 700) {
      this.actionsFixed = true;
    } else {
      this.actionsFixed = false;
    }

    if (direction === 1) {
      if (this.info && number >= this.info.nativeElement.offsetTop - 150) {
        this.position = 'info';
      }
      if (this.prodotti && number >= this.prodotti.nativeElement.offsetTop - 200) {
        this.position = 'prodotti';
      }
      if (this.brand && number >= this.brand.nativeElement.offsetTop - 200) {
        this.position = 'brand';
      }
      if (this.vetrinaDiv && number >= this.vetrinaDiv.nativeElement.offsetTop - 200) {
        this.position = 'vetrina';
      }
    } else {
      if (this.vetrinaDiv && number <= this.vetrinaDiv.nativeElement.offsetTop + 200) {
        this.position = 'vetrina';
      }
      if (this.brand && number <= this.brand.nativeElement.offsetTop + 200) {
        this.position = 'brand';
      }
      if (this.prodotti && number <= this.prodotti.nativeElement.offsetTop + 200) {
        this.position = 'prodotti';
      }
      if (this.info && number <= this.info.nativeElement.offsetTop + 150) {
        this.position = 'info';
      }
    }
  }

  // @ViewChild('actions', {read: ElementRef}) actionsChild: ElementRef;
  // ngAfterContentChecked(): void {
  //   if (this.actionsFixed === true && this.actionsChild.nativeElement.offsetParent != null) {
  //     console.log('isVisible switched from true to false');
  //     this.actionsFixed = false;
  //   } else if (this.actionsFixed === false && this.actionsChild.nativeElement.offsetParent == null) {
  //     console.log('actionsFixed switched from false to false');
  //     this.actionsFixed = false;
  //   }
  // }

  // we'll do some stuff here when the window is scrolled
  constructor(@Inject(WINDOW) private window: Window,
              @Inject(DOCUMENT) private document: Document,
              @Inject(LOCAL_STORAGE) private localStorage: Storage,
              private route: ActivatedRoute,
              private router: Router,
              private service: NegozioService,
              private vetrina: VetrinaService,
              private listService: ListService,
              private cache: CacheService,
              private mediaService: NbMediaBreakpointsService,
              // public gallery: Gallery,
              private dialogService: DialogService,
              private el: ElementRef,
              private geo: GeolocationService,
              private appService: AppService
              /*private angulartics2: Angulartics2,
              private angulartics2Facebook: Angulartics2Facebook*,*/
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

    const name = this.route.snapshot.paramMap.get('name');
    const id = name.split('-').pop();

    const accuracy = { enableHighAccuracy: true };
    this.geo.getLocation(accuracy).subscribe((position) => {
        this.getNegozio(id, position);
    }, (error) => {
        this.getNegozio(id, null);
    }, () => {
        // spinner.hide();
    });
    if (localStorage.getItem('utente') !== '' ) {
      this.user = JSON.parse(this.localStorage.getItem('utente'));
    }
  }
  getNegozio(id, userPos) {
    if (userPos == null) {
      userPos = {
        coords: {
          latitude: null,
          longitude: null
        }
      };
    }
      this.service.getNegozio(id, userPos.coords.latitude, userPos.coords.longitude).subscribe((res) => {
          this.negozio = res.negozio;
          // this.angulartics2Facebook.eventTrack('ViewContentSpecific', {
          //   content_ids: this.negozio.id,
          //   content_type: 'store_profile',
          // });
          /* this.angulartics2.eventTrack.next({
            action: 'ViewContent',
            properties: {
              content_ids: this.negozio.id,
              content_type: 'store_profile',
            }
          });
          */

          this.hasBrands = this.negozio && this.negozio.brands && this.negozio.brands.length > 0;
          this.hasProducts = this.negozio && this.negozio.categorie && this.negozio.categorie.length > 0;

          // this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
          // this.negozio.immagini.forEach((item) => {
          //     // console.log(item)
          //     this.images.push(new ImageItem({
          //             src: this.storePictureOrDefault.transform(item),
          //             thumb: this.storePictureOrDefault.transform(item),
          //         }),
          //     );
          // });

          this.negozio.categorie.forEach((item) => {
              if ((this.categoriesNegozio[item.treepath.split('.')[1]].indexOf(item.treepath.split('.')[2])) == -1) {
                  this.categoriesNegozio[item.treepath.split('.')[1]].push(item.treepath.split('.')[2]);
              }
          });

          if (this.negozio.urls) {
              this.negozio.urls.forEach((urls) => {
                  this.negozio[urls.tipo] = this.addHttp(urls.url);
              });
          }

          this.vetrina.getNegozioPromo(id).subscribe((subRes) => {
              console.log(subRes);
              this.promos = subRes.promos;
              this.hasPromos = this.promos && this.promos.length > 0;
              console.log(`The current store has promos: ${this.hasPromos}`);
          });

          this.centerAndZoomMap();
      });
  }
  private centerAndZoomMap(): void {
    if (typeof google === 'undefined') {
      return;
    }

    const positions = [{
      position: [this.negozio.latitudine, this.negozio.longitudine],
      store: this.negozio,
    }];

    if (positions.length === 0) {
      // none, the map will hide
    } else if (positions.length === 1) {
      // } else if (positions.length >= 1) {
      const _first = positions[0];
      this.mapOptions.center = {lat: _first.position[0], lng: _first.position[1]};
      this.mapOptions.zoom = 16;
    } else {
      // const bounds = new google.maps.LatLngBounds();
      // positions.forEach(p => {
      //   const latLng = new google.maps.LatLng(p.position[0], p.position[1]);
      //   bounds.extend(latLng);
      // });
      //
      // this.mapOptions.center = bounds.getCenter();
      // this.mapOptions.fitBounds = bounds;
      // this.mapOptions.zoom = this.mapOptions.zoom - 1;
    }
    this.mapOptions = Object.assign({}, this.mapOptions);
  }

  addHttp(url) {
    const pattern = /^((http|https|ftp):\/\/)/;

    if (!pattern.test(url)) {
      url = 'http://' + url;
    }
    return url;
  }

  onMapReady(map) {
    console.log('Map is ready', map);
    if (this.negozio) {
      this.centerAndZoomMap();
    }
    // console.log('markers', map.markers);  // to get all markers as an array
  }

  onIdle(event) {
    // console.log('map', event.target);
  }

  onMarkerInit(marker) {
    // console.log('marker', marker);
  }

  onMapClick(event) {
    // positions.push(event.latLng);
    // event.target.panTo(event.latLng);
  }

  ngOnInit() {
    this.appService.requestUpdateScreenSize();
    if (this.divs) {
      this.divs.changes.subscribe(t => {
        if (this.route.snapshot.paramMap.get('id')) {
          // console.log(this.idToScroll)
          this.scrollViewPromos(this.idToScroll);
        }
      });
    }
  }

  next() {
    // const galleryRef: GalleryRef = this.gallery.ref(this.galleryId);
    // galleryRef.next();
  }

  showLightBox(index: number = 0) {
    // console.log(this.negozio.immagini)
    const disposable = this.dialogService.addDialog(LightboxComponent, {
      images: this.negozio.immagini,
      index: index,
    }, {
      closeByClickingOutside: true,
    });
  }

  scrollView(element) {
    switch (element) {
      case 'prodotti':
        if (this.prodotti) {
          this.prodotti.nativeElement.scrollIntoView({block: 'start', inline: 'nearest'});
          this.position = 'prodotti';
        } else {
          return false;
        }
        break;
      case 'info':
        if (this.info) {
          this.info.nativeElement.scrollIntoView({block: 'start', inline: 'nearest'});
          this.position = 'info';
        } else {
          return false;
        }
        break;
      case 'brand':
        if (this.brand) {
          this.brand.nativeElement.scrollIntoView({block: 'start', inline: 'nearest'});
          this.position = 'brand';
        } else {
          return false;
        }
        break;
      case 'vetrina':
        if (this.vetrinaDiv) {
          this.vetrinaDiv.nativeElement.scrollIntoView({block: 'start', inline: 'nearest'});
          this.position = 'vetrina';
        } else {
          return false;
        }
        break;
      default :
        return;
    }
    this.window.scrollBy(-150, -150);
  }

  switchView() {
    this.view = (this.view === 1) ? 2 : 1;
  }

  backUomo() {
    this.showMicroCatsUomo = null;
    this.pathUomo = null;
  }

  backDonna() {
    this.showMicroCats = null;
    this.path = null;
  }

  scrollViewPromos(id) {
    if (this.view === 2) {
      let finded = this.divs.find(div => div.nativeElement.id == id);
      finded.nativeElement.scrollIntoView({block: 'start', inline: 'nearest'});
      this.window.scrollBy(-300, -300);
    }
  }

  scrollProduct() {
    this.prodotti.nativeElement.scrollIntoView({block: 'start', inline: 'nearest'});
  }

  scrollInfo() {
    this.info.nativeElement.scrollIntoView({block: 'start', inline: 'nearest'});
  }

  goTo(id) {
    this.idToScroll = id;
    this.view = 2;
    setTimeout(()=>this.scrollViewPromos(this.idToScroll), 200);
  }

  // pathClick(index) {
  //   this.path = index;
  //   let disposable = this.dialogService.addDialog(SottocategoriePopupComponent, {
  //     categoria: this.microCats[index],
  //     sesso: 'DONNA',
  //   }, {
  //     closeByClickingOutside: true,
  //   });
  // }

  categoriaSearch(string, gender, id) {
    const disposable = this.dialogService.addDialog(SottocategoriePopupComponent, {
      title: 'a Categoria',
      item: string,
      sesso: gender,
      id: id,
    }, {
      closeByClickingOutside: true,
    });
  }

  brandSearch(string, gender, id) {
    console.log(gender);
    const disposable = this.dialogService.addDialog(SottocategoriePopupComponent, {
      title: 'o Brand',
      item: string,
      sesso: gender,
      id: id,
    }, {
      closeByClickingOutside: true,
    });
  }

  public toggle(str: string, flag?: boolean) {
    switch (str) {
      case 'products':
      case 'prodotti':
        this.hideProducts = typeof flag === 'undefined' ? !this.hideProducts : !!flag;
        console.log(`toggling ${str} to ${flag} - ${this.hideProducts}`);
        break;
      case 'brands':
      case 'brand':
        this.hideBrands = typeof flag === 'undefined' ? !this.hideBrands : !!flag;
        console.log(`toggling ${str} to ${flag} - ${this.hideBrands}`);
        break;
      case 'vetrina':
      case 'promos':
        this.hidePromos = typeof flag === 'undefined' ? !this.hidePromos : !!flag;
        console.log(`toggling ${str} to ${flag} - ${this.hidePromos}`);
        break;
      default:
        break;
    }
  }

  private unFriendlyUrl(s: string) {
    return (s == null) ? null : s.replace(/_/g, '\n').replace(/-/g, ' ').replace(/\n/g, '-').toLocaleLowerCase();
  }

  private solve_id(key) {
    console.log(key);
    this.cache.get('negozi', this.listService.getNegozi()).subscribe((res) => {
      const list = res.negoziList;
      let id = null;
      if (typeof key === 'undefined') {
        return null;
      }
      list.forEach(item => {
        if (item.nome.toLowerCase() === key.toLowerCase()) {
          id = item.id;
        }
      });
      return (id) ? id : this.router.navigateByUrl('/list/negozi');
    });
  }

  public friendlyUrl(s: string) {
    return s
      .replace(/à/g, 'a')
      .replace(/è/g, 'e')
      .replace(/é/g, 'e')
      .replace(/ù/g, 'u')
      .replace(/ì/g, 'i')
      .replace(/&/g, 'e')
      .replace(/[^a-zA-Z0-9]/g, ' ')
      .replace(/\s+/g, '-')
      .replace(/-$/g, '')
      .replace(/^-/, '').toLowerCase();
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

  abuse(id) {
    if (this.user) {
        if (this.window.confirm('Vuoi segnalare questo post?')) {
            this.vetrina.abuse({idUtente: this.user.id, idPromo: id}).subscribe((res) => {
              alert('Grazie!\n\nLa tua segnalazione è stata inviata correttamente');
              console.log(res);
            }, (error) => {
              console.log(error);
            });
        }
        //
        console.log(id);
    }
  }
}
