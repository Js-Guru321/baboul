import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'baboulArrayLimitTo'
})
export class BaboulArrayLimitToPipe implements PipeTransform {

    transform(array, itemsCount, startIndex = 0) {
        if (!Array.isArray(array)) {
            return array;
        }
        return array.slice(startIndex, startIndex + itemsCount);
    }

}
