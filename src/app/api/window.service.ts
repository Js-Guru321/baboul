import { isPlatformBrowser } from '@angular/common';
import { ClassProvider, FactoryProvider, InjectionToken, PLATFORM_ID } from '@angular/core';

/* Create a new injection token for injecting the window into a component. */
export const WINDOW = new InjectionToken('WindowToken');

export const DOCUMENT = new InjectionToken('DocumentToken');

export const LOCAL_STORAGE = new InjectionToken('LocalStorageToken');

/* Define abstract class for obtaining reference to the global window object. */
export abstract class WindowRef {

  get nativeWindow(): Window | Object {
    throw new Error('Not implemented.');
  }

}

export abstract class DocumentRef {

  get nativeDocument(): Document | Object {
    throw new Error('Not implemented.');
  }

}

export abstract class LocalStorageRef {

  get nativeLocalStorage(): Storage | Object {
    throw new Error('Not implemented.');
  }

}

/* Define class that implements the abstract class and returns the native window object. */
export class BrowserWindowRef extends WindowRef {

  constructor() {
    super();
  }

  get nativeWindow(): Window | Object {
    return window;
  }

}

export class BrowserDocumentRef extends DocumentRef {

  constructor() {
    super();
  }

  get nativeDocument(): Document | Object {
    return document;
  }

}

export class BrowserLocalStorageRef extends LocalStorageRef {

  constructor() {
    super();
  }

  get nativeLocalStorage(): Storage | Object {
    return localStorage;
  }

}

/* Create an factory function that returns the native window object. */
export function windowFactory(browserWindowRef: BrowserWindowRef, platformId: Object): Window | Object {
  if (isPlatformBrowser(platformId)) {
    return browserWindowRef.nativeWindow;
  }
  return new Window();
}

export function documentFactory(browserDocumentRef: BrowserDocumentRef, platformId: Object): Document | Object {
  if (isPlatformBrowser(platformId)) {
    return browserDocumentRef.nativeDocument;
  }
  return new Document();
}

export function localStorageFactory(browserLocalStorageRef: LocalStorageRef, platformId: Object): Storage | Object {
  if (isPlatformBrowser(platformId)) {
    return browserLocalStorageRef.nativeLocalStorage;
  }
  // return new Storage();
  // noinspection UnnecessaryLocalVariableJS
  const fakeStorage: {
    readonly length: number;
    clear(): void;
    getItem(key: string): string | null;
    key(index: number): string | null;
    removeItem(key: string): void;
    setItem(key: string, data: string): void;
    [key: string]: any;
    [index: number]: string;
  } = {
    length: 0,
    clear(): void { return; },
    getItem(key: string): string | null { return null; },
    key(index: number): string | null { return null; },
    removeItem(key: string): void { },
    setItem(key: string, data: string): void { },
  };
  return fakeStorage as Storage;
}

/* Create a injectable provider for the WindowRef token that uses the BrowserWindowRef class. */
export const browserWindowProvider: ClassProvider = {
  provide: WindowRef,
  useClass: BrowserWindowRef
};

export const browserDocumentProvider: ClassProvider = {
  provide: DocumentRef,
  useClass: BrowserDocumentRef
};

export const browserLocalStorageProvider: ClassProvider = {
  provide: LocalStorageRef,
  useClass: BrowserLocalStorageRef
};

/* Create an injectable provider that uses the windowFactory function for returning the native window object. */
export const windowProvider: FactoryProvider = {
  provide: WINDOW,
  useFactory: windowFactory,
  deps: [ WindowRef, PLATFORM_ID ]
};

export const documentProvider: FactoryProvider = {
  provide: DOCUMENT,
  useFactory: documentFactory,
  deps: [ DocumentRef, PLATFORM_ID ]
};

export const localStorageProvider: FactoryProvider = {
  provide: LOCAL_STORAGE,
  useFactory: localStorageFactory,
  deps: [ LocalStorageRef, PLATFORM_ID ]
};

/* Create an array of providers. */
export const WINDOW_PROVIDERS = [
  // WINDOW
  browserWindowProvider,
  windowProvider,

  // DOCUMENT
  browserDocumentProvider,
  documentProvider,

  // LOCAL_STORAGE
  browserLocalStorageProvider,
  localStorageProvider,
];
