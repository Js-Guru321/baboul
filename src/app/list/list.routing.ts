import { Routes } from '@angular/router';
import {ListComponent} from './list.component';
import {ListBaseComponent} from './list-base.component';

export const routes: Routes = [
    {
      path: '',
      component: ListBaseComponent,
      children:[
        {
          path: 'brand',
          component: ListComponent,
        },
        {
          path: 'categorie',
          component: ListComponent,
        },
        {
          path: 'negozi',
          component: ListComponent,
        },
      ]
    },
  ];
