import { AddProdIndivPage } from './../add-prod-indiv/add-prod-indiv';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Usuario } from '../../models/usuario';
import { Produto } from '../../models/produto';
import { ProdutoProvider } from '../../providers/produto-provider/produto';
import { UsuarioProvider } from '../../providers/usuario-provider/usuario-provider';
import { AngularFireAuth } from 'angularfire2/auth';
import { formatCurrency } from '@angular/common';
import { MesaProvider } from '../../providers/mesa-provider/mesa-provider';
import { Mesa } from '../../models/mesa';
import { HomePage } from '../home/home';

/**
 * Generated class for the DetalhePessoaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detalhe-pessoa',
  templateUrl: 'detalhe-pessoa.html',
})
export class DetalhePessoaPage {
  idUsuarioLogado: any;
  comButton: any;
  usuario:Usuario = new Usuario();
  produtos:Array<Produto> = new Array<Produto>();

  constructor(public navCtrl: NavController, public navParams: NavParams, private produtoProvider:ProdutoProvider
    ,private usuarioProvider: UsuarioProvider,private afAuth: AngularFireAuth,public alertCtrl: AlertController,private mesaProvider:MesaProvider) {
    this.usuarioProvider.getUsuario(this.navParams.data.idUsuario).subscribe( u =>{
      this.idUsuarioLogado = this.afAuth.auth.currentUser.uid;
      this.usuario = <Usuario> u.payload.val();
      this.usuario.id = u.key;
      this.produtoProvider.consultarProdutos(navParams.data.idMesa).subscribe( p =>{
        this.produtos = <Array<Produto>> p.map( pr => ({id:pr.key, ...pr.payload.val()}));
       this.produtos = this.produtos.filter( P => P.integrantes.filter( i => i.id == this.usuario.id).length > 0);
      })
    })
    
    if (this.usuario.id == this.idUsuarioLogado && this.navParams.data.comButton == null){
      this.comButton = true;
    } else {
      this.comButton = false;
    }
  }

  filter(integrantes:Array<any>){
    if(integrantes.length != 0){
        return integrantes.filter( i => i.id === this.usuario.id);
    }
  }

  calcularTotal(){
    let total:number = 0;
    this.produtos.forEach( p =>{
      p.integrantes.forEach( i =>{
        total += (i.id == this.usuario.id ? i.despesa : 0);
      })
    })
    this.apresentarTotal(total);
  }

  encerrarConta(){
    this.mesaProvider.consultarMesa(this.navParams.data.idMesa).subscribe( m =>{
      let mesa: Mesa = <Mesa> m.payload.val();
      mesa.integrantes.filter(i => i.id == this.usuario.id)[0].ativo = false;
      this.mesaProvider.atualizarMesa(m.key,mesa);
      this.navCtrl.setRoot(HomePage);
    })
  }

  apresentarTotal(total){
    const confirm = this.alertCtrl.create({
      title: 'Despesa Total: R$ '+ total,
      buttons: [
        {text: 'Confirmar',
          handler: () => {
            this.encerrarConta();
          }
        },
        {text: 'Cancelar',
          handler: () => {
          }
        }
      ]
    });
    confirm.present();
  }
  

}
