import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
 

const routes: Routes = [
  { path: 'home', loadChildren: './home/home.module#HomeModule' },
  { path: 'registrazione', loadChildren: './registrazione/registrazione.module#RegistrazioneModule'},
  { path: 'logout', loadChildren: './logout/logout.module#LogoutModule' },
  { path: 'negozi', loadChildren: './search-result/search-result.module#SearchResultModule' },
  { path: 'list', loadChildren: './list/list.module#ListModule' },
  { path: 'negozio', loadChildren: './negozio/negozio.module#NegozioModule' },
  { path: 'vetrina', loadChildren: './vetrina/vetrina.module#VetrinaModule' },
  { path: 'preferiti', loadChildren: './preferiti/preferiti.module#PreferitiModule' },
  { path: 'seo', loadChildren: './seo/seo.module#SeoModule' },
  { path: 'sitemap', loadChildren: './sitemap/sitemap.module#SitemapModule' },
  { path: ':luogo', redirectTo: 'negozi/:luogo'},
  { path: ':luogo/:sesso/:param3_', redirectTo: 'negozi/:luogo/:sesso/:param3_'},
  { path: ':luogo/:sesso/:param3_/:param4_', redirectTo: 'negozi/:luogo/:sesso/:param3_/:param4_'},
  { path: ':luogo/:sesso/:param3_/:param4_/:param5_', redirectTo: 'negozi/:luogo/:sesso/:param3_/:param4_/:param5_'},
  { path: '**', redirectTo: 'home' },

];

const config: ExtraOptions = {
  useHash: true,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
