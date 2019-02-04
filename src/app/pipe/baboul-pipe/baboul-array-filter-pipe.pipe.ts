import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'baboulArrayFilterPipe'
})
export class BaboulArrayFilterPipePipe implements PipeTransform {

    transform(array: any[], searchText: string, keyName: string, isUnder: boolean, keyUnder: string): any[] {
        if (!array || !searchText || !Array.isArray(array)) {
          return array;
        }
        if (typeof array[0] === 'string') {
            return array.filter((item) => item.indexOf(searchText) > -1);
        }
        // filter array, items which match and return true will be
        // kept, false will be filtered out
        if (!keyName) {
            return array.filter((item) => {
                for (const key in item) {
                    let ciccio = key;
                    if (typeof item[key] !== "object" && item[key].toString().toLowerCase().indexOf(searchText.toLowerCase()) > -1) {
                        return true;
                    }
                }
                return false;
            });
        } else {
            if (!isUnder) {
                return array.filter((item) => {
                    if (typeof item[keyName] !== "object" && item[keyName].toString().toLowerCase().indexOf(searchText.toLowerCase()) > -1) {
                        return true;
                    }
                    return false;
                });
            } else {
                return array.filter((item) => {
                    if (typeof item[keyUnder][keyName] !== "object" && item[keyUnder][keyName].toString().toLowerCase().indexOf(searchText.toLowerCase()) > -1) {
                        return true;
                    }
                    return false;
                });
            }
        }
    }

}
