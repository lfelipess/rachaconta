import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { UsuarioProvider } from '../../providers/usuario-provider/usuario-provider';
import { AngularFireAuth } from 'angularfire2/auth';
import { Usuario } from '../../models/usuario';
import { EditarPerfilPage } from '../editar-perfil/editar-perfil';
import { LoginPage } from '../login/login';


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
    private afAuth: AngularFireAuth,public alertCtrl: AlertController, private toast: ToastController) {
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

  excluirConta(){
    let confirm = this.alertCtrl.create({
      title: 'Encerrar conta',
      message: 'Você gostaria realmente de excluir a sua conta?',
      buttons: [
        {
          text: 'Sim',
          handler: () => {
              this.deletar();
              this.navCtrl.setRoot(LoginPage);
              this.printErro("Conta encerrada, obrigado por fazer parte do Racha Conta!");
          }
        },
        {
          text: 'Não',
          handler: () => {
          }
        }
      ]
    });
    confirm.present();
  }

  deletar(){
    this.afAuth.auth.currentUser.delete()
    .then(function() {
      console.log("Conta encerrada com sucesso!");
    }).catch(function(error) {
      console.log("Erro no processo de exclusão da conta: " + error);
    });
    
  }

  printErro(erro:string){
    if(erro){
      let toast = this.toast.create({ duration: 3000, position: 'bottom' });
      toast.setMessage(erro).present();
    }
  }

}
