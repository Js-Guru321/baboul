import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchResultComponent } from './search-result.component';
import { RouterModule } from '@angular/router';
import { routes } from './search.routing';
import {THEMEMODULE} from '../app.module';
import { SearchBaseComponent} from './search-base.component';
import { ArrayPipesModule} from 'ngx-custom-pipes';
import { FormsModule } from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import {SearchModule} from '../search/search.module';
import {FooterModule} from '../footer/footer.module';
import {FollowButtonModule} from '../follow-button/follow-button.module';
import {NguiMapModule} from '@ngui/map';
import {BaboulPipeModule} from '../pipe/baboul-pipe/baboul-pipe.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ArrayPipesModule,
    NgxPaginationModule,
    SearchModule,
    FooterModule,
    RouterModule.forChild(routes),
    ...THEMEMODULE,
    FollowButtonModule,
    NguiMapModule.forRoot({apiUrl: 'https://maps.google.com/maps/api/js?key=AIzaSyCpId7NUs0tR1jYJWQYeH0_aj6y2aOygI8&v=3'}),
    BaboulPipeModule,
  ],
  declarations: [SearchResultComponent, SearchBaseComponent]
})
export class SearchResultModule { }
