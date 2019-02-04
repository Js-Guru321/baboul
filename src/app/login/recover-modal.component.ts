import {Component} from '@angular/core';
import {DialogComponent, DialogService} from 'ng6-bootstrap-modal';
import {UserService} from '../api/user.service';
import {Utils} from '../utils';
import {RegistrazioneModalComponent} from './registrazione-modal.component';
import {LoginModalComponent} from './login-modal.component';

export interface RecoverModalModel {
  title: string;
  message: string;
  email: string;
}

@Component({
  selector: 'app-recover-modal',
  templateUrl: 'recover-modal.component.html' ,
  styleUrls: ['./_common.sass', './recover-modal.component.sass']
})
export class RecoverModalComponent extends DialogComponent<RecoverModalComponent, boolean> implements RecoverModalModel {
  title: string;
  message: string;
  email: string;
  loading: any;

  errorResponseMessage: string;

  emailMissmatch: boolean;

  constructor(dialogService: DialogService, private service: UserService) {
    super(dialogService);
    this.emailMissmatch = false;
  }

  confirm() {
    // we set dialog result as true on click on confirm button,
    // then we can get dialog result from caller code
    this.result = true;
    this.close();
  }

  recoverPassword(){
    this.loading = true;
    // setTimeout(() => this.loading = false, 3000);
    const body: any = { };

    if (Utils.trim(this.email) !== '') {
      body.email = Utils.trim(this.email);
    }

    if (!body.email) {
      this.emailMissmatch = true;
      // this.errorResponseMessage = 'Inserisci la password';
    }

    if (this.errorResponseMessage || this.emailMissmatch) {
      this.loading = false;
      return;
    }

    this.service.recover(body).subscribe((res) => {
      console.log(res);
      if (res.code === 'OK_WARN' || res.code === 'KO') {
        this.errorResponseMessage = res.message.capitalize();
      } else if (res.code === 'OK') {
        this.errorResponseMessage = res.message.capitalize();
        console.log(res);
        // this.localStorage.setItem('utente', JSON.stringify(res.utente));
        // this.service.setUser(res.utente);
        this.switchToLogin();
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
    const disposable = this.dialogService.addDialog(RegistrazioneModalComponent, { email: this.email });
  }

  switchToLogin() {
    this.dialogService.removeDialog(this);
    const disposable = this.dialogService.addDialog(LoginModalComponent, { email: this.email });
  }

  onKeyUp($event: KeyboardEvent) {
    if ($event.which === 13) {
      this.recoverPassword();
    }
  }

  onValueChanged($event) {
    const body: any = { };

    if (Utils.trim(this.email) !== '') {
      body.email = Utils.trim(this.email);
    }

    this.emailMissmatch = !body.email;
    this.errorResponseMessage = undefined;

  }

}
