import 'zone.js/dist/zone-node';
import 'reflect-metadata';

const domino = require('domino');
const fs = require('fs');
const path = require('path');
var template = fs.readFileSync(path.join('./', 'dist/browser', 'index.html')).toString();
var win = domino.createWindow(template);
global['window'] = win;
Object.defineProperty(win.document.body.style, 'transform', {
    value: function () {
        return {
            enumerable: true,
            configurable: true,
        };
    },
});
global['document'] = win.document;
global['KeyboardEvent'] = win.KeyboardEvent;
global['FocusEvent'] = win.FocusEvent;
global['HTMLAnchorElement'] = win.HTMLAnchorElement;
global['CSS'] = null;
// global['XMLHttpRequest'] = require('xmlhttprequest').XMLHttpRequest;
global['Prism'] = null;


import { enableProdMode } from '@angular/core';
import { ngExpressEngine } from '@nguniversal/express-engine';
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';

import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as compression from 'compression';

import { join } from 'path';

enableProdMode();

export const app = express();

app.use(compression());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// const DIST_FOLDER = join(process.cwd(), 'dist');

const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./dist/server/main');

app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
}));

app.set('view engine', 'html');
app.set('views', './dist/browser');

app.get('/redirect/**', (req, res) => {
  const location = req.url.substring(10);
  res.redirect(301, location);
});

app.get('*.*', express.static('./dist/browser', {
  maxAge: '1y'
}));

app.get('/*', (req, res) => {
  res.render('index', { req, res }, (err, html) => {
    if (html) {
      res.send(html);
    } else {
      console.error(err);
      res.send(err);
    }
  });
});
