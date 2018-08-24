import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth";

import { HomePage } from './../home/home';

import { Usuario } from './../../models/usuario';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  usuario: Usuario;
  loginForm: any;
  errorEmail = false;
  errorSenha = false;
  messageEmail = "";
  messageSenha = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, private afAuth: AngularFireAuth,
  private toast: ToastController, formBuilder: FormBuilder) {
    this.loginForm = formBuilder.group({
    email: ['', Validators.required],
    senha: ['', Validators.required],
    });
    this.usuario = new Usuario();
  }

  validar(usuario: Usuario){
    let {email, senha} = this.loginForm.controls;

    if(!this.loginForm.valid){
      if(!email.valid){
        this.errorEmail = true;
        this.messageEmail = "Campo obrigatório!"
      }else{
        this.messageEmail = ""
      }
      if(!senha.valid){
        this.errorSenha = true;
        this.messageSenha = "Campo obrigatório!"
      }else{
        this.messageSenha = ""
      }
    }else{
      this.login(usuario);
      this.messageEmail = ""
      this.messageSenha = ""
    }
  }

  login(usuario: Usuario){
    this.afAuth.auth.signInAndRetrieveDataWithEmailAndPassword(usuario.email, usuario.senha)
    .then(() => {
      this.navCtrl.setRoot(HomePage);
    })
    .catch((error: any) => {
      let toast = this.toast.create({ duration: 3000, position: 'bottom' });
      if (error.code == 'auth/user-disabled') {
        toast.setMessage('O e-mail está desativado.');
      } else if (error.code == 'auth/invalid-email') {
        toast.setMessage('O e-mail digitado não é valido.');
      } else if (error.code == 'auth/user-not-found') {
        toast.setMessage('E-mail não encontrado.');
      } else if (error.code == 'auth/wrong-password') {
        toast.setMessage('A senha digitada está errada.');
      }
      toast.present();
    });
  }

}
