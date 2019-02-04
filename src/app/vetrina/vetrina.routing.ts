import { Routes } from '@angular/router';
import {VetrinaComponent} from './vetrina.component';

export const routes: Routes = [
    {  
    path: ':id',
    component: VetrinaComponent,
    },
    {

    path: '',
    component: VetrinaComponent,
  },
];
