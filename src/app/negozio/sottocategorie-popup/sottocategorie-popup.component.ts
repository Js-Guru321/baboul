import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from "ng6-bootstrap-modal";

export interface ConfirmModel {
  title: string;
  item:string;
  sesso: string;
  id:number
}

@Component({
  selector: 'app-sottocategorie-popup',
  templateUrl: './sottocategorie-popup.component.html',
  styleUrls: ['./sottocategorie-popup.component.sass']
})
export class SottocategoriePopupComponent extends DialogComponent<ConfirmModel, boolean> implements ConfirmModel {
  title: string;
  item: string;
  sesso: string;
  id:number
  uomoCheck: boolean
  constructor(dialogService: DialogService) {super(dialogService); }

  ngOnInit() {
  }
  confirm() {
    this.result = true;
    this.close();
  }

  friendlyUrl(s:string) {
    return s.replace(/à/g, "a").replace(/è/g, "e").replace(/é/g, "e").replace(/ù/g, "u").replace(/ì/g, "i").replace(/&/g, 'e').replace(/[^a-zA-Z0-9]/g, " ").replace(/\s+/g, '-').replace(/-$/g, '').toLowerCase();;
  }
  genderChange() {
      // if(this.uomoCheck && this.donnaCheck) {
      //     this.filterGenderBrand = '';
      //     this.filterGenderCategory = '';
      // } else {
      //     if(this.uomoCheck) {
      //         this.filterGenderBrand = 'UOMO';
      //         this.filterGenderCategory = 'UOMO';
      //     } else {
      //         this.filterGenderBrand = 'DONNA';
      //         this.filterGenderCategory = 'DONNA';
      //     }
      // }

  }
}
