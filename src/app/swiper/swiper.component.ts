import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { SwiperComponent, SwiperDirective, SwiperConfigInterface,
  SwiperScrollbarInterface, SwiperPaginationInterface } from 'ngx-swiper-wrapper';
@Component({
  selector: 'app-swiper',
  templateUrl: './swiper.component.html',
  styleUrls: ['./swiper.component.scss']
})
export class SwiperPageComponent {

    public show: boolean = true;

    negoziMost: any;
    categorieMost: any;
    search: string ='';
    listBrand:any;
    listCategories:any;
    listCategoriesTreeUomo:any;
    listCategoriesTreeDonna:any;
    listNegozi:any;
    showVetrina=false;
    vetrinaNegozi:any;
    @ViewChild(SwiperComponent) componentRef?: SwiperComponent;
    @ViewChild('vetrina') vetrina: ElementRef;
    @ViewChild('item') accordion;
 public slides = [
   'First slide',
   'Second slide',
   'Third slide',
   'Fourth slide',
   'Fifth slide',
   'Sixth slide'
 ];

 public type: string = 'component';

 public disabled: boolean = false;

 public config: SwiperConfigInterface = {
   a11y: true,
   direction: 'horizontal',
   slidesPerView: 1,
   keyboard: true,
   mousewheel: true,
   autoHeight: true,

   scrollbar: false,
   navigation: false,
   pagination: {
   el: '#cpage',
   clickable: true,
   hideOnClick: false
 }
 };

 private scrollbar: SwiperScrollbarInterface = {
   el: '.swiper-scrollbar',
   hide: false,
   draggable: true
 };

 private pagination: SwiperPaginationInterface = {
   el: '#cpage',
   clickable: true,
   hideOnClick: false
 };

 @ViewChild(SwiperDirective) directiveRef?: SwiperDirective;

 constructor() {}

 public toggleType(): void {
   this.type = (this.type === 'component') ? 'directive' : 'component';
 }

 public toggleDisabled(): void {
   this.disabled = !this.disabled;
 }

 public toggleDirection(): void {
   this.config.direction = (this.config.direction === 'horizontal') ? 'vertical' : 'horizontal';
 }

 public toggleSlidesPerView(): void {
   if (this.config.slidesPerView !== 1) {
     this.config.slidesPerView = 1;
   } else {
     this.config.slidesPerView = 2;
   }
 }

 public toggleOverlayControls(): void {
   if (this.config.navigation) {
     this.config.scrollbar = false;
     this.config.navigation = false;

     this.config.pagination = this.pagination;
   } else if (this.config.pagination) {
     this.config.navigation = false;
     this.config.pagination = false;

     this.config.scrollbar = this.scrollbar;
   } else {
     this.config.scrollbar = false;
     this.config.pagination = false;

     this.config.navigation = true;
   }

   if (this.type === 'directive' && this.directiveRef) {
     this.directiveRef.setIndex(0);
   } else if (this.type === 'component' && this.componentRef && this.componentRef.directiveRef) {
     this.componentRef.directiveRef.setIndex(0);
   }
 }

 public toggleKeyboardControl(): void {
   this.config.keyboard = !this.config.keyboard;
 }

 public toggleMouseWheelControl(): void {
   this.config.mousewheel = !this.config.mousewheel;
 }

 public onIndexChange(index: number): void {
   console.log('Swiper index: ', index);

     this.showVetrina = (index==1)? true: false;

 }

 public onSwiperEvent(event: string): void {
   console.log('Swiper event: ', event);
 }
}
