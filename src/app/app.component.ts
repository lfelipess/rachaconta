import { AngularFireAuth } from 'angularfire2/auth';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { LoginPage } from './../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { HistoricoPage } from '../pages/historico/historico';
import { PerfilPage } from '../pages/perfil/perfil';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
    private afAuth: AngularFireAuth, public alertCtrl: AlertController) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Perfil', component: PerfilPage },
      { title: 'Historico', component: HistoricoPage },
      { title: 'Sair', component: LoginPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  emBreve(){
    let alert = this.alertCtrl.create({
      title: 'Em breve!',
      subTitle: 'Esta função ainda não está disponível!',
      buttons: ['OK']
    });
    alert.present();
  }

  sair(){
    this.afAuth.auth.signOut();
  }

  openPage(page) {
    switch(true){
      case ((page.title == 'Perfil')):{
        this.nav.push(page.component);
      }
      break;
      case ((page.title == 'Historico')):{
        this.nav.push(page.component);
      }
      break;
      case ((page.title == 'Sair')):{
        this.sair();
        this.nav.setRoot(page.component);
      }
      break;
      default: {
        this.nav.setRoot(page.component);
      }
      break;
    }
  }
}
