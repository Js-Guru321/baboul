import {Component, OnInit, ViewChild, ChangeDetectionStrategy, ElementRef, Output, EventEmitter, Inject} from '@angular/core';

import {AppService, ScreenSize} from '../app.service';
import {Angulartics2} from 'angulartics2';
import {UserService} from '../api/user.service';
import {
    AuthService as SocialAuthService,
    FacebookLoginProvider,
    GoogleLoginProvider,
    SocialUser
} from 'angularx-social-login';
import {Angulartics2Facebook} from 'angulartics2/facebook';
import {LoginModalComponent} from '../login/login-modal.component';
import {Utils} from '../utils';
import * as moment from 'moment';
import {LOCAL_STORAGE, WINDOW} from '../api/window.service';


@Component({
  selector: 'app-registrazione',
  templateUrl: './registrazione.component.html',
  styleUrls: ['./registrazione.component.sass']
})
export class RegistrazioneComponent implements OnInit {

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

  birthDate: any = {};

  passwordCheckTimeout = undefined;

  POPUPSHOWED = 'popupShowed';

  constructor(private service: UserService,
              private angulartics2: Angulartics2,
              private angulartics2Facebook: Angulartics2Facebook,
              private socialAuthService: SocialAuthService,
              @Inject(LOCAL_STORAGE) private localStorage: Storage,
              @Inject(WINDOW) private window: Window) {
      this.alerts = [];
      this.passwordMissmatch = false;
      this.birthDateMissmatch = false;
  }

  ngOnInit() {}


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
    public campaignAction(event?: boolean): void  {
      this.localStorage.setItem(this.POPUPSHOWED, 'true');
        this.window.location.href = 'http://baboul.it/sconti';
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
              this.switchToLogin();
          }
      }, () => {}, () => {
          this.loading = false;
      });
  }

  switchToLogin() {
      // this.close();
      // const disposable = this.dialogService.addDialog(LoginModalComponent, { email: this.email });
  }

  addAlert(obj: any, checkDuplicates: boolean = true): void {
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
          //     socialPlatformProvider = LinkedinLoginProvider.PROVIDER_ID;
          //     break;
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
              // this.close();
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
