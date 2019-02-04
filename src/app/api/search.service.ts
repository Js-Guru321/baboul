import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/';

@Injectable()
export class SearchService extends ApiService {

  searchString: string = null;
  gender: string = null;


  list(): Observable<any> {
    return this.get(
    'servizi/negozio/mostvisited',
    );
  }

  getSearchString() { return this.searchString; }
  setSearchString(searchString) { this.searchString = searchString; }
  getGender() { return this.gender; }
  setGender(gender) { this.gender = gender.toLowerCase(); }


  getNegozi(form) {return this.post('servizi/ricerca/negozi', form); }

  getCategories() {return this.get('servizi/query/mostSearched/categories'); }


  getSingleBrand(id: any) {return this.get('servizi/brand', id); }

  getSingleCategory(id: any) {return this.get('servizi/categoria', id); }

}
