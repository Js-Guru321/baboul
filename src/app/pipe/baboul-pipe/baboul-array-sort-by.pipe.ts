import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'baboulArraySortBy'
})
export class BaboulArraySortByPipe implements PipeTransform {

    transform(array, reverse = false, prop, isUnder, keyUnder) {
        if (!Array.isArray(array)) {
            return array;
        }
        if (array.length) {

            let sortedArray;
            if (typeof array[0] === "string") {
                sortedArray = array.sort();
            }
            if (typeof array[0] === "number") {
                sortedArray = array.sort((a, b) => a - b);
            }
            if (typeof array[0] === "object" && prop && !isUnder) {
                sortedArray = array.sort((a, b) => a[prop].toString().localeCompare(b[prop].toString()));
            }
            if (typeof array[0] === "object" && prop && isUnder) {
                sortedArray = array.sort((a, b) => a[keyUnder][prop].toString().localeCompare(b[keyUnder][prop].toString()));
            }
            return !reverse ? sortedArray : sortedArray.reverse();
        }
        return array;
    }

}
