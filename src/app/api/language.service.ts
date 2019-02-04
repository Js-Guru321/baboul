
import {of as observableOf} from 'rxjs';
import {Inject, Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs/';
import {LOCAL_STORAGE} from './window.service';

export class Language {
  constructor(public lang: string,
              public label: string,
              public abbr: string) {
  }
}

@Injectable()
export class LanguageService {

  private languages: Language[] = [
    {
      lang: 'it',
      label: 'Italiano',
      abbr: 'Ita',
    },
    {
      lang: 'en',
      label: 'English',
      abbr: 'Eng',
    },
  ];

  private lang$: Subject<Language> = new Subject<Language>();
  private lang: Language;

  constructor(@Inject(LOCAL_STORAGE) private localStorage: Storage) { }

  available(): Observable<any> {
    return observableOf(this.languages);
  }

  language(lang?: string): Observable<Language> {
    if (!lang && !this.lang) {
      this.localStorage.setItem('baboul.lang', this.lang.lang);
      if (this.localStorage.getItem('baboul.lang') != null) {
        const ll: Language = JSON.parse(this.localStorage.getItem('baboul.lang'));
        lang = ll.lang;
      } else {
        lang = 'it';
      }
    }

    if (lang) {
      const language = this.languages.filter((_l) => _l.lang === lang)[0];
      if (language) {
        this.lang = language;
        this.localStorage.setItem('baboul.lang', this.lang.lang);
      }
    }
    this.lang$.next(this.lang);
    return this.lang$.asObservable();
  }

}
