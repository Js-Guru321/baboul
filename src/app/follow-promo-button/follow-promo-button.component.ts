import {Component, OnInit, Input, Output, Inject} from '@angular/core';
import {PreferitiService} from '../api/preferiti.service';
import {UserService} from '../api/user.service';
import {DialogService} from 'ng6-bootstrap-modal';
import {LoginModalComponent} from '../login/login-modal.component';
import {InitialModalComponent} from '../login/initial-modal.component';
import {NegozioService} from '../api/negozio.service';
import {concat, timer} from 'rxjs';
import {LOCAL_STORAGE} from '../api/window.service';


@Component({
  selector: 'app-follow-promo-button',
  templateUrl: './follow-promo-button.component.html',
  styleUrls: ['./follow-promo-button.component.sass'],
  exportAs: 'followButtonPromo'
})
export class FollowPromoButtonComponent implements OnInit {

  @Input() promoId: number;
  @Input() storeId: number;

  @Input() promo: any;
  @Input() store: any;

  @Input() type: string;

  @Input() small: boolean;

  @Input() onFollow: (any) => {};
  @Input() parentController: any;

  public title = 'Follow';
  public size = 'medium';

  protected followed = false;

  private user: any;

  private _promo: any;
  private _store: any;

  protected isAnimating = false;

  constructor(@Inject(LOCAL_STORAGE) private localStorage: Storage,
              private preferitiService: PreferitiService,
              private dialogService: DialogService,
              private userService: UserService) {
    if (!this.type) {
      this.type = 'button';
    }
  }
  ngOnInit() {
    if (this.localStorage.getItem('utente') !== '' && this.localStorage.getItem('utente') != null) {
      this.user = JSON.parse(localStorage.getItem('utente'));
      this.userService.getUser().subscribe((user) => {
        this.user = user;
        this.loadInitial();
      });
    }
    if (this.small) {
      this.size = 'small';
    }
    if (this.promo) {
      this.followed = this.promo.preferito;
    }
  }

  private loadInitial() {
    // if ((this.negozioId || this.negozioId === 0) && !this.negozio) {
    //   this.negozioService.getNegozio(this.negozioId).subscribe((res) => {
    //     console.log(res);
    //   });
    // } else if (this.negozio) {
    //   this._negozio = this.negozio;
    // }
  }

  onClick() {
    if (this.user == null) {
      const disposable = this.dialogService.addDialog(InitialModalComponent, {});
    } else {
      const promoId = this.promo && this.promo.id >= 0 ? this.promo.id : this.promoId;

      const followBody = {
        'utente': {
          'id': this.user.id
        },
        'negozio': {
          'id': this.storeId
        }
      };

      const favoriteBody = {
        'utente': {
          'id': this.user.id
        },
        'promo': {
          'id': promoId
        }
      };

      let favoritePromo$ = this.preferitiService.addFavoritePromo(favoriteBody);

      if (this.followed) {
        favoritePromo$ = this.preferitiService.deleteFavoritePromo(favoriteBody);
      }

      favoritePromo$.subscribe((res) => {
        console.log(res);
        if (res.code === 'OK') {
          if (this.onFollow !== undefined){
              this.onFollow(this.parentController);
          }
          this.followed = !this.followed;
        }
      });

      if (this.storeId && this.storeId === 0) {
        this.preferitiService.createSeguito(followBody).subscribe((res) => {
          console.log(res);
          if (res.code === 'OK') {
              if (this.onFollow !== undefined){
                  this.onFollow(this.parentController);
              }
            this.followed = true;
          }
        });
      }
    }
  }
  animate() {
    this.isAnimating = true;
    const source = timer(400);
    source.subscribe(val => this.isAnimating = false);
  }

}
