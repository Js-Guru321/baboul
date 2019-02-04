import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/';
import {Subject} from 'rxjs';

@Injectable()
export class HeaderService extends ApiService {

private index = new Subject<any>();









  setIndex(index: any) {
    this.index.next(index);
  }



  getIndex(): Observable<any> {
    return this.index.asObservable();
  }


}
