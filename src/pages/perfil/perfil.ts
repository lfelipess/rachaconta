import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { UsuarioProvider } from '../../providers/usuario-provider/usuario-provider';
import { AngularFireAuth } from 'angularfire2/auth';
import { Usuario } from '../../models/usuario';
import { EditarPerfilPage } from '../editar-perfil/editar-perfil';


@IonicPage()
@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html',
})
export class PerfilPage {

  idUsuarioLogado: any;
  comButton: any;
  usuario:Usuario = new Usuario();
  sexo: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private usuarioProvider: UsuarioProvider, 
    private afAuth: AngularFireAuth,public alertCtrl: AlertController) {
      this.usuarioProvider.getUsuario(this.afAuth.auth.currentUser.uid).subscribe( u =>{
        this.usuario = <Usuario> u.payload.val();
        this.usuario.id = u.key;
        this.verificaSexo();
    })
  }

  verificaSexo(){
    this.usuario.sexo == "M" ? this.sexo = "Masculino" :  this.sexo = "Feminino"
  }

  editarPerfil(){
    this.navCtrl.push(EditarPerfilPage,{usuarioLogado:this.usuario});
  }

}
