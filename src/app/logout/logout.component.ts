import {Component, AfterViewInit} from '@angular/core';
import {UserService} from '../api/user.service';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-logout',
  template: `<ng-content></ng-content>`,
})
export class LogoutComponent implements AfterViewInit {

  constructor(private userService: UserService, private router: Router) { }

  ngAfterViewInit(): void {
    this.userService.clearUser();
    this.router.navigate(['/home']);
  }

}
