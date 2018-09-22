import { MesaPage } from './../mesa/mesa';
import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, NavParams, ToastController } from 'ionic-angular';
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
  nome: String;
  sexo: String;

  constructor(public navCtrl: NavController,public navParams: NavParams, public alertCtrl: AlertController,private mesaProvider:MesaProvider
  ,private afAuth: AngularFireAuth,private usuarioProvider:UsuarioProvider, private toast:ToastController) {
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
    this.nome = this.usuarioLogado.nome;
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
            placeholder: 'Código da Mesa'
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
    let mesa: any;
    let existe: boolean;
    this.mesaProvider.consultarMesa(key).subscribe( r=>{
      mesa = r;
      console.log(mesa);
    })
    
    setTimeout(() => {
      if(mesa.key != null){
        existe = this.consultarIntegrante(mesa,this.usuarioLogado.key);
        if(existe == false){
      mesa.integrantes.push({usuarioId:this.usuarioLogado.key,nome:this.usuarioLogado.nome,total:0})
      delete mesa.key;
      this.mesaProvider.atualizarMesa(key,mesa);
      this.navCtrl.setRoot(MesaPage,{mesaKey:key});
        }else{
          this.mesaProvider.atualizarMesa(key,mesa);
          this.navCtrl.setRoot(MesaPage,{mesaKey:key});
        }
      }else{
        this.toast.create({ message: 'Código da mesa não encontrado.', duration: 3000, position: 'botton'}).present();
      }
    }, 1000);
    
  }

  public consultarIntegrante(mesa:any, keyUser:string):boolean{

      let retorno:boolean;
      var  integrantes:any[];
      integrantes = mesa.integrantes;
      for(var i = 0; i<integrantes.length; i++){
       if(integrantes[i].usuarioId == keyUser){
         retorno = true;
         i=integrantes.length;
       } else {
         retorno = false;
       }
      }
  return retorno;
  }
}
