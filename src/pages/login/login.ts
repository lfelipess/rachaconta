import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth";

import { HomePage } from './../home/home';

import { Usuario } from './../../models/usuario';
import { SignupPage } from '../signup/signup';
import { UsuarioProvider } from '../../providers/usuario-provider/usuario-provider';
import { MesaPage } from './../mesa/mesa';
import { Mesa } from './../../models/mesa';
import { Integrantes } from './../../models/integrantes';
import { MesaProvider } from './../../providers/mesa-provider/mesa-provider';


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
  retorno = "";

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
      this.usuarioProvide.getUsuario(usuario.user.uid).subscribe( u =>{
        let usuarioLogado:Usuario = <Usuario> u.payload.val();
        this.verificaMesa(usuarioLogado);
        usuarioLogado.id = u.key;
        setTimeout(()=> {
          if(this.retorno == ""){
            this.navCtrl.setRoot(HomePage,{usuarioLogado:usuarioLogado});
          } else {
            this.navCtrl.setRoot(MesaPage,{mesaKey:this.retorno});
          }
          }, 1500);
      })
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
    let mesa:Mesa = new Mesa();
    var i:number = 0;
    var retorno: string = "";
    this.mesaProvider.consultarTodasMesa().subscribe( m =>{
      for(i;i<m.length;) {
        mesa = (<Array<Mesa>> m.map( M => ({id: M.key, ...M.payload.val()})))[i];
        let  existe:Integrantes[] = mesa.integrantes.filter( t =>{
        return t.id == usuario.id;
      })
      if(existe.length == 0){
        i++;
      } else {
        if(mesa.ativa == false){
          i++;
        }else{
          this.retorno = mesa.id;
          i=m.length;
        }
      }
      }      
      })
      return retorno;
  }
}
