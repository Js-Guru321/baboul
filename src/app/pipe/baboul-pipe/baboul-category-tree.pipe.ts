import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'baboulCategoryTree'
})
export class BaboulCategoryTreePipe implements PipeTransform {

    public transform(array: any[], path: any, step?: number) {
        let index = step? step : 2
        if (!array || !Array.isArray(array)) {
            return array;
        }
        return array.filter((item) => {
            return (item.treepath.split('.')[index] == path)? true : false

        });

    }

}
