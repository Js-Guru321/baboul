import {Component, OnInit, OnDestroy, AfterViewInit, Pipe, PipeTransform} from '@angular/core';
import {Subscription} from 'rxjs';
import {filter} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {ListService} from '../api/list.service';
import {CacheService} from '../api/cache.service';
import {getDeepFromObject} from '../api/helpers';
import 'rxjs/Rx';
import * as moment from 'moment';
import * as FileSaver from 'file-saver';
import * as JSZip from 'jszip';

@Component({
  selector: 'app-sitemap',
  templateUrl: './sitemap.component.html',
  styleUrls: ['./sitemap.component.scss']
})
export class SitemapComponent implements OnInit {

  public readonly cmp = SitemapComponent;

  categorieList: any;
  brandList: any;
  sesso: any;
  sites_cat_brand: any;
  sites_cat: any;
  sites_brand: any;
  sites_base: any;
  baseurl = 'https://baboul.it/negozi/bologna/';
  sitemapIndexBaseUrl = 'https://baboul.it/';

  sites: any[] = [];

  private static readonly MAX_URL_PER_FILE = 50000;

  constructor(private route: ActivatedRoute, private router: Router, private cache: CacheService, private listService: ListService) { }

  ngOnInit() {
    const _self = this;
    this.sites_cat_brand = [];
    this.sites_cat = [];
    this.sites_brand = [];
    this.sites_base = [];
    this.sesso = ['uomo', 'donna'];
    this.cache.get('categorie', this.listService.getCategories()).subscribe((res) => {
      // populate category list
      this.categorieList = res.categorieList;
      for (const item in this.categorieList) {
        if (this.categorieList.hasOwnProperty(item)) {
          this.categorieList[item].nome = this.categorieList[item].nome.toLowerCase().replace(' uomo', '').capitalize();   // remove?
          this.categorieList[item].nome = this.categorieList[item].nome.toLowerCase().replace(' donna', '').capitalize();  // remove?
        }
      }

      // get brandlist
      this.cache.get('brandAll', this.listService.getBrand({'includeZeros': false})).subscribe((res) => {
        this.brandList = res.brandList;

        // luogo/
        _self.sites_base.push(_self.friendlyUrl(_self.baseurl));

        // generate sitemap:
        this.sesso.forEach(function (sesso) {

          _self.categorieList.forEach(function (categoria) {

            // url/luogo/sesso/categoria
            if (categoria.sesso.toLowerCase() === sesso) {
              _self.sites_cat.push(_self.friendlyUrl(_self.baseurl + sesso + '/' + SitemapComponent.escape(categoria.nome)));
            }

            _self.brandList.forEach(function (brand) {

              // url/luogo/sesso/categoria/brand
              if (categoria.sesso.toLowerCase() === sesso && brand.brand.sesso.toLowerCase() === sesso) {
                _self.sites_cat_brand.push(_self.friendlyUrl(_self.baseurl + sesso + '/' + SitemapComponent.escape(categoria.nome) + '/' + SitemapComponent.escape(brand.brand.nome)) + '-' + brand.brand.id);
              }
            });
          });

          // url/luogo/sesso/brand
          _self.brandList.forEach(function (brand) {
            if (brand.brand.sesso.toLowerCase() === sesso) {
              _self.sites_brand.push(_self.friendlyUrl(_self.baseurl + sesso + '/' + SitemapComponent.escape(brand.brand.nome))  + '-' + brand.brand.id);
            }
          });
        });
        // console.log("sitess "+_self.sites_brand.length);
      });
    });
  }

  download(type) {
    let sites;

    // const options: Options = {
    const options: any = {
      filename: 'file.xml',
      fieldSeparator: ',',
      quoteStrings: '',
      decimalseparator: '.',
      showLabels: false,
      showTitle: false,
      title: '',
      useBom: true,
      headers: [],
    };

    const today = moment().utc();
    const date = today.format('YYYY-MM-DD');

    if (type === 0) {
      sites = this.sites_cat_brand;
      options.filename = 'sitemap_categorie_brand.xml';
    } else if (type === 1) {
      sites = this.sites_cat;
      options.filename = 'sitemap_categorie.xml';
    } else if (type === 2) {
      sites = this.sites_brand;
      options.filename = 'sitemap_brand.xml';
    } else if (type === 3) {
      sites = this.sites_base;  // base
      options.filename = 'sitemap_base.xml';
    }

    this.sites = sites;

    // const data = [
    //   {
    //     name: '<?xml version="1.0" encoding="UTF-8"?>',
    //   },
    //   {
    //     name: '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    //   },
    // ];
    //
    // sites.forEach(function (site) {
    //   data.push({'name': '\t<url>'});
    //   data.push({'name': '\t\t<loc>' + site + '</loc>'});
    //   data.push({'name': '\t\t<lastmod>' + date + '</lastmod>'});
    //   data.push({'name': '\t</url>'});
    // });
    //
    // data.push(
    //   {
    //     name: '</urlset>',
    //   }
    // );
    const firstLine = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    const lastLine = '</urlset>';

    const files: any[] = [];

    let _content = '';

    const fZip: JSZip = new JSZip();

    for (let i = 0, len = sites.length; i < len; i++) {
      if (_content === '') {
        _content += firstLine;
      }
      _content += '\t<url>\n\t\t<loc>' + SitemapComponent.escape(sites[i]) + '</loc>\n\t\t<lastmod>' + date + '</lastmod>\n\t</url>\n';
      if (((i + 1) % SitemapComponent.MAX_URL_PER_FILE) === 0 || i + 1 === len) {
        _content += lastLine;
        files.push({
          index: files.length,
          content: _content,
          name: `sitemap-${files.length + 1}.xml`,
          date: date,
        });
        fZip.file(`sitemap-${files.length}.xml`, new Blob([_content]));
        _content = '';
      }
    }

    const siFirstLine = '<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    const siLastLine = '</sitemapindex>';

    let siContent = '';
    siContent += siFirstLine;
    for (let i = 0, len = files.length; i < len; i++) {
      const file = files[i];
      siContent += '\t<sitemap>\n\t\t<loc>' + this.sitemapIndexBaseUrl + file.name + '</loc>\n\t\t<lastmod>' + file.date + '</lastmod>\n\t</sitemap>\n';
    }
    siContent += siLastLine;

    fZip.file('sitemapindex.xml', new Blob([siContent]));
    fZip.generateAsync({type: 'blob'})
      .then(function (blob) {
        FileSaver.saveAs(blob, `${options.filename.replace('.xml', '.zip')}`);
      });

    // 0.5 is the default value for URL priority
    // <changefreq>hourly</changefreq><priority>0.5</priority>
    const content = sites.map((s) => {
      return `<url><loc>${SitemapComponent.escape(s)}</loc><lastmod>${date}</lastmod></url>\n`;
    }).join('');

    const data = [{ name: `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${content}</urlset>` }];

    // save file
    // const document = new Angular2Txt([{ name: siContent }], options.filename, options);
    // FileSaver.saveAs(new Blob([ siContent ]), options.filename, false);
    // for (let i = 0, len = files.length; i < len; i++) {
    //   const file = files[i];
    //   FileSaver.saveAs(new Blob([ file.content ]), file.name, false);
    // }
  }

  private static escape(str: string): string {
    return str
      .replace('&', '&amp;')
      .replace('\'', '&apos;')
      .replace('"', '&quot;')
      .replace('>', '&gt;')
      .replace('<', '&lt;');
  }

  private friendlyUrl(s: string) {
    return s.replace(/-/g, '--').replace(/\s/g, '-').toLocaleLowerCase();
  }
}
