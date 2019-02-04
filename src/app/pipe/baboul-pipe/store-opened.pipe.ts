import { Pipe, PipeTransform } from '@angular/core';
import {isString, isUndefined} from 'ngx-bootstrap/chronos/utils/type-checks';
import {isObject} from 'rxjs/internal-compatibility';
import {Utils} from '../../utils';

@Pipe({
  name: 'storeOpened'
})
export class StoreOpenedPipe implements PipeTransform {

  transform(value: any, asString?: any, customStrings?: string[]): any {
    const result = Utils.checkOpenedStore(value || {});
    const openedString = asString && customStrings && customStrings.length >= 1 && customStrings[0] !== undefined ? customStrings[0] : 'Aperto';
    const closedString = asString && customStrings && customStrings.length >= 2 && customStrings[1] !== undefined ? customStrings[1] : 'Chiuso';
    const naString = asString && customStrings && customStrings.length >= 3 && customStrings[2] !== undefined ? customStrings[2] : 'Non disponibile';

    if (asString === true) {
      return result === undefined ? naString : result ? openedString : closedString;
    }

    return result;
  }
}
