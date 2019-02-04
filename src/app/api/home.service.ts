import {ApiService} from './api.service';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/';
import {HttpHeaders} from '@angular/common/http';

@Injectable()
export class HomeService extends ApiService {

  list(): Observable<any> {
    return this.get('servizi/negozio/mostvisited');
  }

  getNegozi(skipSpinner: boolean = false) {
    let headers = new HttpHeaders();
    if (skipSpinner) {
      headers = headers.set('no-loader-header', 'no-loader-header');
    }
    return this.get('servizi/negozio/mostvisited', {}, headers);
  }

  getCategories() {
    return this.get('servizi/query/mostSearched/categories', {});
  }

}
