import {Component, OnInit, Input, Inject} from '@angular/core';
import {PreferitiService} from '../api/preferiti.service';
import {UserService} from '../api/user.service';
import {DialogService} from 'ng6-bootstrap-modal';
import {LoginModalComponent} from '../login/login-modal.component';
import {InitialModalComponent} from '../login/initial-modal.component';
import {NegozioService} from '../api/negozio.service';
import {LOCAL_STORAGE} from '../api/window.service';


@Component({
  selector: 'app-followButton',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.sass']
})
export class ButtonComponent implements OnInit {

  @Input() negozioID: number;
  @Input() notFollowed = true;
  @Input() small: boolean;
  @Input() onFollow: (any) => {};
  @Input() parentController: any;

  user: any;
  alerts = [];

  private _negozio: any;

  constructor(@Inject(LOCAL_STORAGE) private localStorage: Storage,
              private preferiti: PreferitiService,
              private dialogService: DialogService,
              private userService: UserService,
              private negozioService: NegozioService) {
    if (this.localStorage.getItem('utente') != '') {
      this.user = JSON.parse(this.localStorage.getItem('utente'));
      this.userService.getUser().subscribe(user => {
        if (user != null) {
          this.user = user;
        } else {
          this.user = null;
        }
      });
    }
  }

  ngOnInit() {
    // if ((this.negozioID || this.negozioID === 0) && !this.negozio) {
    //   this.negozioService.getNegozio(this.negozioID).subscribe((res) => {
    //     console.log(res);
    //   });
    // } else if (this.negozio) {
    //   this._negozio = this.negozio;
    // }
  }

  onClick(){
    if (this.user == null) {
      let disposable = this.dialogService.addDialog(InitialModalComponent, {});
    } else {

      const body = {
        'utente': {
          'id': this.user.id
        },
        'negozio': {
          'id': this.negozioID
        }
      };
      if (this.notFollowed) {

          this.preferiti.createPreferito(body).subscribe((res) => {
              console.log(res);
              if (res.code === 'OK') {
                  this.alerts.push({'message': 'negozio Aggiunto ai preferiti'});
                  this.notFollowed = false;
                  if (this.parentController !== undefined)  {
                      this.onFollow(this.parentController);
                  }
                  // setTimeout(()=>{this.alerts.pop()}, 3000);
              }
          });

          this.preferiti.createSeguito(body).subscribe((res) => {
              console.log(res);
              if (res.code === 'OK') {
                  this.alerts.push({'message': 'negozio Aggiunto ai preferiti'});
                  this.notFollowed = false;
                  if (this.parentController !== undefined)  {
                      this.onFollow(this.parentController);
                  }
                  // setTimeout(()=>{this.alerts.pop()}, 3000);
              }
          });
      } else {
          this.preferiti.removePreferito(body).subscribe((res) => {
              console.log(res);
              if (res.code === 'OK') {
                  this.alerts.push({'message': 'negozio Aggiunto ai preferiti'});
                  this.notFollowed = true;
                  if (this.parentController !== undefined)  {
                      this.onFollow(this.parentController);
                  }
                  // setTimeout(()=>{this.alerts.pop()}, 3000);
              }
          });

          // this.preferiti.removeSeguito(body).subscribe((res) => {
          //     console.log(res);
          //     if (res.code === 'OK') {
          //         this.alerts.push({'message': 'negozio Aggiunto ai preferiti'});
          //         this.notFollowed = true;
          //         if (this.parentController !== undefined)  {
          //             this.onFollow(this.parentController);
          //         }
          //         // setTimeout(()=>{this.alerts.pop()}, 3000);
          //     }
          // });
      }
    }

  }

}
