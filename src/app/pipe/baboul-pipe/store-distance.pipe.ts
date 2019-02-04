import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'storeDistance'
})
export class StoreDistancePipe implements PipeTransform {

  private availableScales: string[] = ['m', 'km'];

  transform(value: any, asNumber?: any, scale: string = 'auto', digits: number = 1): any {
    let _value = Number(value) || 0,
      times = 0;

    if (scale === 'auto' || !(this.availableScales.indexOf(scale))) {
      while (_value > 1000) {
        _value /= 1000;
        times++;
      }
    } else {
      for (let i = 0, len = this.availableScales.length; i < len && scale !== this.availableScales[times]; i++) {
        _value /= 1000;
        times++;
      }
    }

    if (asNumber) {
      return _value;
    }

    let strValue = _value.toFixed(digits), foundDot = false;
    for (let i = strValue.length - 1; i >= 0; i--) {
      if ((strValue.charAt(i) === '0' || strValue.charAt(i) === '.') && !foundDot) {
        if (strValue.charAt(i) === '.') {
          foundDot = true;
        }
        strValue = strValue.slice(0, i);
      } else {
        break;
      }
    }

    return `${strValue} ${this.availableScales[times]}`;
  }
}
