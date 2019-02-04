import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserPictureOrDefaultPipe} from './user-picture-or-default.pipe';
import {StorePictureOrDefaultPipe} from './store-picture-or-default.pipe';
import {StoreOpenedPipe} from './store-opened.pipe';
import {StoreGenderPipe} from './store-gender.pipe';
import {MaxPipe, MinBetweenPipe} from './min-max.pipe';
import {StoreDistancePipe} from './store-distance.pipe';
import { BaboulArrayFilterPipePipe } from './baboul-array-filter-pipe.pipe';
import { BaboulArraySortByPipe } from './baboul-array-sort-by.pipe';
import { BaboulArrayFilterLetterPipe } from './baboul-array-filter-letter.pipe';
import { BaboulCategoryTreePipe } from './baboul-category-tree.pipe';
import {LimitToPipe} from 'ngx-select-dropdown/dist/pipes/limit-to.pipe';
import { BaboulArrayLimitToPipe } from './baboul-array-limit-to.pipe';
// import {BlogPictureOrDefaultPipe} from './blog-picture-or-default.pipe';

const PIPES = [
  StorePictureOrDefaultPipe,
  UserPictureOrDefaultPipe,
  StoreOpenedPipe,
  StoreGenderPipe,
  MaxPipe,
  MinBetweenPipe,
  StoreDistancePipe,
  BaboulArrayFilterPipePipe,
  BaboulArraySortByPipe,
  BaboulArrayFilterLetterPipe,
  BaboulCategoryTreePipe,
  BaboulArrayLimitToPipe,
  // BlogPictureOrDefaultPipe
];

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [...PIPES,],
  exports: [...PIPES],
})
export class BaboulPipeModule { }
