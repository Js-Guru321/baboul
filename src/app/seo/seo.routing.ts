import { Routes } from '@angular/router';
import {SeoComponent} from './seo.component';

export const routes: Routes = [
  {
    path: ':locality/:category/:gender/:brand',
    component: SeoComponent,
  },
  {
    path: ':locality/:category/:genderOrBrand',
    component: SeoComponent,
  },
  {
    path: ':locality/:categoryOrGenderOrBrand',
    component: SeoComponent,
  },
  {
    path: ':locality',
    component: SeoComponent,
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'home'
  },
];
