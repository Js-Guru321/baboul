import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/';

@Injectable()
export class NegozioService extends ApiService {

  list(): Observable<any> {
    return this.get(
    'servizi/negozio/mostvisited',
    );
  }



  getNegozio  (id, latitude, longitude) {
    let url = 'servizi/negozio?id='+id;
    if (latitude != null && longitude != null){
      url = url + '&latitude=' + latitude + '&longitude=' + longitude;
    }
    return this.get(url);
  }
  getNegozioName  (body) {
    console.log(body)
    return this.post('servizi/ricerca/negozi', body);
  }

  getCategories(){
    return this.get('servizi/query/mostSearched/categories', {
    });

  }

}
