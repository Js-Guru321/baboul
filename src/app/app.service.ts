import {AfterContentInit, HostBinding, HostListener, Inject, Injectable} from '@angular/core';
import {NbMediaBreakpointsService} from '@nebular/theme';
import {Observable, Subject} from 'rxjs';
import {filter, share} from 'rxjs/operators';
import {deepExtend} from './api/helpers';
import {DOCUMENT, WINDOW} from './api/window.service';

export class ScreenSize {
  name: string;
  size: {width: number, height: number};
  mobile: boolean;
}

@Injectable()
export class AppService {

  private sub$: Subject<ScreenSize>;

  private readonly screenSize: ScreenSize;

  private active = true;

  public readonly SELECTOR = 'body app-root';

  private _mobileBreakpoint = 'lg';

  private _classesAddedToBody = [];
  private _classesAddedToSelector = [];

  private _observerDialogOverflow: MutationObserver = null;

  private readonly availableBreakpoints = ['is', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'xxxl'];

  constructor(@Inject(WINDOW) private window: Window,
              @Inject(DOCUMENT) private document: Document,
              private mediaService: NbMediaBreakpointsService) {
    this.sub$ = new Subject<any>();
    this.screenSize = new ScreenSize();
    this.window.addEventListener('resize', (event) => {
      this.onWindowResize(event);
    });

    this.observeDialog();

    this.onScreenResize().subscribe((ss: ScreenSize) => {
      // console.log('Screen props: ', this.screenSize);

      const oldClassesB = [...this._classesAddedToBody];
      const oldClassesS = [...this._classesAddedToSelector];

      this._classesAddedToSelector = [];
      this._classesAddedToBody = [];

      if (ss.mobile) {
        this._classesAddedToSelector.push('app-mobile');
        this._classesAddedToBody.push('app-mobile');
      }

      this._classesAddedToBody.push(ss.name);
      this._classesAddedToSelector.push(ss.name);

      // Body classes to be removed
      const diffB = oldClassesB.filter((klass) => {
        return !this._classesAddedToBody.includes(klass);
      });

      // Selector classes to be removed
      const diffS = oldClassesS.filter((klass) => {
        return !this._classesAddedToSelector.includes(klass);
      });

      this.reloadBodyClasses(diffB);
      this.reloadSelectorClasses(diffS);
    });
  }

  private observeDialog(disconnect: boolean = false) {
    // Disabled due a non-compatibility with Safari - Firefox
    // if (!this._observerDialogOverflow) {
    //   this._observerDialogOverflow = new MutationObserver((mutations/*, _observer*/) => {
    //     mutations.forEach((mutation/*, index*/) => {
    //       if (mutation && mutation.target && mutation.type === 'childList' && mutation.target.nodeName === 'DIALOG-HOLDER') {
    //         this.document.body.style.overflow = null;
    //         for (let i = 0, len = mutation.target.childNodes.length; i < len; i++) {
    //           const childNode = mutation.target.childNodes[i];
    //           if (childNode.nodeName === 'DIALOG-WRAPPER') {
    //             this.document.body.style.overflow = 'hidden';
    //             break;
    //           }
    //         }
    //       }
    //     });
    //   });
    // }
    //
    // if (disconnect && this._observerDialogOverflow) {
    //   this._observerDialogOverflow.disconnect();
    // } else if (this._observerDialogOverflow) {
    //   this._observerDialogOverflow.observe(this.document.body, {
    //     childList: true,
    //     subtree: true
    //   });
    // }

  }

  private reloadSelectorClasses(remove: string[] = []) {
    const elem = this.document.querySelector(this.SELECTOR);

    if (!elem) {
      return;
    }

    remove.forEach((klass, index) => {
      elem.classList.remove(klass);
    });

    this._classesAddedToSelector.forEach((klass, index) => {
      if (!elem.classList.contains(klass)) {
        elem.classList.add(klass);
      }
    });
  }

  private reloadBodyClasses(remove: string[] = []) {

    remove.forEach((klass, index) => {
      this.document.body.classList.remove(klass);
    });

    this._classesAddedToBody.forEach((klass, index) => {
      if (!this.document.body.classList.contains(klass)) {
        this.document.body.classList.add(klass);
      }
    });
  }

  public mobileBreakpoint(str?: string): string {
    const _str = str ? str.trim().toLowerCase() : '';

    if (this.availableBreakpoints.indexOf(_str) > -1) {
      this._mobileBreakpoint = _str;
    }

    return `${this._mobileBreakpoint}`;
  }

  public getCurrentScreenSize(): ScreenSize {
    return Object.create(deepExtend({}, this.screenSize)) as ScreenSize;
  }

  public onScreenResize() {
    return this.sub$.pipe(share());
  }

  public requestUpdateScreenSize() {
    this.onWindowResize(null);
  }

  // @HostListener('window:resize', ['$event'])
  private onWindowResize(event) {
    const _w = event && event.target ? event.target.innerWidth : this.window.innerWidth;
    const _h = event && event.target ? event.target.innerHeight : this.window.innerHeight;

    const ss = new ScreenSize();

    ss.size = {
      width: _w,
      height: _h,
    };

    ss.mobile = _w < this.mediaService.getByName(this._mobileBreakpoint).width;
    ss.name = `app-${this.mediaService.getByWidth(_w).name}`;

    if (!this.screenSize.name) {
      this.screenSize.name = ss.name;
    } else if (this.screenSize.name !== ss.name) {
      this.screenSize.name = ss.name;
    }

    this.screenSize.mobile = ss.mobile;
    this.screenSize.size = ss.size;

    this.sub$.next(this.screenSize);
  }
}
