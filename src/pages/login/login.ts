import { MesaPage } from './../mesa/mesa';
import { MesaProvider } from './../../providers/mesa-provider/mesa-provider';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth";

import { HomePage } from './../home/home';

import { Usuario } from './../../models/usuario';
import { SignupPage } from '../signup/signup';
import { UsuarioProvider } from '../../providers/usuario-provider/usuario-provider';


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
  private toast: ToastController, formBuilder: FormBuilder,private usuarioProvide:UsuarioProvider,
  private mesaProvider:MesaProvider) {
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
    .then((usuario) => {
      var retorno = this.verificaMesa(usuario);
      if(retorno === "nok"){
        this.usuarioProvide.getUsuario(usuario.user.uid).subscribe( u=>{
          this.navCtrl.setRoot(HomePage,{usuarioLogado:u});
        });
      }
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

  cadastrar(){
    this.navCtrl.setRoot(SignupPage);
  }

  verificaMesa(usuario:any): string{
    let existe: boolean = false;
    var retorno: string = "nok";
    this.mesaProvider.getAllMesas().subscribe(m=>{
      m.forEach(mesa => {
        this.mesaProvider.consultarMesa(mesa.key).subscribe( m=>{
          mesa = m;
          existe = this.consultarIntegrante(mesa,usuario.user.uid);
          if (existe == true){
            this.navCtrl.setRoot(MesaPage,{mesaKey:mesa.id});
            retorno = "ok";
          }
        })
      })
    })
    return retorno;
  }

  consultarIntegrante(mesa:any, keyUser:string):boolean{
   let retorno:boolean;
   var  integrantes:any[];
   if(mesa.ativa == true){
   integrantes = mesa.integrantes;
   for(var i = 0; i<integrantes.length; i++){
    if(integrantes[i].id == keyUser){
      retorno = true;
      i=integrantes.length;
    } else {
      retorno = false;
    }
   }
  }else{
    retorno = false;
  }
return retorno;
}
}
