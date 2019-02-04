import {
  AfterContentChecked,
  AfterContentInit, ApplicationRef,
  Component, ComponentFactoryResolver, ContentChildren, ElementRef, EmbeddedViewRef,
  EventEmitter, Inject, Injector, OnDestroy,
  OnInit,
  Output,
  Renderer2, TemplateRef, ViewChild, ViewContainerRef,
} from '@angular/core';
import {UserService} from '../api/user.service';
import {NbChatComponent, NbChatFormComponent} from '@nebular/theme';
import {ChatService} from '../api/chat.service';
import {getDeepFromObject} from '../api/helpers';
import {Utils} from '../utils';
import * as moment from 'moment';
import {DialogService} from 'ng6-bootstrap-modal';
import {Subscription} from 'rxjs';
import {LoginModalComponent} from '../login/login-modal.component';
import {LoginModalService} from '../login/login-modal.service';
import {DOCUMENT} from '../api/window.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.sass'],
})
export class ChatComponent implements OnInit, AfterContentChecked, AfterContentInit, OnDestroy {
  messages: any[] = [];
  hideMessages = true;
  user: any;

  @ViewChild('loading') loadingContainer: TemplateRef<any>;
  @ViewChild('chat') chatCmp: NbChatComponent;

  public isSending = false;
  private isLoading = false;

  private DEFAULT_NAME = 'Baboul';

  private interval: any = undefined;

  private userSubscription$: Subscription;

  @Output('onChatShown') onChatShown$: EventEmitter<any>;

  private closeElementRef: HTMLElement = undefined;

  constructor(private userService: UserService,
              private renderer: Renderer2,
              @Inject(DOCUMENT) private document: Document,
              private chatService: ChatService,
              private dialogService: DialogService,
              private componentFactoryResolver: ComponentFactoryResolver,
              private appRef: ApplicationRef,
              private injector: Injector,
              private loginModalService: LoginModalService) {
    this.onChatShown$ = new EventEmitter<any>();

    // if (this.localStorage.getItem('utente') !== '') {
    // this.user = JSON.parse(this.localStorage.getItem('utente'));
    this.userSubscription$ = this.userService.getUser().subscribe(user => {
      this.loadDefaultMessages();
      if (user != null) {
        this.user = user;
        this.loadChats();
      } else {
        this.user = null;
      }
    });

    this.interval = setInterval(() => {
      this.loadChats();
    }, 2500);
    // }

  }

  loadDefaultMessages(clear: boolean = true) {
    if (clear) {
      this.messages = [];
    }

    this.messages.push({
      id: -1,
      text: 'Ciao, per qualsiasi informazione su come usare il servizio, o per segnalare eventuali problemi, questo è lo spazio giusto!',
      date: new Date(),
      reply: false,
      type: 'text',
      user: {
        name: this.DEFAULT_NAME,
        avatar: undefined
      },
    });
  }

  loadChats() {
    if (!this.user || this.hideMessages || this.isLoading) {
      return;
    }

    this.isLoading = true;

    this.chatService.messages(this.user.id, 1, this.user.token, {order: 'ASC'}, {'no-loader-header': 'no-loader-header'})
      .subscribe((resp) => {
        console.log(resp);
        if (resp.code === 'OK') {
          const items = getDeepFromObject(resp, 'chats.0.chatItemsList', [])
            .map((message) => {
              return {
                id: message.id,
                text: message.messaggio,
                date: moment(message.dateCreated, Utils.SERVER_DATETIME_FMT).toDate(),
                reply: message.inseritoDa === 'U',
                type: 'text',
                files: [],
                user: {
                  name: message.inseritoDa === 'U' ? this.user.nome + ' ' + this.user.cognome : this.DEFAULT_NAME,
                  avatar: message.inseritoDa === 'U' ? this.user.nomefileimmagine : undefined,
                },
              };
            });
          const messages = items.filter((m) => {
            return this.messages.filter((mm) => m.id === mm.id).length === 0;
          });

          if (messages.length > 0) {
            console.log(`${messages.length} new messages:`, messages);
            this.messages.push.apply(this.messages, messages);
          } else {
            console.log(`No new messages.`);
          }
        }
      }, (error) => {
        console.error(error);
      }, () => {
        console.log('Completed');
        this.isLoading = false;
      });
  }

  sendMessage(event: any) {
    if (!event || !event.message || event.message.trim().length === 0) {
      return;
    }

    console.log(this.user);
    const files = !event.files ? [] : event.files.map((file) => {
      return {
        url: file.src,
        type: file.type,
        icon: 'nb-compose',
      };
    });

    this.isSending = true;
    this.chatService.send(this.user.id, 1, event.message).subscribe((resp) => {
      if (resp && resp.code === 'OK') {
        const utente = getDeepFromObject(resp, 'chatUtenteNegozio.utente', {});
        const negozio = getDeepFromObject(resp, 'chatUtenteNegozio.negozio', {});
        const mess = getDeepFromObject(resp, 'chatUtenteNegozio.messaggio', '');
        const date = getDeepFromObject(resp, 'chatUtenteNegozio.dateCreated', moment().format(Utils.SERVER_DATETIME_FMT));
        const inseritoDa = getDeepFromObject(resp, 'chatUtenteNegozio.inseritoDa', 'U');
        const messageId = getDeepFromObject(resp, 'chatUtenteNegozio.id', -1);

        const exists = this.messages.filter((m) => {
          return m.id * 1 === messageId * 1;
        });

        if (exists.length === 0) {
          this.messages.push({
            id: messageId,
            text: mess,
            date: moment(date, Utils.SERVER_DATETIME_FMT).toDate(),
            reply: inseritoDa === 'U',
            type: files.length ? 'file' : 'text',
            files: files,
            user: {
              name: this.user.nome + ' ' + this.user.cognome,
              avatar: this.user.nomefileimmagine,
            },
          });
        }

      }

      console.log(resp);
    }, (error) => {
      console.error(error);
    }, () => {
      this.isSending = false;
      this.loadChats();
    });
  }

  ngOnInit() {

  }

  ngAfterContentChecked(): void {
    if (this.document.querySelector('nb-chat div.messages > .no-messages') != null) {
      this.document.querySelector<HTMLElement>('nb-chat div.messages > .no-messages').innerText = 'Nessun messaggio';
    }
    if (this.document.querySelector('nb-chat-form div > input') != null) {
      this.renderer.setAttribute(this.document.querySelector('nb-chat-form div > input'), 'placeholder', 'Scrivi un messaggio...');
    }
    if (this.document.querySelector('nb-chat .header .close') === null) {
      this.closeElementRef = this.document.createElement('span');
      this.closeElementRef.classList.add('close');
      this.closeElementRef.innerHTML = '&times;';
      this.document.querySelector('nb-chat .header').appendChild(this.closeElementRef);
      this.renderer.listen(this.closeElementRef, 'click', (evt) => {
        console.log('Clicking the button', evt);
        this.hide();
      });
    }
    if (this.document.querySelector('nb-chat .scrollable') != null && this.document.querySelector('nb-chat .scrollable .loading') == null) {
      // if (this.loadingAnchor) {
      // this.renderer.appendChild(this.chatCmp.scrollable.nativeElement, this.loadingContainer.elementRef.nativeElement);
        // const embeddedView = this.loadingAnchor.createEmbeddedView(this.loadingContainer);
      // }
      // 1. Create a component reference from the component
      // const componentRef = this.componentFactoryResolver
      //   .resolveComponentFactory(this.loadingContainer)
      //   .create(this.injector);

      // 2. Attach component to the appRef so that it's inside the ng component tree
      // this.appRef.attachView(componentRef.hostView);

      // 3. Get DOM element from component
      // const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

      // 4. Append DOM element to the body
      // this.document.querySelector('nb-chat .scrollable').appendChild(domElem);

    }
  }

  ngAfterContentInit(): void {
  }

  public toggle(): void {
    if (this.hideMessages) {
      this.show();
    } else {
      this.hide();
    }
  }

  public show(): void {
    if (this.user) {
      this.hideMessages = false;
      this.loadChats();
    } else {
      this.showModal();
    }
  }

  showModal() {
    this.hide();
    this.loginModalService.switchToInitial();
  }

  public hide(): void {
    this.hideMessages = true;
    this.cancelInterval();
  }

  private cancelInterval() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = undefined;
    }
  }

  ngOnDestroy() {
    this.userSubscription$.unsubscribe();
  }

}
