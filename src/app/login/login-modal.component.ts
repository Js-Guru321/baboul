import {Component, Inject} from '@angular/core';
import {DialogComponent, DialogService} from 'ng6-bootstrap-modal';
import {UserService} from '../api/user.service';
import {RegistrazioneModalComponent} from './registrazione-modal.component';
import {Utils} from '../utils';
import {RecoverModalComponent} from './recover-modal.component';
import {InitialModalComponent} from './initial-modal.component';
import {LOCAL_STORAGE} from '../api/window.service';

export interface LoginModalModel {
  title: string;
  message: string;
  email: string;
  password: string;
  campaignAction: () => void;
}

@Component({
  selector: 'app-login-modal',
  templateUrl: 'login-modal.component.html' ,
  styleUrls: ['./_common.sass', './login-modal.component.sass']
})
export class LoginModalComponent extends DialogComponent<LoginModalModel, boolean> implements LoginModalModel {
  title: string;
  message: string;
  email: string;
  password: string;
  loading: any;
  campaignAction: () => void;

  errorResponseMessage: string;

  emailMissmatch: boolean;
  passwordMissmatch: boolean;

  constructor(@Inject(LOCAL_STORAGE) private localStorage: Storage,
              dialogService: DialogService,
              private service: UserService) {
    super(dialogService);
    this.passwordMissmatch = this.emailMissmatch = false;
  }

  confirm() {
    // we set dialog result as true on click on confirm button,
    // then we can get dialog result from caller code
    this.result = true;
    this.close();
  }

  toggleLoadingAnimation() {
    this.loading = true;
    // setTimeout(() => this.loading = false, 3000);
    const body: any = { };

    if (Utils.trim(this.email) !== '') {
      body.email = Utils.trim(this.email);
    }

    if (Utils.trim(this.password) !== '') {
      body.password = Utils.trim(this.password);
    }

    if (!body.email) {
      this.emailMissmatch = true;
      // this.errorResponseMessage = 'Inserisci la password';
    }

    if (!body.password) {
      this.passwordMissmatch = true;
      // this.errorResponseMessage = 'Inserisci l\'indirizzo email';
    }

    if (this.errorResponseMessage || this.passwordMissmatch || this.emailMissmatch) {
      this.loading = false;
      return;
    }

    this.service.login(body).subscribe((res) => {
      console.log(res);
      if (res.code === 'OK_WARN' || res.code === 'KO') {
        this.errorResponseMessage = res.message.capitalize();
      } else if (res.code === 'OK') {
        this.errorResponseMessage = undefined;
        console.log(res);
        this.localStorage.setItem('utente', JSON.stringify(res.utente));
        this.service.setUser(res.utente);
        if (this.campaignAction) {
            this.campaignAction();
        }
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

  switchToRegister() {
    this.dialogService.removeDialog(this);
    const disposable = this.dialogService.addDialog(RegistrazioneModalComponent, {  });
  }

  switchToForgotPassword() {
    this.dialogService.removeDialog(this);
    const disposable = this.dialogService.addDialog(RecoverModalComponent, {  });
  }

  onKeyUp($event: KeyboardEvent) {
    if ($event.which === 13) {
      this.toggleLoadingAnimation();
    }
  }

  onValueChanged($event) {
    const body: any = { };

    if (Utils.trim(this.email) !== '') {
      body.email = Utils.trim(this.email);
    }

    if (Utils.trim(this.password) !== '') {
      body.password = Utils.trim(this.password);
    }

    this.emailMissmatch = !body.email;
    this.passwordMissmatch = !body.password;
    this.errorResponseMessage = undefined;

  }

}
