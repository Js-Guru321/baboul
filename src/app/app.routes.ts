// Import our dependencies
import { Routes } from '@angular/router';
import { HomeModule } from './home/home.module';
// import { Login } from './login';
// import { Signup } from './signup';
// import { AuthGuard } from './common/auth.guard';

// Define which component should be loaded based on the current URL
export const routes: Routes = [
  // { path: '',       component: Login },
  // { path: 'login',  component: Login },
  // { path: 'signup', component: Signup },
  { path: 'home',    loadChildren: './home/home.module#HomeModule', },
  { path: '**',     redirectTo: 'home' },
];
