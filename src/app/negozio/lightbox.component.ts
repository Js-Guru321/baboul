import { Component } from '@angular/core';
import { DialogComponent, DialogService } from 'ng6-bootstrap-modal';
import {UserService} from '../api/user.service';
import {SwiperConfigInterface} from 'ngx-swiper-wrapper';

export interface LightBoxModel {
  images: any;
  index: number;
}

@Component({
  selector: 'app-lightbox',
  templateUrl: 'lightbox.component.html',
  styleUrls: ['./lightbox.component.sass']
})
export class LightboxComponent extends DialogComponent<LightBoxModel, boolean> implements LightBoxModel {
  images: any;
  index = 0;
  length: number;

  swiperConfig: SwiperConfigInterface = {
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },
    // navigation: true,
    // lazy: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      type: 'bullets',
      // bulletClass: 'swiper-pagination-bullet',
      // bulletActiveClass: 'swiper-pagination-bullet-active',
    },
  };

  constructor(dialogService: DialogService, private service: UserService) {
    super(dialogService);
    if (this.images) {
      this.length = this.images.length;
      this.index = this.index < this.length && this.index > 0 ? this.index : 0;
    } else {
      this.images = [];
      this.index = 0;
    }
  }

  confirm() {
    // we set dialog result as true on click on confirm button,
    // then we can get dialog result from caller code
    this.result = true;
    this.close();
  }

  next() {
    this.index++;
  }

  prev() {
    this.index--;
  }

  hasNext(): boolean {
    return this.index < this.images.length - 1;
  }

  hasPrevious(): boolean {
    return this.index > 0;
  }

  goTo(index: number = 1): void {
    if (index >= 0 && index <= this.images.length - 1) {
      this.index = index;
    }
  }
}
