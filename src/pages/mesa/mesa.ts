import { DetalhePessoaPage } from './../detalhe-pessoa/detalhe-pessoa';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Pessoa } from '../../models/pessoa';

@IonicPage()
@Component({
  selector: 'page-mesa',
  templateUrl: 'mesa.html',
})
export class MesaPage {
mesa: any
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.mesa = "integrantes";
  }

  addPessoa(){

  }

  addProdAll(){

  }

  removePessoa(){

  }

  encerrarMesa(){
    
  }

  detalhePessoa(){
    this.navCtrl.push(DetalhePessoaPage);
  }

}
