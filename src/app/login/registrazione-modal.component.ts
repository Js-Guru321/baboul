import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {DialogComponent, DialogService} from 'ng6-bootstrap-modal';
import {UserService} from '../api/user.service';
import * as moment from 'moment';
import {Utils} from '../utils';
import {LoginModalComponent} from './login-modal.component';
import {Angulartics2} from 'angulartics2';
import {Angulartics2Facebook} from 'angulartics2/facebook';
import {
  AuthService as SocialAuthService,
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialUser
} from 'angularx-social-login';
import {AppService, ScreenSize} from '../app.service';
import {NbMediaBreakpointsService} from '@nebular/theme';
import {LOCAL_STORAGE} from '../api/window.service';

export interface RegistrazioneModalModel {
  title: string;
  nome: string;
  cognome: string;
  password: string;
  confirmPassword: string;
  email: string;
  datanascita: string;
  alerts: any[];
  campaignAction: () => void;
}

@Component({
  selector: 'app-registrazione-modal',
  templateUrl: './registrazione-modal.component.html',
  styleUrls: ['./_common.sass', './registrazione-modal.component.sass']
})
export class RegistrazioneModalComponent extends DialogComponent<RegistrazioneModalModel, boolean> implements RegistrazioneModalModel, OnInit {
  title: string;
  loading: any;
  nome: string;
  cognome: string;
  password: string;
  confirmPassword: string;
  email: string;
  alerts: any[];
  passwordMissmatch: boolean;
  errorResponseMessage: string;
  datanascita: string;
  birthDateMissmatch: boolean;
  campaignAction: () => void;
  Gender: any

  birthDate: any = {
    day: moment().date(),
    month: moment().month() + 1,
    year: moment().year()
  };

  passwordCheckTimeout = undefined;
  isMobileScreen = false;
  isTabletScreen = false;
  isDesktopScreen = false;

  @Output() onAction: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(@Inject(LOCAL_STORAGE) private localStorage: Storage,
              dialogService: DialogService,
              private service: UserService,
              private angulartics2: Angulartics2,
              private angulartics2Facebook: Angulartics2Facebook,
              private socialAuthService: SocialAuthService,
              private appService: AppService,
              private mediaService: NbMediaBreakpointsService) {
    super(dialogService);
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
    this.alerts = [];
    this.passwordMissmatch = false;
    this.birthDateMissmatch = false;
    if (!this.campaignAction) {
      this.campaignAction = () => {
        this.onAction.emit(true);
      };
    }
  }

  ngOnInit() {
    this.appService.requestUpdateScreenSize();
  }

  private trim(str: string): string {
    if (typeof str === 'string') {
      return str.trim();
    }

    return str;
  }

  confirmPasswordChanged(): void {
    if (this.passwordCheckTimeout) {
      clearTimeout(this.passwordCheckTimeout);
    }

    this.passwordCheckTimeout = setTimeout(() => {
      this.passwordMissmatch = this.trim(this.password) !== this.trim(this.confirmPassword);
    }, 700);
  }

  toggleLoadingAnimation() {
    this.loading = true;

    setTimeout(() => this.loading = false, 3000);

    const _d = Utils.normalizeDateObject(this.birthDate);
    const _datanascita = moment(`${_d.year}-${_d.month}-${_d.day}T00:00:00+00:00`).utc();

    const body = {
      'emails': [{'email': this.email}],
      'nome': this.trim(this.nome),
      'cognome': this.trim(this.cognome),
      'password': this.trim(this.password),
      'datanascita': Utils.formatDateTimeForServer(_datanascita),
      // 'confirmPassword': this.trim(this.confirmPassword),
    };

    // this.alerts.push({"type": "success", "message": 'Email di conferma inviata! '})
    // console.log(this.alerts)
    if (this.trim(this.password) !== this.trim(this.confirmPassword)) {
      this.passwordMissmatch = true;
      this.loading = false;
      return;
    } else {
      this.passwordMissmatch = false;
    }

    this.service.register(body).subscribe((res) => {
      console.log(res);
      if (!res || res.code === 'KO') {
        if (res) {
          this.errorResponseMessage = res.message.capitalize();
        } else {
          this.errorResponseMessage = 'Si è verificato un errore durante la registrazione';
        }
        // this.addAlert({message: res.message.capitalize(), type: 'danger', closeable: true});
      } else {
        this.angulartics2.eventTrack.next({
          action: 'CompleteRegistration',
          properties: { },
        });
        this.errorResponseMessage = undefined;
        console.log(res);
        //
        //   // this.localStorage.setItem('utente', JSON.stringify(res.utente))
        //   // this.service.setUser(res.utente)
        this.localStorage.setItem('utente', JSON.stringify(res.utente));
        this.service.setUser(res.utente);
        if (this.campaignAction) {
            this.campaignAction();
        }
        if (this.onAction) {
            this.onAction.emit(true);
        }
        try {
            this.close();
        } catch (e) { }
      }
    }, () => {}, () => {
      this.loading = false;
    });
  }

  switchToLogin() {
    try {
      this.close();
    } catch (e) { }
    const disposable = this.dialogService.addDialog(LoginModalComponent, {campaignAction: this.campaignAction, email: this.email });
  }

  readdAlert(obj: any, checkDuplicates: boolean = true): void {
    if (checkDuplicates) {
      const duplicates = this.alerts.filter((a) => a.message === obj.message);
      if (duplicates.length > 0) {
        for (let i = 0, len = duplicates.length; i < len; i++) {
          this.onClose(duplicates[i]);
        }
      }
    }

    this.alerts.push(obj);
  }


  action(type: string) {
    let socialPlatformProvider;

    switch (type) {
      case 'facebook':
        socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
        break;
      case 'google':
        socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
        break;
      // case 'linkedin':
      //   socialPlatformProvider = LinkedinLoginProvider.PROVIDER_ID;
      //   break;
      case 'register':
      case 'signup':
        // this.switchToRegister();
        break;
      case 'login-email':
      case 'login':
      case 'signin':
        this.switchToLogin();
        break;
      case 'download-ios':
        // this.window.open('https://itunes.apple.com/it/app/baboul/id1166949662?mt=8', '_blank');
        break;
      default:
        break;
    }

    if (socialPlatformProvider) {
      console.log(`Login with ${socialPlatformProvider}`);

      this.socialAuthService.signIn(socialPlatformProvider).then((userData: SocialUser) => {
        console.log(`${type} sign in data:`, userData);
        this.login(socialPlatformProvider, userData.authToken);
      }, (error) => {
        console.log(error);
      });

    }
  }

  login(provider: string, token: string) {
    this.service.socialLogin(provider, token).subscribe((res) => {
      // console.log(res);
      if (res.code === 'OK_WARN' || res.code === 'KO') {
        this.errorResponseMessage = res.message.capitalize();
      } else if (res.code === 'OK') {
        this.errorResponseMessage = undefined;
        // console.log(res);
        this.localStorage.setItem('utente', JSON.stringify(res.utente));
        this.service.setUser(res.utente);
        if (this.campaignAction) {
            this.campaignAction();
        }
          try {
              this.close();
          } catch (e) { }
      } else {
        this.errorResponseMessage = 'Assicurati di aver inserito correttamente i dati';
      }
    }, (error) => {
      this.errorResponseMessage = 'Assicurati di aver inserito correttamente i dati';
    }, () => {
      this.loading = false;
    });
  }

  onClose(alert) {
    const _index = this.alerts.indexOf(alert);
    const closedAlert = this.alerts.splice(_index, 1);
    console.log('Closed alert:', closedAlert);
  }

  maxDaysForMonth(): number {
    return Utils.daysForMonthYear(this.birthDate.month, this.birthDate.year);
  }

  months() {
    moment.locale('it'); // per avere i mesi in italiano
    return moment.months();
  }

  maxYears() {
    return moment().year() - 10;
  }

  minYears() {
    return moment().year() - 200;
  }

  onDateValuesChange() {
    if (!this.birthDate.year || !(this.birthDate.month + 1) || !this.birthDate.day) {
      this.birthDateMissmatch = true;
    } else {
      const _d = Utils.normalizeDateObject(this.birthDate);
      this.birthDateMissmatch = !moment(`${_d.year}-${_d.month}-${_d.day}T00:00:00+00:00`).utc().isValid();
    }
  }

}
