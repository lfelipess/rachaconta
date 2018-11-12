import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from './../pages/login/login';
import { MesaPage } from '../pages/mesa/mesa';
import { DetalhePessoaPage } from './../pages/detalhe-pessoa/detalhe-pessoa';
import { AddProdIndivPage } from './../pages/add-prod-indiv/add-prod-indiv';
import { AddProdPage } from './../pages/add-prod/add-prod';
import { AddPessoaPage } from '../pages/add-pessoa/add-pessoa';
import { AdicionaisPage } from './../pages/adicionais/adicionais';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { MesaProvider } from '../providers/mesa-provider/mesa-provider';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { SignupPage } from '../pages/signup/signup';
import { UsuarioProvider } from '../providers/usuario-provider/usuario-provider';
import { ProdutoProvider } from '../providers/produto-provider/produto';
import { FormatCurrencyPipe } from '../pipes/format-currency/format-currency';
import { HistoricoPage } from '../pages/historico/historico';
import { FinalPage } from '../pages/final/final';






const firebaseConfig ={
  apiKey: "AIzaSyCWgqXE-yiEticZmEucTN0oKcvS-x6c_Ds",
  authDomain: "rachaconta-1865b.firebaseapp.com",
  databaseURL: "https://rachaconta-1865b.firebaseio.com",
  projectId: "rachaconta-1865b",
  storageBucket: "rachaconta-1865b.appspot.com",
  messagingSenderId: "323903877704"
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    MesaPage,
    DetalhePessoaPage,
    AddProdPage,
    AddProdIndivPage,
    AddPessoaPage,
    AdicionaisPage,
    SignupPage,
    FormatCurrencyPipe,
    HistoricoPage,
    FinalPage

  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp,{
      scrollAssist: false, 
      autoFocusAssist: false
    }),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    MesaPage,
    DetalhePessoaPage,
    AddProdPage,
    AddProdIndivPage,
    AddPessoaPage,
    AdicionaisPage,
    SignupPage,
    HistoricoPage,
    FinalPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    MesaProvider,
    UsuarioProvider,
    ProdutoProvider,
  ]
})
export class AppModule {}
