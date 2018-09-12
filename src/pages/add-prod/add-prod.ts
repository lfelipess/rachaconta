import { MesaProvider } from './../../providers/mesa-provider/mesa-provider';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the AddProdPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-prod',
  templateUrl: 'add-prod.html',
})
export class AddProdPage {

  chave
  integrantes:Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams,private mesaProvider:MesaProvider) {
    this.chave = this.navParams.data.chave;
    this.mesaProvider.consultarMesa(this.chave).subscribe( r=>{
      this.integrantes = r.integrantes;
  })
  }

}
