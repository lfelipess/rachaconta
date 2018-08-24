import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  constructor(public navCtrl: NavController, public alertCtrl: AlertController) {
  }

  entrarMesa() {
    let alert = this.alertCtrl.create({
      title: 'Em breve!',
      subTitle: 'Esta função ainda não está disponível!',
      buttons: ['OK']
    });
    alert.present();
  }

  criarMesa() {
    //this.navCtrl.setRoot(MesaPage);
  }

}
