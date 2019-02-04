import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list.component';
import { RouterModule } from '@angular/router';
import { ListBaseComponent } from './list-base.component';
import { routes } from './list.routing';
import {THEMEMODULE} from '../app.module';
import {NgxPaginationModule} from 'ngx-pagination';
import { ArrayPipesModule} from 'ngx-custom-pipes';
import { FormsModule } from '@angular/forms';
import {SearchModule} from '../search/search.module'
import {FooterModule} from '../footer/footer.module'
import {BaboulPipeModule} from '../pipe/baboul-pipe/baboul-pipe.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ...THEMEMODULE,
    NgxPaginationModule,
    ArrayPipesModule,
    FormsModule,
    SearchModule,
    FooterModule,
    BaboulPipeModule
  ],
  declarations: [ListComponent, ListBaseComponent],

})
export class ListModule { }
