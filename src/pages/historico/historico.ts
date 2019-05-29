import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MesaProvider } from '../../providers/mesa-provider/mesa-provider';
import { Mesa } from '../../models/mesa';
import { AngularFireAuth } from 'angularfire2/auth';
import { Integrantes } from '../../models/integrantes';

/**
 * Generated class for the HistoricoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-historico',
  templateUrl: 'historico.html',
})
export class HistoricoPage {

  mesas:Array<Mesa> = new Array<Mesa>();

  constructor(public navCtrl: NavController, public navParams: NavParams,private mesaProvider:MesaProvider,private afAuth: AngularFireAuth) {
    this.mesaProvider.consultarMesaDesativada().subscribe( mesa =>{
      this.mesas = <Array<Mesa>> mesa.map( m => ({id:m.key, ...m.payload.val()}));
      this.mesas = this.mesas.filter( m =>{
        return m.integrantes.filter( i => i.id == this.afAuth.auth.currentUser.uid).length > 0
      })
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HistoricoPage');
  }

  filter(mesa:Mesa):number{
    let despesa: number = 0;
     despesa = mesa.integrantes.filter( i =>{
      return i.id == this.afAuth.auth.currentUser.uid;
    })[0].despesa;

    return despesa;
  }
    

}
