import { Pipe, PipeTransform } from '@angular/core';
import {isArray, isObject} from 'rxjs/internal-compatibility';
import {isString} from 'ngx-bootstrap/chronos/utils/type-checks';
import {getDeepFromObject} from '../../api/helpers';

@Pipe({
  name: 'storePictureOrDefault'
})
export class StorePictureOrDefaultPipe implements PipeTransform {
  private readonly DEFAULT_FALLBACK_IMAGE = 'assets/images/store_picture.svg';
  private readonly DEFAULT_PATH_PREFIX = '/shopadvisor/immagini/negozi/';

  transform(value: any, index?: any): any {
    let _value = this.DEFAULT_PATH_PREFIX;
    const _index = index || 0;
    const _paths = [
      `immagini.${_index}.nomeFile`,
      `${_index}.nomeFile`,
      `$$value.${_index}.nomeFile`,
      `nomeFile`,
      `immagini.${_index}.nomeImmagine`,
      `${_index}.nomeImmagine`,
      `$$value.${_index}.nomeImmagine`,
      `nomeImmagine`,
      `negozioNomeImmagine.${_index}.nomeFile`,
      `$$value.${_index}.nomeImmagine`,
    ];

    if (typeof value === 'string') {
      _value += value;
    }

    for (let i = 0, len = _paths.length; i < len && _value === this.DEFAULT_PATH_PREFIX; i++) {
      const _path = _paths[i];
      let _valueCheck = value;
      if (_path.startsWith('$$value')) {
        _valueCheck = {'$$value': value};
      }
      if (getDeepFromObject(_valueCheck, _path, undefined) !== undefined) {
        _value += getDeepFromObject(_valueCheck, _path);
      }
    }

    if (_value === this.DEFAULT_PATH_PREFIX) {
      _value = this.DEFAULT_FALLBACK_IMAGE;
    }

    // if (isObject(value) && isArray(value.immagini) && value.immagini[_index]) {
    //   _value += value.immagini[_index].nomeFile;
    // } else if (isString(value)) {
    //   _value += value;
    // } else {
    //   _value = this.DEFAULT_FALLBACK_IMAGE;
    // }

    return _value;
  }

}
