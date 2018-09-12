import { AddPessoaPage } from './../add-pessoa/add-pessoa';
import { AddProdPage } from './../add-prod/add-prod';
import { DetalhePessoaPage } from './../detalhe-pessoa/detalhe-pessoa';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Pessoa } from '../../models/pessoa';
import { AdicionaisPage } from '../adicionais/adicionais';
import { MesaProvider } from '../../providers/mesa-provider/mesa-provider';
import { AngularFireList, AngularFireObject } from 'angularfire2/database';

@IonicPage()
@Component({
  selector: 'page-mesa',
  templateUrl: 'mesa.html',
})
export class MesaPage {
  mesa: any
  mesaKey:string;
  integrantes:Array<any>;



  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController
    ,private mesaProvider:MesaProvider) {
    this.mesa = "integrantes";
    this.mesaKey = this.navParams.data.mesaKey;
    this.mesaProvider.consultarMesa(this.mesaKey).subscribe( r=>{
      this.integrantes = r.integrantes;
    })

  }

  /*addPessoa(){
    this.navCtrl.push(AddPessoaPage);
  }*/

  editProd(){
    this.navCtrl.push(AddProdPage);
  }
  addProdAll(){
    let chave = this.navParams.data.mesaKey;
    this.navCtrl.push(AddProdPage,{chave});
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

  detalhePessoa(integrante: any){
    this.navCtrl.push(DetalhePessoaPage,{integrante});
  }

}
