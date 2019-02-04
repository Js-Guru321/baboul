import { Component, OnInit, Inject } from '@angular/core';
import {NbMediaBreakpointsService} from '@nebular/theme';
import { WINDOW } from "../api/window.service";
import {AppService, ScreenSize} from '../app.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.sass']
})
export class FooterComponent implements OnInit {
  isMobileScreen = false;
  isTabletScreen = false;
  isDesktopScreen = false;

  constructor(
    @Inject(WINDOW) private window: Window,
    private mediaService: NbMediaBreakpointsService,
    private appService: AppService,
) {
  this.appService.onScreenResize().subscribe((ss: ScreenSize) => {
      const _w = parent.window.innerWidth;
      if (_w > this.mediaService.getByName('lg').width) {
          // console.log('Large screen');
          this.isDesktopScreen = true;
          this.isTabletScreen = false;
          this.isMobileScreen = false;
      } else if (_w >= this.mediaService.getByName('md').width) {
          // console.log('Small screen');
          this.isDesktopScreen = false;
          this.isTabletScreen = true;
          this.isMobileScreen = false;
      } else {
          this.isDesktopScreen = false;
          this.isTabletScreen = false;
          this.isMobileScreen = true;
      }
      // this.isMobileScreen = _w <= this.mediaService.getByName('is').width;
      // this.isMobileScreen = ss.mobile;
  });
  //
  // const _w = this.window.innerWidth;
  // if (_w >= this.mediaService.getByName('lg').width) {
  //   // console.log('Large screen');
  //   this.isMobileScreen = false;
  // } else {
  //   // console.log('Small screen');
  //   this.isMobileScreen = true;
  // }
}

  ngOnInit() {
      this.appService.requestUpdateScreenSize();
  }

}
