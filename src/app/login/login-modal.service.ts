import {Component, Injectable, Type} from '@angular/core';
import {LoginModalComponent} from './login-modal.component';
import {RecoverModalComponent} from './recover-modal.component';
import {RegistrazioneModalComponent} from './registrazione-modal.component';
import {DialogComponent, DialogService} from 'ng6-bootstrap-modal';
import {Observable, Subscription} from 'rxjs';
import {InitialModalComponent} from './initial-modal.component';

@Injectable()
export class LoginModalService {

  activeComponent: Observable<any> = null;

  constructor(private _ds: DialogService) {}

  private switch(to: string | DialogComponent<any, any>, params?: any) {
    let _type: Type<DialogComponent<any, any>> = null;

    switch (to) {
      case 'login':
      case 'LoginModalComponent':
      // case LoginModalComponent:
        _type = LoginModalComponent;
        break;
      case 'registrazione':
      case 'register':
      case 'RegistrazioneModalComponent':
      // case RegistrazioneModalComponent:
        _type = RegistrazioneModalComponent;
        break;
      case 'recover':
      case 'RecoverModalComponent':
      // case RecoverModalComponent:
        _type = RecoverModalComponent;
        break;
      case 'initial':
      case 'InitialModalComponent':
      // case InitialModalComponent:
      default:
        _type = InitialModalComponent;
        break;
    }

    if (this.activeComponent) {
      // this._ds.removeDialog(this.activeComponent);
      this.activeComponent.subscribe(() => {}, () => {}, () => {});
    }

    this.activeComponent = this._ds.addDialog(_type, params);
  }

  public showLogin(params?: any) {
    this.switchToLogin(params);
  }

  public showInitial(params?: any) {
    this.switchToInitial(params);
  }

  public showRecover(params?: any) {
    this.switchToRecover(params);
  }

  public showRegistrazione(params?: any) {
    this.switchToRegistrazione(params);
  }

  public switchToLogin(params?: any) {
    this.switch('login', params);
  }

  public switchToInitial(params?: any) {
    this.switch('initial', params);
  }

  public switchToRecover(params?: any) {
    this.switch('recover', params);
  }

  public switchToRegistrazione(params?: any) {
    this.switch('register', params);
  }
}
