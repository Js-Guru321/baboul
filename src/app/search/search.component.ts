import {Component, OnInit, ViewChild, ChangeDetectionStrategy, ElementRef, Output, EventEmitter} from '@angular/core';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {Router, ActivatedRoute} from '@angular/router';
import {HomeService} from '../api/home.service';
import {SearchService} from '../api/search.service';
import {ListService} from '../api/list.service';
import {CacheService} from '../api/cache.service';
import {SpinnerVisibilityService} from 'ng-http-loader';
import {
  SwiperComponent, SwiperDirective, SwiperConfigInterface,
  SwiperScrollbarInterface, SwiperPaginationInterface
} from 'ngx-swiper-wrapper';
import {DropdownModule} from 'ngx-dropdown';
import {HomeComponent} from '../home/home.component';
import {Type} from '@angular/core/src/type';
import {BaboulArrayFilterPipePipe} from '../pipe/baboul-pipe/baboul-array-filter-pipe.pipe';
// import {ArrayFilterPipe} from 'ngx-custom-pipes/dist/array-pipes/pipes/array-filter-by.pipe';
import {AppService, ScreenSize} from '../app.service';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  modelChanged: Subject<string> = new Subject<string>();
  negoziMost: any;
  show: any;
  categorieMost: any;
  search: string = '';
  placeholder: string = '';
  configDropdown = {
    displayKey: 'name', // if objects array passed which key to be displayed defaults to description
    search: true,
    limitTo: 3
  };
  filterGender: string = 'uomo';
  luogo: string;
  listBrand: any;
  listCategories: any;
  listCategoriesTreeUomo: any;
  listCategoriesTreeDonna: any;
  listNegozi: any;
  showVetrina = false;

  showSubList = false;

  isMobileScreen = false;

  public config: SwiperConfigInterface = {
    a11y: true,
    direction: 'horizontal',
    slidesPerView: 1,
    keyboard: true,
    mousewheel: false,
    // setWrapperSize: true,
    autoHeight: true,
    scrollbar: false,
    navigation: true,
    pagination: false
  };

  focused = false;

  isInHome = false;

  @ViewChild(SwiperComponent) componentRef?: SwiperComponent;
  @ViewChild('vetrina') vetrina: ElementRef;
  @ViewChild('item') accordion;

  @Output('blur') blur$: EventEmitter<any>;
  @Output('focus') focus$: EventEmitter<any>;

  constructor(private spinner: SpinnerVisibilityService,
              private router: Router,
              private route: ActivatedRoute,
              private service: HomeService,
              private listService: ListService,
              private searchService: SearchService,
              private cache: CacheService) {

    this.route.params.subscribe(params => {

      for (const _route of this.route.snapshot.pathFromRoot) {
        if (typeof _route.component !== 'undefined' && _route.component != null &&
            ((typeof _route.component === 'string' && _route.component === 'HomeComponent') ||
            ((_route.component as Type<any>).name === 'HomeComponent'))) {
          this.isInHome = true;
        }
      }

      if(params.sesso != undefined) this.searchService.setGender(params.sesso);

      this.blur$ = new EventEmitter<any>();
      this.focus$ = new EventEmitter<any>();

      this.placeholder = this.searchService.getSearchString() ? this.searchService.getSearchString() : 'Inserisci il nome di un Brand, di un Prodotto o di un Negozio';
      this.filterGender = this.searchService.getGender() ? this.searchService.getGender() : 'uomo';
      this.cache.get('brandAll', this.listService.getBrand({'includeZeros': false}, this.isInHome)).subscribe((res) => {
        this.listBrand = res.brandList;
        console.log(res);
      });


      this.cache.get('brandAll', this.listService.getBrand({'includeZeros': false}, this.isInHome)).subscribe((res) => {
        this.listBrand = res.brandList;
        console.log(res);
      });

      this.cache.get('categorie', this.listService.getCategories(this.isInHome)).subscribe(
        (res) => {
        this.listCategories = res.categorieList;
        (error)=>{console.log('error')}
        ()=>{console.log('finito')}
      });

      this.cache.get('categorieTree', this.listService.getCategoriesTree({'sesso': 'ALL'}, this.isInHome)).subscribe((res) => {
        if (res.categorieTree.sottoCategorie[0].categoria.sesso === 'uomo') {
          this.listCategoriesTreeUomo = res.categorieTree.sottoCategorie[0];
          this.listCategoriesTreeDonna = res.categorieTree.sottoCategorie[1];
        } else {
          this.listCategoriesTreeUomo = res.categorieTree.sottoCategorie[1];
          this.listCategoriesTreeDonna = res.categorieTree.sottoCategorie[0];
        }

        // this.listCategories = [...this.listCategoriesTreeUomo, ...this.listCategoriesTreeDonna]
        // this.listCategoriesTreeUomo.sottoCategorie = this.listCategoriesTreeUomo.sottoCategorie.concat(this.listCategoriesTreeDonna.sottoCategorie)

        for (const item in this.listCategoriesTreeUomo.sottoCategorie) {
          if (this.listCategoriesTreeUomo.sottoCategorie.hasOwnProperty(item) && this.listCategoriesTreeUomo.sottoCategorie[item].categoria) {
            this.listCategoriesTreeUomo.sottoCategorie[item].categoria.nome = this.listCategoriesTreeUomo.sottoCategorie[item].categoria.nome.toLowerCase().replace(' uomo', '').capitalize();
          }
        }

        for (const item in this.listCategoriesTreeDonna.sottoCategorie) {
          if (this.listCategoriesTreeDonna.sottoCategorie.hasOwnProperty(item) && this.listCategoriesTreeDonna.sottoCategorie[item].categoria) {
            this.listCategoriesTreeDonna.sottoCategorie[item].categoria.nome = this.listCategoriesTreeDonna.sottoCategorie[item].categoria.nome.toLowerCase().replace('  ', ' ').replace(' donna', '').capitalize();
          }
        }
        if (this.filterGender.toLowerCase() === 'uomo') {
          this.listCategories = this.listCategoriesTreeUomo;
          console.log('uomo', this.listCategoriesTreeUomo)
        } else {
          this.listCategories = this.listCategoriesTreeDonna;
          console.log('donna', this.listCategoriesTreeDonna)

        }

      });

      this.cache.get('negozi', this.listService.getNegozi(this.isInHome)).subscribe((res) => {
        this.listNegozi = res.negoziList;

          this.cache.get('negoziMost', this.service.getNegozi(this.isInHome)).subscribe((res) => {
              this.negoziMost = res.negoziList;
          });
      });

    });
  }

  ngOnInit() {
    this.luogo = 'bologna'
  }


  changeGender() {
    if (this.filterGender === 'donna') {
      this.listCategories = this.listCategoriesTreeUomo;
      this.filterGender = 'uomo';
      this.searchService.setGender(this.filterGender);
    } else {
      this.listCategories = this.listCategoriesTreeDonna;
      this.filterGender = 'donna';
      this.searchService.setGender(this.filterGender);
      console.log(this.listCategories);
    }
  }

  navigate(item, type) {
    this.searchService.setSearchString(this.search);
    this.searchService.setGender(this.filterGender);
    this.router.navigate(['search/' + type, item]);
  }

  public onIndexChange(index: number): void {
    this.showVetrina = index === 1;
  }

  inputFocus() {
    this.show = true;
    this.focused = true;
    this.focus$.emit(this);
  }

  inputBlur() {
    this.focused = false;
    this.blur$.emit(this);
    setTimeout(() => {
      this.show = false;
    }, 4000);
  }

  navigateRoute(s: string, id: number) {
    this.searchService.setSearchString(s);
    this.searchService.setGender(this.filterGender);
    this.search = '';
    this.show = false;
    this.router.navigate(['negozi/' + this.luogo + '/' + this.filterGender.toLowerCase() + '/' + this.friendlyUrl(s) + '-' + id]);
  }
  emptyBrands() {
      let empty = true;

      if (this.listBrand){
          const pipeNome = new BaboulArrayFilterPipePipe().transform(this.listBrand, this.search, 'nome', true, 'brand');
          if (pipeNome.length > 0){
              const pipeSesso = new BaboulArrayFilterPipePipe().transform(pipeNome, this.filterGender, 'sesso', true, 'brand');
              empty = pipeSesso.length === 0;
          }
      }

      return empty;
  }
  emptySubcategories() {
      let empty = true;
      this.listCategories.sottoCategorie.forEach((v, i) => {
          const pipe = new BaboulArrayFilterPipePipe().transform(v.sottoCategorie, this.search, 'nome', true, 'categoria');
          if (pipe.length !== 0) {
              empty = false;
          }
      });
      return empty;
  }

  private friendlyUrl(s: string) {
    return s.replace(/à/g, 'a').replace(/è/g, 'e').replace(/é/g, 'e').replace(/á/g, "a").replace(/ù/g, "u").replace(/ì/g, "i").replace(/&/g, 'e').replace(/[^a-zA-Z0-9]/g, " ").replace(/\s+/g, '-').replace(/-$/g, '').replace(/^-/, '').toLowerCase();
  }

}
