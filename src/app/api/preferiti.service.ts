
import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class PreferitiService extends ApiService {

  list(): Observable<any> {
    return this.get(
    'servizi/negozio/mostvisited',
    );
  }


  getAllPromos(params?: any) {
    let p = params;
    if (!params) {
      p = {
        'latitudine': 44.475023,
        'longitudine': 11.413611
      };
    }

    return this.get('servizi/negozio/promo/all', p);
  }

  getNegoziPreferiti(token: string, params?: any) {
    const headers = new HttpHeaders({
        'user_token': token
    });
    let p = params;

    if (!params) {
        p = {
            'latitudine': 44.475023,
            'longitudine': 11.413611
        };

    }
    return this.get('servizi/utente/negozio/preferito', p, headers);
  }

  getNegoziSeguiti(token: string) {
    const headers = new HttpHeaders({
      'user_token': token
    });

    return this.get('servizi/utente/negozio/seguito', null, headers);
  }

  getPromosPreferiti(token: string, params?: any) {
    const headers = new HttpHeaders({
      'user_token': token
    });
    let p = params;

    if (!params) {
      p = {
        'latitudine': 44.475023,
        'longitudine': 11.413611
      };

    }
    return this.get('servizi/utente/promo/preferito', p, headers);

  }

  createPreferito(body: any) {
    return this.post('servizi/utente/negozio/preferito', body);

  }
  removePreferito(body: any) {
    return this.deleteWithBody('servizi/utente/negozio/preferito', null, body);
  }
  createSeguito(body: any) {
    return this.post('servizi/utente/negozio/seguito', body);
  }
  removeSeguito(body: any) {
      return this.deleteWithBody('servizi/utente/negozio/seguito', null, body);
  }

  addFavoritePromo(body: any) {
    return this.post('servizi/utente/promo/preferito', body);
  }

  deleteFavoritePromo(body: any) {
    return this.deleteWithBody('servizi/utente/promo/preferito', undefined, body);
  }

  abuse(body: any) {
    return this.post('servizi/feedback/report', body);
  }

}
