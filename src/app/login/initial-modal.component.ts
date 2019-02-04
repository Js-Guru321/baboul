import {Component, Inject, OnInit} from '@angular/core';
import {DialogComponent, DialogService} from 'ng6-bootstrap-modal';
import {UserService} from '../api/user.service';
import * as moment from 'moment';
import {Utils} from '../utils';
import {LoginModalComponent} from './login-modal.component';
import {RegistrazioneModalComponent} from './registrazione-modal.component';
import {
  AuthService as SocialAuthService,
  GoogleLoginProvider,
  FacebookLoginProvider, SocialUser,
} from 'angularx-social-login';
import {LOCAL_STORAGE, WINDOW} from '../api/window.service';

export interface InitialModalModel {
  title: string;
  alerts: any[];
}

@Component({
  selector: 'app-initial-modal',
  templateUrl: './initial-modal.component.html',
  styleUrls: ['./_common.sass', './initial-modal.component.sass']
})
export class InitialModalComponent extends DialogComponent<InitialModalModel, boolean> implements InitialModalModel, OnInit {
  title: string;
  loading: any;
  alerts: any[];
  errorResponseMessage: string;

  constructor(private ds: DialogService,
              private service: UserService,
              private socialAuthService: SocialAuthService,
              @Inject(WINDOW) private window: Window,
              @Inject(LOCAL_STORAGE) private localStorage: Storage) {
    super(ds);
    this.alerts = [];
  }

  ngOnInit() { }

  private trim(str: string): string {
    if (typeof str === 'string') {
      return str.trim();
    }

    return str;
  }

  // toggleLoadingAnimation() {
  //   this.loading = true;
  //   setTimeout(() => this.loading = false, 3000);
  //
  //   const _d = Utils.normalizeDateObject(this.birthDate);
  //   const _datanascita = moment(`${_d.year}-${_d.month}-${_d.day}T00:00:00+00:00`).utc();
  //
  //   const body = {
  //     'emails': [{'email': this.email}],
  //     'nome': this.trim(this.nome),
  //     'password': this.trim(this.password),
  //     'datanascita': Utils.formatDateTimeForServer(_datanascita),
  //     // 'confirmPassword': this.trim(this.confirmPassword),
  //   };
  //
  //   // this.alerts.push({"type": "success", "message": 'Email di conferma inviata! '})
  //   // console.log(this.alerts)
  //   if (this.trim(this.password) !== this.trim(this.confirmPassword)) {
  //     this.passwordMissmatch = true;
  //     this.loading = false;
  //     return;
  //   } else {
  //     this.passwordMissmatch = false;
  //   }
  //
  //   this.service.register(body).subscribe((res) => {
  //     console.log(res);
  //     if (res.code === 'KO') {
  //       this.errorResponseMessage = res.message.capitalize();
  //       // this.addAlert({message: res.message.capitalize(), type: 'danger', closeable: true});
  //     } else {
  //       this.errorResponseMessage = undefined;
  //       console.log(res);
  //       //
  //       //   // this.localStorage.setItem('utente', JSON.stringify(res.utente))
  //       //   // this.service.setUser(res.utente)
  //       this.switchToLogin();
  //     }
  //   }, () => {}, () => {
  //     this.loading = false;
  //   });
  // }

  switchToLogin() {
    this.close();
    const disposable = this.ds.addDialog(LoginModalComponent);
  }

  switchToRegister() {
    this.close();
    const disposable = this.ds.addDialog(RegistrazioneModalComponent);
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
        this.switchToRegister();
        break;
      case 'login-email':
      case 'login':
      case 'signin':
        this.switchToLogin();
        break;
      case 'download-ios':
        this.window.open('https://itunes.apple.com/it/app/baboul/id1166949662?mt=8', '_blank');
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
        this.close();
      } else {
        this.errorResponseMessage = 'Assicurati di aver inserito correttamente i dati';
      }
    }, (error) => {
      this.errorResponseMessage = 'Assicurati di aver inserito correttamente i dati';
    }, () => {
      this.loading = false;
    });
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

  onClose(alert) {
    const _index = this.alerts.indexOf(alert);
    const closedAlert = this.alerts.splice(_index, 1);
    console.log('Closed alert:', closedAlert);
  }

}
