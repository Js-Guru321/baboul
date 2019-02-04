import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'max'
})
export class MaxPipe implements PipeTransform {

  transform(value: any, ...values: any[]): any {
    return factory.apply(null, ['max', value, ...values]);
  }
}

@Pipe({
  name: 'minBetween'
})
export class MinBetweenPipe implements PipeTransform {
  transform(value: any, ...values: any[]): any {
    return factory.apply(null, ['min', value, ...values]);
  }
}

const factory = function (method, value: any, ...values: any[]): any {
  let _method = method;
  const _values = values || [];

  if (typeof _values[0] === 'boolean' && !!_values[0]) {
    _method = _method === 'min' ? 'max' : 'min';
    _values.splice(0, 1);
  }

  return Math[_method].apply(null, [...[value], ..._values]);
};
