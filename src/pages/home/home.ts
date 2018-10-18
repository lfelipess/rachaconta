import { MesaPage } from './../mesa/mesa';
import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, NavParams, ToastController } from 'ionic-angular';
import { MesaProvider } from '../../providers/mesa-provider/mesa-provider';
import { Mesa } from '../../models/mesa';
import { AngularFireAuth } from 'angularfire2/auth';
import { UsuarioProvider } from '../../providers/usuario-provider/usuario-provider';
import { Integrantes } from '../../models/integrantes';
import { Usuario } from '../../models/usuario';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  usuarioLogado:Usuario;
  nome: String;
  sexo: String;

  constructor(public navCtrl: NavController,public navParams: NavParams, public alertCtrl: AlertController,private mesaProvider:MesaProvider
  ,private afAuth: AngularFireAuth,private usuarioProvider:UsuarioProvider,private toast: ToastController) {
    if(this.navParams.data.usuarioLogado){
      this.usuarioLogado = this.navParams.data.usuarioLogado;
      this.nomeInicio();
    }else{
      this.usuarioProvider.getUsuario(this.afAuth.auth.currentUser.uid).subscribe( usuario =>{
        this.usuarioLogado = usuario;
        this.nomeInicio();        
      })
    }   
  }

  nomeInicio(){
    this.nome = this.usuarioLogado.nome + ' ' + this.usuarioLogado.sobrenome;
    if(this.usuarioLogado.sexo == "M"){
      this.sexo = "o";
    }else if(this.usuarioLogado.sexo == "F"){
      this.sexo = "a";
    }else{
      this.sexo = "o";
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
              if(data.codigoMesa){
                this.addIntegrante(data.codigoMesa);
              }else{
                this.entrarMesa();
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
    let integrante:Integrantes = new Integrantes();
    integrante.id = this.usuarioLogado.id;
    integrante.nome = this.usuarioLogado.nome;
    integrante.despesa = 0;
    mesa.integrantes.push(integrante);
    let mesaKey = this.mesaProvider.criarMesa(mesa);
    this.navCtrl.setRoot(MesaPage,{mesaKey:mesaKey});
  }

  addIntegrante(key:string){
    let mesa:Mesa = new Mesa();
    this.mesaProvider.consultarMesa(key).subscribe( m=>{
      mesa = m;
    })
    setTimeout(() => {
      if(mesa.id){
        if(mesa.ativa != false){
        let  existe = mesa.integrantes.filter( t =>{
         return t.id == this.usuarioLogado.id;
        })
        if(existe.length == 0){
          let i = new Integrantes();
          i.id = this.usuarioLogado.id;
          i.nome = this.usuarioLogado.nome;
          i.despesa = 0;
          mesa.integrantes.push(i);
          delete mesa.id;
          this.mesaProvider.atualizarMesa(key,mesa);
          this.navCtrl.setRoot(MesaPage,{mesaKey:key});
        }else{
          this.navCtrl.setRoot(MesaPage,{mesaKey:key});
        }
      }else{
        this.toast.create({ message: 'Esta mesa encontra-se encerrada.', duration: 3000, position: 'botton'}).present();
        this.entrarMesa();
      }
      }else{
        this.toast.create({duration:2000, position:'bottom',message:'Código Invalido'}).present();
        this.entrarMesa();
      }
    }, 1000);
    
  }

}
