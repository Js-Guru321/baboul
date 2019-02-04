import { Pipe, PipeTransform } from '@angular/core';
import {isObject} from 'rxjs/internal-compatibility';
import {Utils} from '../../utils';

@Pipe({
  name: 'storeGender'
})
export class StoreGenderPipe implements PipeTransform {

  transform(value: any, ...customStrings: string[]): any {
    let _value = '';

    const uomoString = customStrings && customStrings.length >= 1 ? customStrings[0] : 'Uomo';
    const donnaString = customStrings && customStrings.length >= 2 ? customStrings[1] : 'Donna';
    const naString = customStrings && customStrings.length >= 3 ? customStrings[2] : 'Non disponibile';
    const separatorString = customStrings && customStrings.length >= 4 ? customStrings[3] : 'e';

    if (isObject(value) && (value.uomo || value.donna)) {
      if (value.uomo && value.donna) {
        _value = `${uomoString} ${separatorString} ${donnaString}`;
      } else if (value.uomo) {
        _value = uomoString;
      } else if (value.donna) {
        _value = donnaString;
      }
    }

    if (_value === '') {
      _value = naString;
    }

    return _value;
  }
}
