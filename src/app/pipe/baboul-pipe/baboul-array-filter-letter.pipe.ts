import { Pipe, PipeTransform } from '@angular/core';
declare global{
    interface Array <T>{
        reIndexOf(o: T): any;
    }
}

if (typeof Array.prototype.reIndexOf !== 'function') {
    Array.prototype.reIndexOf = function (rx) {
        for (var i in this) {
            if (this[i].toString().match(rx)) {
                return i;
            }
        }
        return -1;
    };
}
@Pipe({
  name: 'baboulArrayFilterLetter'
})
export class BaboulArrayFilterLetterPipe implements PipeTransform {

    public transform(array: any[], searchText?: string, keyName?: string) {
        if (!array || !searchText || !Array.isArray(array)) {
            return array;
        }
        if (typeof array[0] === 'string') {

            // return array.filter((item) => false);
        }
        // filter array, items which match and return true will be
        // kept, false will be filtered out
        if (!keyName) {
            return array.filter((item: any) => {
                for (const key in item) {
                    if (typeof item[key] !== "object" && item[key].toString().match(/^B/)!=null) {
                        return true;
                    }
                }
                return false;
            });
        } else {
            return array.filter((item: any) => {
                const regexp = new RegExp(searchText, 'i');
                if (typeof item[keyName] === 'string' && regexp.test(item[keyName])) {
                    return true;
                }
                return false;
            });
        }

    }
}
