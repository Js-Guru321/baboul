import { Pipe, PipeTransform } from '@angular/core';
import {isObject} from 'rxjs/internal-compatibility';

@Pipe({
  name: 'userPictureOrDefault'
})
export class UserPictureOrDefaultPipe implements PipeTransform {

  private readonly DEFAULT_FALLBACK_IMAGE = 'assets/images/penguin_picture.svg';
  private readonly DEFAULT_PATH_PREFIX = '/shopadvisor/immagini/utenti/';

  transform(value: any, args?: any): any {
    let _value = this.DEFAULT_PATH_PREFIX;

    if (isObject(value) && value != null && value.nomefileimmagine && value.nomefileimmagine != null) {
      _value += value.nomefileimmagine;
    } else if (typeof value === 'string' || value instanceof String) {
      _value += value;
    } else {
      _value = this.DEFAULT_FALLBACK_IMAGE;
    }

    return _value;
  }
}
