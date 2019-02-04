import {Inject, Injectable, EventEmitter} from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpHeaders } from '@angular/common/http';

import {Http, RequestMethod, RequestOptions, URLSearchParams} from '@angular/http';
import {AppConfig} from '../app.module';
import {Observable} from 'rxjs';
import {LOCAL_STORAGE} from './window.service';

// import 'rxjs/add/operator/map';

/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class ApiService {

  public static GET = 'get';
  public static POST = 'post';
  public static PUT = 'put';
  public static DELETE = 'delete';
  public static OPTIONS = 'options';
  public static PATCH = 'path';
  public static COPY = 'copy';
  public static HEAD = 'head';
  public static LINK = 'link';
  public static UNLINK = 'unlink';
  public static PURGE = 'purge';
  public static LOCK = 'lock';
  public static UNLOCK = 'unlock';
  public static PROPFIND = 'propfind';
  public static VIEW = 'view';

  public static SEPARATOR = '/';
  url = '';

  constructor(@Inject(LOCAL_STORAGE) protected localStorage: Storage,
              @Inject('APP_CONFIG_TOKEN') protected config: AppConfig,
              private http: HttpClient) {
    this.url = this.config.BASE_URL;
  }

  get(endpoint: string, params?: any, headers?: HttpHeaders): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token'
      })
    };

    if (!headers) {
      headers = new HttpHeaders();
    }

    // Support easy query params for GET requests
    let opts = {};
    if (params) {
      if (params._opts) {
        opts = Object.assign(opts, params._opts);
        delete params._opts;
      }
      const p = new HttpParams();
      for (const k in params) {
        if (params.hasOwnProperty(k)) {
          p.set(k, params[k]);
        }
      }
      // Set the search field if we have params and don't already have
      // a search field set in options.
      // headers.search = !headers.search && p || headers.search;
    }

    return this.http.get(this.url + '/' + endpoint, {headers, params, ...opts});
  }

  post(endpoint: string, body: any, options?: HttpHeaders): Observable<any> {
    return this.http.post(this.url + '/' + endpoint, body, {headers: options});
  }

  put(endpoint: string, body: any, options?: HttpHeaders): Observable<any> {
    return this.http.put(this.url + '/' + endpoint, body, {headers: options});
  }

  delete(endpoint: string, options?: HttpHeaders): Observable<any> {
    return this.http.delete(this.url + '/' + endpoint, {headers: options});
  }

  deleteWithBody(endpoint: string, options?: HttpHeaders, body?: any): Observable<any> {
    return this.http.request(ApiService.DELETE, this.url + '/' + endpoint, {headers: options, body: body});
  }

  patch(endpoint: string, body: any, options?: HttpHeaders): Observable<any>  {
    return this.http.patch(this.url + '/' + endpoint, body, {headers: options});
  }
}
