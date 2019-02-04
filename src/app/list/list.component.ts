import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ListService } from '../api/list.service';
import {CacheService} from '../api/cache.service';
import {SearchService} from '../api/search.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.sass']
})
export class ListComponent implements OnInit {

  list:any;
  brandList:any;
  categorieList:any;
  searchString:string= '';
  searchStringSecond:string= '';
  alphabet:any;
  filterLetter:string = '';
  indexPage:any;
  snap:any;
  p: number = 1;
  url:string;
  alphabetHelper:any = [];
  luogo: string;
  sesso: string;
  filterGender:string
  Gender:any;
  @ViewChild('lista') lista: ElementRef;



  constructor(private route: ActivatedRoute,
  private router: Router,
  private service: ListService,
  private searchService: SearchService,
  private cache: CacheService) {
    this.alphabet = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('');

   }



  ngOnInit() {
    this.filterGender = this.searchService.getGender()? this.searchService.getGender() : "UOMO" ;
    this.Gender = (this.filterGender == "UOMO")? 1 : 2
    console.log(this.filterGender)

    this.luogo = 'bologna'; //fixed to Bologna
    this.sesso = 'uomo';

    // this.cache.get('brandAll', this.service.getBrand({'includeZeros': false})).subscribe((res)=>{
    //   this.brandList = res.brandList
    //   console.log(this.list)
    // })
    // this.cache.get('categorie', this.service.getCategories()).subscribe((res)=>{
    //   this.categorieList = res.categorieList
    // })
    if(this.route.snapshot.url[0].path=='brand'){
      this.url='/search/brand';
      this.snap='brand'
      this.cache.get('brandAll', this.service.getBrand({'includeZeros': false})).subscribe((res)=>{
        this.list = this.brandList = res.brandList
        this.setLetters()
      })


    }
    else if(this.route.snapshot.url[0].path=='categorie'){
      this.url='/search/categorie'
      this.snap='categorie'
      this.cache.get('categorie', this.service.getCategories()).subscribe((res)=>{

        this.list = this.categorieList = res.categorieList
        this.setLetters()

        for(const item in this.categorieList ){

          this.categorieList[item].nome = this.categorieList[item].nome.toLowerCase().replace(' uomo', '').capitalize()
          this.categorieList[item].nome = this.categorieList[item].nome.toLowerCase().replace(' donna', '').capitalize()
        }

      })
    }
    else if(this.route.snapshot.url[0].path=='negozi'){
      this.url='/negozio'
      this.snap='negozi'
      this.cache.get('negozi', this.service.getNegozi()).subscribe((res)=>{
        this.list = res.negoziList.filter((item:any)=>{
          if(item['attivo']==true)
            return true
          else return false
        })
        this.setLetters()

      })
    }

  }

  filterLetterClick(letter){
    if(letter.state)
      this.filterLetter = letter.letter
  }

  setLetters(){
    // console.log("list", this.list)
    if(this.snap=='brand')
    this.alphabet = this.alphabet.filter((item: any) => {
      const letter = item
      let returner = false
      this.list.some((item, index)=> {
        if((item['brand']['nome'].toString().toLowerCase().match(new RegExp('^'+letter.toLowerCase()))!=null))
          returner = true
      });
      this.alphabetHelper.push({
        'letter': letter,
        'state': returner
      })
      return returner;
    });
    else{
      console.log('else')
      this.alphabet = this.alphabet.filter((item: any) => {
        const letter = item
        let returner = false;
        this.list.some((item, index)=> {
          if((item['nome'].toString().toLowerCase().match(new RegExp('^'+letter.toLowerCase()))!=null))
            returner = true
        });
        this.alphabetHelper.push({
          'letter': letter,
          'state': returner
        })
        return returner;
      });
    }
    console.log(this.alphabetHelper)
  }

  filterLetterChange(letter){
    this.searchString='';
    if(this.snap=='brand'){this.list.some((item, index)=> {
        this.indexPage = index;
        return(item['brand']['nome'].toString().toLowerCase().match(new RegExp('^'+letter.toLowerCase()))!=null)
        })
        this.p = Math.floor(this.indexPage/30)+1;
      }
    else{this.list.some((item, index)=> {
        this.indexPage = index;
        return(item['nome'].toString().toLowerCase().match(new RegExp('^'+letter.toLowerCase()))!=null)
        })
        this.p = Math.floor(this.indexPage/30)+1;
      }

  }


  changeFilter(value){
    console.log(this.Gender)
  }

  pageChange(element){
    this.p=element
    this.lista.nativeElement.scrollIntoView({block: "end", inline: "nearest"})
  }

  private friendlyUrl(s:string) {
    return s.replace(/à/g, "a").replace(/è/g, "e").replace(/é/g, "e").replace(/ù/g, "u").replace(/ì/g, "i").replace(/&/g, 'e').replace(/[^a-zA-Z0-9]/g, " ").replace(/\s+/g, '-').replace(/-$/g, '').replace(/^-/, '').toLowerCase();;
  }

}
