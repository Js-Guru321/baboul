import {Component, OnInit, OnDestroy, AfterViewInit, Pipe, PipeTransform} from '@angular/core';
import {Subscription} from 'rxjs';
import {filter} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {ListService} from '../api/list.service';
import {CacheService} from '../api/cache.service';
import {getDeepFromObject} from '../api/helpers';

@Component({
  selector: 'app-seo',
  templateUrl: './seo.component.html',
  styleUrls: ['./seo.component.scss']
})
export class SeoComponent implements OnInit, OnDestroy, AfterViewInit {

  locality: string = undefined;
  category: string = undefined;
  gender: string = undefined;
  brand: string = undefined;
  categoryOrGenderOrBrand: string = undefined;
  genderOrBrand: string = undefined;

  subscriber$: Subscription;

  alive = false;

  path: string[] = [];

  properties: any = {};

  possibleCategories = [];
  possibleBrands = {};

  constructor(private route: ActivatedRoute, private router: Router, private cache: CacheService, private service: ListService) {
    this.alive = true;

    this.subscriber$ = this.route.params
      .pipe(
        filter(() => this.alive)
      ).subscribe((params) => {
        this.locality = params.locality;
        this.category = params.category;
        this.gender = params.gender;
        this.brand = params.brand;
        this.categoryOrGenderOrBrand = params.categoryOrGenderOrBrand;
        this.genderOrBrand = params.genderOrBrand;
        this.properties = Object.assign({}, params);
        this.constructPath();
      }, (error) => {
        this.router.navigate(['/home']);
      }, () => { });
  }

  constructPath() {
    this.path = ['/search'];
    if (this.locality) { }
    if (this.categoryOrGenderOrBrand) {
      this.path = this.extractCategory(this.categoryOrGenderOrBrand);
      this.path = this.extractGender(this.categoryOrGenderOrBrand);
      this.path = this.extractBrand(this.categoryOrGenderOrBrand);

      this.setCategoryId(this.categoryOrGenderOrBrand);
      this.setBrandId(this.categoryOrGenderOrBrand);
    } else if (this.genderOrBrand) {
      this.path = this.extractGender(this.genderOrBrand);
      this.path = this.extractBrand(this.genderOrBrand);
      this.setCategoryId(this.category);

      this.setBrandId(this.genderOrBrand);
    } else {
      this.setCategoryId(this.category);
      this.setBrandId(this.brand);
    }

    return this.path;
  }

  extractCategory(str: string) {
    return this.path;
  }

  extractGender(str: string) {
    if (str) {
      if (str.toLowerCase() === 'uomo') {
        this.properties.gender = 'uomo';
        this.properties.categoryOrGenderOrBrand = undefined;
        this.path.push('gender', 'uomo');
      } else if (str.toLowerCase() === 'donna') {
        this.properties.gender = 'donna';
        this.properties.categoryOrGenderOrBrand = undefined;
        this.path.push('gender', 'donna');
      }
    }
    return this.path;
  }

  extractBrand(str: string) {
    return this.path;
  }

  setCategoryId(str: string) {
    this.cache.get('categorie', this.service.getCategories()).subscribe((res) => {
      const list = getDeepFromObject(res, 'categorieList', []);
      const possible = [];
      for (const item in list) {
        if (list.hasOwnProperty(item)) {
          list[item].nome = list[item].nome.toLowerCase().replace(' uomo', '').capitalize();
          list[item].nome = list[item].nome.toLowerCase().replace(' donna', '').capitalize();
          if (list[item].nome.toLowerCase() === str.toLowerCase()) {
            possible.push(list[item]);
          }
        }
      }
      this.possibleCategories = [...possible];
    });
  }

  setBrandId(str: string) {
    this.cache.get('brand', this.service.getBrand()).subscribe((res) => {
      const list = getDeepFromObject(res, 'brandList', []);
      console.log(list);
      const possible = {UOMO: [], DONNA: []};
      for (const item in list) {
        if (list.hasOwnProperty(item)) {
          const brand = list[item].brand;
          if (brand.nome.toLowerCase() === str.toLowerCase()) {
            possible[brand.sesso] = brand;
          }
          // list[item].nome = list[item].nome.toLowerCase().replace(' uomo', '').capitalize();
          // list[item].nome = list[item].nome.toLowerCase().replace(' donna', '').capitalize();
          // if (list[item].nome.toLowerCase() === str.toLowerCase()) {
          //   possible.push(list[item]);
          // }
        }
      }
      this.possibleBrands = Object.assign({}, possible);
    });
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  ngOnInit(): void {
    this.alive = true;
  }

  ngAfterViewInit(): void {
    this.alive = true;
  }

}
@Pipe({
  name: 'objToArray',
})
export class ObjectToArrayFilterPipe implements PipeTransform {
  public transform(object: any) {
    return Object.keys(object);
  }
}
