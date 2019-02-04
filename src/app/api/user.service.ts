import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/';
import {Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {HttpResponse} from '@angular/common/http';

@Injectable()
export class UserService extends ApiService {

  private user = new Subject<any>();

  login(params): Observable<any> {
    return this.get('login/login', params);
  }
  recover(params): Observable<any> {
    return this.get('login/recuperaPassword', params);
  }

  register(body): Observable<any> {
    return this.post('login/registrazione', body);
  }

  setUser(user: any) {
    this.user.next(user);
    // this.localStorage.setItem('utente', user);
  }

  clearUser() {
    this.localStorage.removeItem('utente');
    this.user.next();
  }

  getUser(): Observable<any> {
    return this.user.asObservable();
  }

  socialLogin(provider: string, token: string): Observable<any> {
    const code = `${provider}_${token}`;
    return Observable.create(observer => {
      return this.get(`login/loginSocialAppRedirection/${provider}`, {
        redirect: 'false',
        accessToken: token,
        code: code,
      })
        .subscribe((resp) => {
          return this.login({
            socialcode: code,
          }).subscribe(observer);
        });
    });
  }
}
