import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogComponent } from './blog.component';
import { routes } from './blog.routes';
import { RouterModule } from '@angular/router';
// import { WordPressModule } from 'ng2-wp-api';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    // WordPressModule
  ],
  declarations: [BlogComponent]
})
export class BlogModule { }
