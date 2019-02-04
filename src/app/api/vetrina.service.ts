import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class VetrinaService extends ApiService {
  id: 0;
  list(): Observable<any> {
    return this.get(
    'servizi/negozio/mostvisited',
    );
  }

  getAllPromos(params?: any, skipSpinner: boolean = false) {
    let p = params;

    if (!params) {
      p = {
        'latitudine': 44.475023,
        'longitudine': 11.413611,
      };
    }

    const strUser = this.localStorage.getItem('utente');
    let user = null;

    if (strUser !== '' && strUser != null) {
      user = JSON.parse(strUser);
    }

    let headers = new HttpHeaders();

    if (user != null && !(p.checkFavorites === false || p.checkFavorites === 'false')) {
      p.checkFavorites = 'true';
      headers = headers.set('user_token', user.token);
    }

    if (skipSpinner) {
      headers = headers.set('no-loader-header', 'no-loader-header');
    }

    return this.get('servizi/negozio/promo/all', p, headers);
  }

  getNegozioPromo(id: any) {
    return this.get('servizi/negozio/promo/negozio/' + id);
  }

  abuse(body: any) {
    return this.post('servizi/feedback/report', body);
  }

  setVetrina(id) {
    this.id = id;
  }

  getVetrina() {
    return this.id;
  }
}
