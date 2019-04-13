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
        this.usuarioLogado = <Usuario> usuario.payload.val();
        this.usuarioLogado.id = usuario.key;
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
            placeholder: 'Informe o código da mesa'
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
  
  

  criarMesa(codigo) {
      let mesa:Mesa = new Mesa();
      mesa.ativa=true;
      mesa.codigoMesa = codigo;
      mesa.data = new Date().toLocaleDateString();
      let integrante:Integrantes = new Integrantes();
      integrante.id = this.usuarioLogado.id;
      integrante.nome = this.usuarioLogado.nome;
      integrante.despesa = 0;
      integrante.ativo = true;
      mesa.integrantes.push(integrante);
      let mesaKey = this.mesaProvider.criarMesa(mesa);
      this.navCtrl.setRoot(MesaPage,{mesaKey:mesaKey});
  }

  addIntegrante(codigo:string){
    let mesa:Mesa = new Mesa();
    let key:string;
    this.mesaProvider.consultarMesaPorCodigo(codigo).subscribe( m=>{
      mesa = (<Array<Mesa>> m.map( M => ({id: M.key, ...M.payload.val()})))[0];
      key = mesa ? mesa.id : null;
    })
    setTimeout(() => {
      if(key){
        if(!mesa.ativa){
          this.printErro("Mesa Desativada");
        }else{
          let  existe:Integrantes[] = mesa.integrantes.filter( t =>{
          return t.id == this.usuarioLogado.id;
          })
          if(existe.length == 0){
            let i = new Integrantes();
            i.id = this.usuarioLogado.id;
            i.nome = this.usuarioLogado.nome;
            i.despesa = 0;
            i.ativo= true;
            mesa.integrantes.push(i);
            delete mesa.id;
            this.mesaProvider.atualizarMesa(key,mesa);
            this.navCtrl.setRoot(MesaPage,{mesaKey:key}); 
          }else{
            if(existe[0].ativo){
             this.navCtrl.setRoot(MesaPage,{mesaKey:key});
            }else{
              this.printErro("Sua Conta Foi Encerrada");
            }
          }
        }
      }else{
        this.printErro('Código Invalido');
        this.entrarMesa();
      }
    }, 1000);
    
  }

  gerarCodigo(){
    let base="aBlc1MDCneKFO2gHiz3jkqbyLEpm4INovuP5dqTRSh6tUrJV7xWZ8fYAG";
    let codigo:string='';
    let  i; 
    let mesas:Array<Mesa>; 
    this.mesaProvider.consultarTodasMesa().subscribe( m =>{
      mesas =<Array<Mesa>> m.map( r => ({id:r.key, ...r.payload.val()}));
    })
    setTimeout(()=>{
      for(i = 0; i < 7 ;i++ ){
        codigo = codigo.concat(base.charAt(Math.floor(Math.random() * base.length)));
      }
      while(mesas.filter( m => m.codigoMesa == codigo).length > 0){
        for(i = 0; i < 7 ;i++ ){
          codigo = codigo.concat(base.charAt(Math.floor(Math.random() * base.length)));
        }
      }
      this.criarMesa(codigo);
    },1000);
   }

   printErro(erro:string){
    if(erro){
      let toast = this.toast.create({ duration: 2000, position: 'bottom' });
      toast.setMessage(erro).present();
    }
  }

}
