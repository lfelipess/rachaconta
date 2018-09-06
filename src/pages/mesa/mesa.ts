import { AddPessoaPage } from './../add-pessoa/add-pessoa';
import { AddProdPage } from './../add-prod/add-prod';
import { DetalhePessoaPage } from './../detalhe-pessoa/detalhe-pessoa';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Pessoa } from '../../models/pessoa';
import { AdicionaisPage } from '../adicionais/adicionais';

@IonicPage()
@Component({
  selector: 'page-mesa',
  templateUrl: 'mesa.html',
})
export class MesaPage {
mesa: any
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
    this.mesa = "integrantes";
  }

  addPessoa(){
    this.navCtrl.push(AddPessoaPage);
  }

  addProdAll(){
    this.navCtrl.push(AddProdPage);
  }

  removePessoa(){

  }

  encerrarMesa(){
    let confirm = this.alertCtrl.create({
      title: 'Fechar conta',
      message: 'Você gostaria realmente de fechar a conta da mesa?',
      buttons: [
        {
          text: 'Sim',
          handler: () => {
            this.navCtrl.setRoot(AdicionaisPage);
          }
        },
        {
          text: 'Não',
          handler: () => {
            console.log('Não encerrar');
          }
        }
      ]
    });
    confirm.present();
  }

  detalhePessoa(){
    this.navCtrl.push(DetalhePessoaPage);
  }

}
