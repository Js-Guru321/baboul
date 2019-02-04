import {Component, Inject, OnInit} from '@angular/core';
import {DialogComponent, DialogService} from 'ng6-bootstrap-modal';
import {UserService} from '../api/user.service';
import * as moment from 'moment';
import {Utils} from '../utils';
import {LoginModalComponent} from '../login/login-modal.component';
import {RegistrazioneModalComponent} from '../login/registrazione-modal.component';
import {AppService, ScreenSize} from '../app.service';
import {NbMediaBreakpointsService} from '@nebular/theme';
import {TempPromoModalModule} from './temp-promo-modal.module';
import {WINDOW} from '../api/window.service';

export interface TempPromoModalModel {
  campaignAction: () => void;
}

@Component({
  selector: 'app-temp-promo-modal',
  templateUrl: './temp-promo-modal.component.html',
  styleUrls: [ './temp-promo-modal.component.sass'],
})
export class TempPromoModalComponent extends DialogComponent<TempPromoModalComponent, boolean> implements TempPromoModalModel, OnInit {
  loading: any;
  alerts: any[];
  errorResponseMessage: string;
  campaignAction: () => void;

  isMobileScreen = false;
  isTabletScreen = false;
  isDesktopScreen = false;

  constructor(private ds: DialogService,
              private service: UserService,
              @Inject(WINDOW) private window: Window,
              private appService: AppService,
              private mediaService: NbMediaBreakpointsService) {
    super(ds);
    this.alerts = [];

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
          // this.isMobileScreen = ss.mobile;
      });
  }

  ngOnInit() {
      this.appService.requestUpdateScreenSize();
  }

  modalAction() {
    this.close();
    this.campaignAction();
  }

  onClose(alert) {
    const _index = this.alerts.indexOf(alert);
    const closedAlert = this.alerts.splice(_index, 1);
    console.log('Closed alert:', closedAlert);
  }
  closeSelf() {
      this.close();
  }
}
