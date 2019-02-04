import {ApiService} from './api.service';
import {Inject, Injectable, OnInit} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {filter, map, tap} from 'rxjs/operators';
import {getDeepFromObject} from './helpers';
import {AppConfig} from '../app.module';
import { HttpClient, HttpParams, HttpRequest, HttpHeaders } from '@angular/common/http';
import {LOCAL_STORAGE} from './window.service';

@Injectable()
export class ChatService extends ApiService {

  subscriber$: Subject<any>;
  observer$: Observable<any>;

  timeout: number = undefined;

  private TIMEOUT = 1000;

  private _messages: any[] = [];

  constructor(@Inject(LOCAL_STORAGE) protected localStorage: Storage,
              @Inject('APP_CONFIG_TOKEN') protected config: AppConfig,
              http: HttpClient ) {
    super(localStorage, config, http);
    this.subscriber$ = new Subject<any>();
    this.observer$ = this.subscriber$.asObservable();
  }

  send(idUtente: number, idNegozio: number, message: string): Observable<any> {

    const body: any = {
      utente: { id: idUtente },
      negozio: { id: idNegozio },
      messaggio: message,
      inseritoDa: 'U',
    };

    return this.post('servizi/chat', body);
  }

  messages(idUtente: number, idNegozio: number, token: string, params?: any, headers?: any) {
    const _headers = new HttpHeaders({
      'user_token': token,
      ...headers,
    });

    if (idUtente && idNegozio) {
      if (!params) {
        params = {};
      }
      params['caller'] = 'U';
    }

    return (this.get('servizi/chat/chats', {
      idUtente, idNegozio, ...params
    }, _headers) as Observable<any>)
      .pipe(
        tap(() => console.log('Received messages...')),
        map((response) => {
          const _chats = getDeepFromObject(response, 'chats', []);
          this.subscriber$.next(_chats);
          return response;
        })
      );
  }

  listenOnNewMessages(idUtente: number, idNegozio: number, token: string, params?: any): Observable<any> {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = undefined;
    }

    setTimeout(() => {
      return this.messages(idUtente, idNegozio, token, params);
    }, this.TIMEOUT);

    return this.observer$;
  }
}
