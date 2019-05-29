import { DetalhePessoaPage } from './../detalhe-pessoa/detalhe-pessoa';
import { Usuario } from './../../models/usuario';
import { AngularFireAuth } from 'angularfire2/auth';
import { UsuarioProvider } from './../../providers/usuario-provider/usuario-provider';
import { HomePage } from './../home/home';
import { ProdutoProvider } from './../../providers/produto-provider/produto';
import { MesaProvider } from './../../providers/mesa-provider/mesa-provider';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


import { Mesa } from '../../models/mesa';
import { Produto } from '../../models/produto';
import { MesaPage } from '../mesa/mesa';


@IonicPage()
@Component({
  selector: 'page-final',
  templateUrl: 'final.html',
})
export class FinalPage {

  mesaKey: any;
  mesaAtual:Mesa = new Mesa();
  //integrantes:Array<any>;
  produtos:Array<Produto> = [];
  total:number= 0;
  exibirCancelar:boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams,private mesaProvider:MesaProvider,
    private produtoProvider:ProdutoProvider) {
    this.mesaAtual.id = this.navParams.data.mesaKey;
    this.exibirCancelar = this.navParams.data.exibirCancelar;
    this.mesaProvider.consultarMesa(this.mesaAtual.id).subscribe( r=>{
      this.mesaAtual = <Mesa> r.payload.val();
      this.mesaAtual.id = r.key;
      this.mesaAtual.integrantes.forEach( i =>{
        this.total += i.despesa;
      })
    })
    this.produtoProvider.consultarProdutos(this.mesaAtual.id).subscribe( produto =>{
      this.produtos = <Array<Produto>> produto.map( p => ({id:p.key ,...p.payload.val()}));
    })
  }

  fechaMesa(){
  this.mesaProvider.fecharMesa(this.mesaAtual.id);
  this.navCtrl.setRoot(HomePage);
  }

  detalhePessoa(integrante){
    this.navCtrl.push(DetalhePessoaPage,{idMesa:this.mesaAtual.id, idUsuario:integrante.id, comButton: false});
  }

  cancelar(){
    this.navCtrl.setRoot(MesaPage,{mesaKey:this.mesaAtual.id});
  }
}
