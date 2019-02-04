import { Routes } from '@angular/router';
import {HomeComponent} from './home.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'locator',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'locator',
  },
  {
    path: ':type',
    component: HomeComponent,
  },
];
