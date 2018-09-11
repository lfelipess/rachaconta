import { MesaPage } from './../mesa/mesa';
import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, NavParams } from 'ionic-angular';
import { Usuario } from '../../models/usuario';
import { MesaProvider } from '../../providers/mesa-provider/mesa-provider';
import { Mesa } from '../../models/mesa';
import { AngularFireAuth } from 'angularfire2/auth';
import { UsuarioProvider } from '../../providers/usuario-provider/usuario-provider';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  usuarioLogado;

  constructor(public navCtrl: NavController,public navParams: NavParams, public alertCtrl: AlertController,private mesaProvider:MesaProvider
  ,private afAuth: AngularFireAuth,private usuarioProvider:UsuarioProvider) {
    if(this.navParams.data.usuarioLogado){
      this.usuarioLogado = this.navParams.data.usuarioLogado;
    }else{
      this.usuarioProvider.getUsuario(this.afAuth.auth.currentUser.uid).subscribe( usuario =>{
        this.usuarioLogado = usuario;
      })
    }   
  }

  entrarMesa() {

      const prompt = this.alertCtrl.create({
        title: 'Digite o Código da Mesa',
        inputs: [
          {
            name: 'codigoMesa',
            placeholder: 'Enter Here your key Code'
          },
        ],
        buttons: [
          {
            text: 'Cancel',
            handler: data => {
            }
          },
          {
            text: 'Entrar',
            handler: data => {
              if(data){
                this.addIntegrante(data.codigoMesa);
              }
            }
          }
        ]
      });
      prompt.present();
    }
  
  

  criarMesa() {
    let mesa:Mesa = new Mesa();
    mesa.ativa=true;
    mesa.integrantes.push({usuarioId:this.usuarioLogado.key,nome:this.usuarioLogado.nome,total:0});
    let mesaKey = this.mesaProvider.criarMesa(mesa);
    this.navCtrl.setRoot(MesaPage,{mesaKey:mesaKey});
  }

  addIntegrante(key:string){
    let mesa;
    this.mesaProvider.consultarMesa(key).subscribe( r=>{
      mesa = r;
    })
    setTimeout(() => {
      mesa.integrantes.push({usuarioId:this.usuarioLogado.key,nome:this.usuarioLogado.nome,total:0})
      delete mesa.key;
      this.mesaProvider.atualizarMesa(key,mesa);
      this.navCtrl.setRoot(MesaPage,{mesaKey:key});
    }, 1000);
    
  }

}
