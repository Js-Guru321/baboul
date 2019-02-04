import {ApiService} from './api.service';
import {Injectable} from '@angular/core';
import {EMPTY, Observable} from 'rxjs/';
import {HttpHeaders} from '@angular/common/http';

@Injectable()
export class ListService extends ApiService {

  getBrand(params?: any, skipSpinner: boolean = false) {
    let headers = new HttpHeaders();
    if (skipSpinner) {
      headers = headers.set('no-loader-header', 'no-loader-header');
    }
    return this.get('servizi/brand/allWithCounter', params, headers);
  }

  getCategories(skipSpinner: boolean = false) {
    let headers = new HttpHeaders();
    if (skipSpinner) {
      headers = headers.set('no-loader-header', 'no-loader-header');
    }
    return this.get('servizi/categoria/all', {}, headers);
  }

  getCategoriesTree(params?: any, skipSpinner: boolean = false) {
    let headers = new HttpHeaders();
    if (skipSpinner) {
      headers = headers.set('no-loader-header', 'no-loader-header');
    }
    return this.get('servizi/categoria/tree/home', params, headers);
  }

  getNegozi(skipSpinner: boolean = false) {
    let headers = new HttpHeaders();
    if (skipSpinner) {
      headers = headers.set('no-loader-header', 'no-loader-header');
    }
    return this.get('servizi/negozio/all', {
      includeNotActive: 'false',
      includeDraft: 'false',
    }, headers);
  }

}
