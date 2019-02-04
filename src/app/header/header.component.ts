import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { NbMenuItem, NbSidebarService } from '@nebular/theme';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  mainMenu: NbMenuItem[] = [
     {
       title: 'Docs',
       link: '/docs',
     },
     {
       title: 'Components',
       link: '/docs/components/components-overview',
     },
     {
       title: 'Theme System',
       link: '/docs/guides/theme-system',
     },
     {
       title: 'Auth',
       link: '/docs/auth/introduction',
     },
     {
       title: 'Security',
       link: '/docs/security/introduction',
     },
   ];
  constructor(private router: Router,
) { }

  ngOnInit() {
  }

  goToHome() {
    return this.router.navigateByUrl('home');
  }

}
