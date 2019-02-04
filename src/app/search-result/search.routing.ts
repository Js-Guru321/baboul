import { Routes } from '@angular/router';
import {SearchResultComponent} from './search-result.component';
import {SearchBaseComponent} from './search-base.component';
 
/*
### URL MAPPING ###
/luogo
/luogo/sesso/categoria
    /luogo/sesso/categoria/pagina
    /luogo/sesso/categoria/brand/
        /luogo/sesso/categoria/brand/pagina
/luogo/sesso/brand
    /luogo/sesso/brand/pagina

### PARSING PSEUDO-CODE ###
param1/param2/param3_/param4_/param5_
if num(params) > 2 
    if param3_ == 'CATEGORIA'(
        se param4_ == NUMERIC
            pagina = param4_
        else 
            brand = param4_
            pagina = param5_*
    ) 
    else( param3_ == 'BRAND')
        brand = param3_
        pagina = param_4*
    )
*/ 

export const routes: Routes = [
    {
    path: '',
    component: SearchBaseComponent,
    children:[
      {
        path: ':luogo',
        component: SearchResultComponent,
      },
      {
        path: ':luogo/:sesso/:param3_',
        component: SearchResultComponent,
      },
      {
        path: ':luogo/:sesso/:param3_/:param4_',
        component: SearchResultComponent,
      },
      {
        path: ':luogo/:sesso/:param3_/:param4_/:param5_',
        component: SearchResultComponent,
      }
      /*
      {
        path: 'brand/:brand',
        component: SearchResultComponent,
      },
      {
        path: 'categorie/:categorie',
        component: SearchResultComponent,
      },
      {
        path: 'luogo/:luogo',
        component: SearchResultComponent,
      },
      {
        path: 'brand/:brand/luogo/:luogo',
        component: SearchResultComponent,
      },
      {
        path: 'categorie/:categorie/brand/:brand',
        component: SearchResultComponent,
      },
      {
        path: 'categorie/:categorie/brand/:brand/luogo/:luogo',
        component: SearchResultComponent,
      },
      {
        path: 'categorie/:categorie/brand/:brand/luogo:luogo/negozio:negozio',
        component: SearchResultComponent,
      },
      {
        path: 'categorie/:categorie/luogo:luogo',
        component: SearchResultComponent,
      },
*/

    ]
  },
];
