/// <reference types="@types/googlemaps" />

import {Component, OnInit, ChangeDetectionStrategy, Inject, AfterViewInit} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { SearchService } from '../api/search.service';
import {CacheService} from '../api/cache.service';
import { ListService } from '../api/list.service';
import { isNull } from 'util';
import { isNumeric } from 'rxjs/internal-compatibility';
import {NbMenuItem, NbMenuService, NbSidebarService} from '@nebular/theme';
declare let google: any;

import {NbMediaBreakpointsService} from '@nebular/theme';
import MapOptions = google.maps.MapOptions;
import {AppService, ScreenSize} from '../app.service';
import {GeolocationService} from '../api/geolocation.service';
import {WINDOW} from '../api/window.service';
@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.sass'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
  // changeDetection: ChangeDetectionStrategy.CheckAlways,

})
export class SearchResultComponent implements OnInit, AfterViewInit {

  showCategoryFilter = true;
  showBrandFilter = true;
  showTypologyFilter = true;
  showTypologyOrder = true;
  sorting:any = 1;
  filterSorting: string;
  results = [];
  uomoCheck:any = true;
  donnaCheck:any = true;
  brandList:any;
  searchString:string= '';
  searchStringSecond:string= '';
  categorieList:any;
  filterGenderBrand:string;
  filterGenderCategory:string;
  filterGender:any;
  pageSize = 10;
  pageToLoadNext = 2;
  hasMoreNegozi = true;
  placeholders = [];
  loading = false;
  serviceLoading = false;
  form:any = {};
  searchedBrand: any;
  searchedCategory: any;
  Params = {
    'luogo': null,
    'sesso': null,
    'categoria': null,
    'brand': null,
    'pagina': null,
    'categoria_string': null,
    'brand_string': null
  };
  snap:any;
  positions: any[] = [];
  selectedPosition: any = undefined;
  mapOptions: any = {
    center: {lat: 44.4992192, lng: 11.2616458},
    zoom: 12,
  };

  isMobileScreen = false;

  typologies: any[] = [
    { key: 'Monomarca', value: 'Monomarca', label: 'Monomarca' },
    { key: 'Multimarca', value: 'Monomarca', label: 'Multimarca' },
    { key: 'Boutique', value: 'Monomarca', label: 'Boutique' },
    { key: 'Catena di Negozi', value: 'Catena di Negozi', label: 'Catena di Negozi' },
  ];

  finished = false;
  selectedType: any = undefined;

  constructor(private route: ActivatedRoute,
              @Inject(WINDOW) private window,
              private router: Router,
              private service: SearchService,
              private listService: ListService,
              private sidebarService: NbSidebarService,
              private mediaService: NbMediaBreakpointsService,
              private cache: CacheService,
              private appService: AppService,
              private geo: GeolocationService) {
    // const _w = this.window.innerWidth;
    // if (_w >= this.mediaService.getByName('lg').width) {
    //   // console.log('Large screen');
    //   this.isMobileScreen = false;
    // } else {
    //   // console.log('Small screen');
    //   this.isMobileScreen = true;
    // }
    this.appService.onScreenResize().subscribe((ss: ScreenSize) => {
      this.isMobileScreen = ss.mobile;
    });
    this.appService.requestUpdateScreenSize();
  }

  ngAfterViewInit(): void {
    this.sidebarService.collapse('filterSidebar');
  }

  ngOnInit() {
    this.sidebarService.collapse('filterSidebar');
    this.cache.get('categorie', this.listService.getCategories()).subscribe((res)=>{
        // populate category list
        this.categorieList = res.categorieList
        // for(let item in this.categorieList ){
        //   this.categorieList[item].nome = this.categorieList[item].nome.toLowerCase().replace(' uomo', '').capitalize()   //remove?
        //   this.categorieList[item].nome = this.categorieList[item].nome.toLowerCase().replace(' donna', '').capitalize()  //remove?
        // }

        // get brandlist
        this.cache.get('brandAll', this.listService.getBrand({'includeZeros': false})).subscribe((res)=>{
          this.brandList = res.brandList
            //route parsing
            this.route.params.subscribe(
            params => {
            console.log('ciao')
              this.searchedCategory = null
              this.searchedBrand = null
              this.Params = {
                "luogo": null,
                "sesso": null,
                "categoria": null,
                "brand": null,
                "pagina": null,
                "categoria_string": null,
                "brand_string": null
              };
              this.searchString=""
              this.searchStringSecond=""
              this.form = {}
              let param3_ = this.unFriendlyUrl(params.param3_)
              let param4_ = this.unFriendlyUrl(params.param4_)
              let param5_ = params.param5_






              //parse route data and manual mapping to Params object
              this.Params.luogo = params.luogo
              if((Object.keys(params)).length > 1){
                this.Params.sesso = params.sesso
                //es. search/bologna/maschio/abito
              //   if(this.found(this.categorieList, param3_)) {
              //     //param3_ is a category
              //     this.Params.categoria_string = param3_;
              //     this.Params.categoria = this.solve_id_cat(this.categorieList, param3_, this.Params.sesso)
              //     if(isNumeric(param4_)) {
              //       this.Params.pagina = param4_
              //     } else {
              //       this.Params.brand_string = param4_;
              //       this.Params.brand = this.solve_id_brand(this.brandList, param4_, this.Params.sesso)
              //       this.Params.pagina = param5_
              //     }
              //   } else {
              //     //es. search/bologna/maschio/nike
              //     //param3_ is a brand
              //     this.Params.brand_string = param3_;
              //     this.Params.brand = this.solve_id_brand(this.brandList, param3_, this.Params.sesso)
              //     this.Params.pagina = param4_
              //   }
              // }
              let indicator = param3_.split('-').pop()
              if(isNumeric(indicator)){
                // controllo categoria o brand
                let found = this.guessCat(param3_, indicator)
                if(found){
                  this.Params.categoria = found.id
                  this.Params.categoria_string = found.nome}
                else{
                  found = this.guessBrand(param3_, indicator)
                  // non ho trovato ne categoria ne brand, cé qualche errore nell'url. Reindirizzo
                  if(!found)
                    this.router.navigateByUrl('/list/brand')
                  this.Params.brand = found.id
                  this.Params.brand_string = found.nome
                }
                this.Params.pagina = params.param4_
              }
              else{
                if(!params.param4_)
                  this.router.navigateByUrl('/list/categorie')
                const indicators = params.param4_.split('-')
                let idBrand = indicators.pop()
                let idCategoria = indicators.pop()
                // manca qualche id -> reindirizzo
                if(!(isNumeric(idBrand)&&isNumeric(idCategoria)))
                  this.router.navigateByUrl('/list/categorie')
                let foundCat = this.guessCat(param3_+'-'+idCategoria, idCategoria)
                this.Params.categoria = foundCat.id
                this.Params.categoria_string = foundCat.nome
                const brandP = params.param4_.replace('-'+idCategoria, '')
                let foundBrand = this.guessBrand(brandP, idBrand)
                this.Params.brand = foundBrand.id
                this.Params.brand_string = foundBrand.nome
                this.Params.pagina = param5_
              }
              (this.Params.pagina == undefined) ? this.Params.pagina = 0 : this.Params.pagina = this.Params.pagina
              if(this.Params.sesso == undefined) this.Params.sesso = 'uomo';

              //set gender in search top bar
              this.filterGender = this.Params.sesso.toUpperCase();
              this.service.setGender(this.filterGender);
              //print for debug
              console.log("Luogo: "+this.Params.luogo+"\nSesso: "+this.Params.sesso+"\nCategoria: "+this.Params.categoria+"\nBrand: "+this.Params.brand+"\nPagina: "+this.Params.pagina)


              //route params parsing
              this.form.limit = this.pageSize
              this.form.outNPagina = this.Params.pagina

              //sorting default
              this.form.tipoOrdinamento = "RILEVANZA";
              if(this.Params.categoria){
                this.form['idCategoria'] = this.Params.categoria
                this.service.getSingleCategory({id: this.form['idCategoria']}).subscribe((categoria)=>{
                  this.searchedCategory = categoria.categoria
                  this.searchStringSecond = categoria.categoria.nome.toLowerCase().replace(' uomo', '').replace(' donna', '').capitalize()
                  this.filterGender = categoria.categoria.sesso;
                })
              }

              if(this.Params.brand) {
                  this.form['idBrand']=this.Params.brand
                  this.service.getSingleBrand({id: this.form['idBrand']}).subscribe((brand)=> {
                    this.searchedBrand = brand.brand
                    this.searchString = brand.brand.nome;
                    this.filterGender = brand.brand.sesso
                  });
              }
              const accuracy = { enableHighAccuracy: true };

              this.geo.getLocation(accuracy).subscribe((position) => {
                  this.form.posLatitudine = position.coords.latitude;
                  this.form.posLongitudine = position.coords.longitude;
                  this.downloadNegozi(true);
              }, (error) => {
                  this.downloadNegozi(true);
              }, () => {
                  // spinner.hide();
              });

              }},
            (error) => {console.log('errore')},
            () => {console.log('concluso');}
          )

        })

    });
  }

  downloadNegozi(firstLoad) {
      if (firstLoad) {
          this.form.outNPagina = 1;
          this.pageToLoadNext = 2;
          this.hasMoreNegozi = true;
      }
      if (this.hasMoreNegozi && !this.serviceLoading){
        this.serviceLoading  = true;
        this.service.getNegozi(this.form).subscribe((res) => {
            if (!firstLoad){

                if( res.negozi.length) {

                    this.results.push(...res.negozi);
                    this.sort();
                    this.loadMarkers();
                    this.loading = false;
                    this.hasMoreNegozi = res.negozi.length === 10
                    this.pageToLoadNext++;
                    this.serviceLoading = false;
                } else {
                    return;
                }
            } else {
                console.log(res);
                this.results.splice(0);
                this.results.push(...res.negozi);
                // this.results = res.negozi;
                this.hasMoreNegozi =  res.negozi.length === 10
                this.loadMarkers();
                this.loading = false;
                this.serviceLoading = false;
                this.finished = true;
                this.sort();
            }
        });
      }
  }

  // found - sold_id_x :: optimize with fast method of search key in object list
  private found(list, key) {
    let found = false;
    if(key === undefined) { return false; }
    list.forEach(item => {
        if(item.nome.toLowerCase() === key.toLowerCase()) { found = true; }
    });
    return found;
  }

  private solve_id_cat(list, key, sex) {
    let id = null;
    if(key === undefined) { return null; }
    list.forEach(item => {
      if(item.nome.toLowerCase() === key.toLowerCase() && item.sesso.toLowerCase() === sex) { id = item.id; }
    });
    return (id) ? id : this.router.navigateByUrl('/list/categorie');
  }

  private solve_id_brand(list, key, sex) {
    let id = null;
    if (key === undefined) {return null; }
    list.forEach(item => {
      if(item.brand.nome.toLowerCase() === key.toLowerCase()  && item.brand.sesso.toLowerCase() === sex) { id = item.brand.id; }
    });
    return (id) ? id : this.router.navigateByUrl('/list/brand');
  }

  private unFriendlyUrl(s:string) {
    return (s == null) ? null : s.replace(/_/g, ' ').toLocaleLowerCase();
  }

  sort() {
    if (this.filterSorting === 'distanza') {
      this.results.sort((a, b) => a.distanza < b.distanza ? -1 : a.distanza > b.distanza ? 1 : 0);
    } else if (this.filterSorting === 'rilevanza') {
      console.log('rilevanza');
    } else {
      return;
    }
  }

  setSort(value) {
    this.filterSorting = value;
    this.form.tipoOrdinamento = value.toUpperCase();
    this.loading = false;
    this.hasMoreNegozi = true;
    this.downloadNegozi(true);
  }

  loadNext() {
    console.log('treshold');
    if (this.loading) { return true; } else {
        console.log('else');

        this.loading = true;
        this.form.outNPagina = this.pageToLoadNext;
        const accuracy = { enableHighAccuracy: true };

        this.geo.getLocation(accuracy).subscribe((position) => {
            this.form.posLatitudine = position.coords.latitude;
            this.form.posLongitudine = position.coords.longitude;
            this.downloadNegozi(false);
        }, (error) => {
            this.downloadNegozi(false);
        }, () => {
            this.loading = false;
            // spinner.hide();
        });
    }
  }

  genderChange() {
    if(this.uomoCheck && this.donnaCheck) {
      this.filterGenderBrand = '';
      this.filterGenderCategory = '';
    } else {
      if(this.uomoCheck) {
        this.filterGenderBrand = 'UOMO';
        this.filterGenderCategory = 'UOMO';
      } else {
        this.filterGenderBrand = 'DONNA';
        this.filterGenderCategory = 'DONNA';
      }
    }

  }



    private friendlyUrl(s:string) {
      return s.replace(/à/g, 'a').replace(/è/g, 'e').replace(/é/g, 'e').replace(/ù/g, 'u').replace(/ì/g, 'i').replace(/&/g, 'e').replace(/[^a-zA-Z0-9]/g, ' ').replace(/\s+/g, '-').replace(/-$/g, '').replace(/^-/, '').toLowerCase();
      }

  search(name:any, id:number, type:any) {
    // url mapping mode
    name = this.friendlyUrl(name);
    let url = 'negozi/' + this.Params.luogo + '/' + this.Params.sesso + '/';
    if(type === 'brand') {
      (this.searchedCategory) ? url += this.friendlyUrl(this.Params.categoria_string) + '/' + name + '-' + this.Params.categoria + '-' + id : url += name + '-' + id;
    } else {
      (this.searchedBrand) ? url += name + '/' + this.friendlyUrl(this.Params.brand_string) + '-' + id + '-' + this.Params.brand : url += name + '-' + id;
    }
    this.router.navigate([url]);
  }

  private loadMarkers(): void {
    const markers = [];
    const data = this.results || [];
    for (let i = 0, len = data.length; i < len; i++) {
      const _store = data[i];
      markers.push({position: [_store.latitudine, _store.longitudine], store: _store});
    }
    this.positions = [...markers];

    this.centerAndZoom();
  }

  private centerAndZoom(): void {
    if (typeof google === 'undefined') {
      return;
    }
    if (this.positions.length === 0) {
      // none, the map will hide
    } else if (this.positions.length === 1) {
    // } else if (this.positions.length >= 1) {
      const _first = this.positions[0];
      this.mapOptions.center = new google.maps.LatLng(_first.position[0], _first.position[1]);
      this.mapOptions.zoom = 14;
    } else {
      const bounds = new google.maps.LatLngBounds();
      this.positions.forEach(p => {
        const latLng = new google.maps.LatLng(p.position[0], p.position[1]);
        bounds.extend(latLng);
      });

      this.mapOptions.center = bounds.getCenter();
      this.mapOptions.fitBounds = bounds;
      this.mapOptions.zoom = 14;
    }
    this.mapOptions = Object.assign({}, this.mapOptions);

  }

  mapReady(map) {
    console.log('Map loaded:', map);
    this.loadMarkers();
  }

  positionClicked({target: marker}, position: any): boolean {
    this.selectedPosition = position;
    marker.nguiMapComponent.openInfoWindow('markerInfoWindow', marker);
    return true;
  }

  toggle() {
    this.sidebarService.toggle(false, 'filterSidebar');
    return false;
  }

  guessCat(key, id) {
    let found;
    this.categorieList.forEach(item => {
        if (this.friendlyUrl(item.nome) + '-' + item.id === key) { found = item; }
    });
    return found;
  }

  guessBrand(key, id) {
    let found;
    this.brandList.forEach(item => {
        if (this.friendlyUrl(item.brand.nome) + '-' + item.brand.id === key) { found = item.brand; }
    });
    return found;
  }


}
