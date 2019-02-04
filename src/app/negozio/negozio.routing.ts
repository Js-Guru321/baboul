import { Routes } from '@angular/router';
import {NegozioComponent} from './negozio.component';
import {NegozioBaseComponent} from './negozio-base.component';

export const routes: Routes = [
    {
      path: '',
      component: NegozioBaseComponent,
      children:[
        // {
        //   path: ':id',
        //   component: NegozioComponent,
        // },
        {
          path: ':name',
          component: NegozioComponent,
        },
    ]
  },
];
