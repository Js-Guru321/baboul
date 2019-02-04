import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HomeService} from './home.service';
import {SearchService} from './search.service';
import {ApiService} from './api.service';
import {ListService} from './list.service';
import {UserService} from './user.service';
import {NegozioService} from './negozio.service';
import {CacheService} from './cache.service';
import {VetrinaService} from './vetrina.service';
import {GeolocationService} from './geolocation.service';
import {HeaderService} from './header.service';
import {PreferitiService} from './preferiti.service';
import {LanguageService} from './language.service';
import {ChatService} from './chat.service';

const SERVICES = [
  ApiService,
  SearchService,
  ListService,
  HomeService,
  UserService,
  NegozioService,
  CacheService,
  VetrinaService,
  GeolocationService,
  PreferitiService,
  HeaderService,
  LanguageService,
  ChatService,
];

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [
    ...SERVICES,
  ],
})
export class ApiModule { }
