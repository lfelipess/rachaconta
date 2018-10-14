import { MesaProvider } from './../../providers/mesa-provider/mesa-provider';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Mesa } from '../../models/mesa';
import { Produto } from '../../models/produto';
import { Integrantes } from '../../models/integrantes';
import { ProdutoProvider } from '../../providers/produto-provider/produto';
import { MesaPage } from '../mesa/mesa';

/**
 * Generated class for the AddProdPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-prod',
  templateUrl: 'add-prod.html',
})
export class AddProdPage {

  mesa:Mesa= new Mesa();
  produto:Produto= new Produto();
  a:string;
  b:string;

  constructor(public navCtrl: NavController, public navParams: NavParams,private mesaProvider:MesaProvider
    ,private toast: ToastController,private providerProduto:ProdutoProvider,private providerMesa:MesaProvider) {

    this.mesa.id = this.navParams.data.chave;
    this.mesaProvider.consultarMesa(this.mesa.id).subscribe( r=>{
      this.mesa = r;
    })
  }

  AtualizarLista(evento,integrante){
    if(evento.value){
      let integranteProduto = new Integrantes();
      integranteProduto.id = integrante.id;
      integranteProduto.nome = integrante.nome;
      integranteProduto.despesa = 0;
      this.produto.integrantes.push(integranteProduto);
    }else{
      this.produto.integrantes = this.produto.integrantes.filter( i =>{
        return i.id !== integrante.id;
      })
    }
  }

  adicionarProduto(){
     if(this.produto.integrantes.length > 0){
       if(this.produto.valor > 0){
          let valorDividido = this.produto.valor / this.produto.integrantes.length;
          this.produto.idMesa = this.mesa.id;
          this.produto.integrantes.forEach( p=>{
            p.despesa = valorDividido;
          })
          this.providerProduto.adicionarProduto(this.produto);
          this.mesa.integrantes.forEach( i =>{
            this.produto.integrantes.forEach( ip =>{
              if(i.id == ip.id){
                i.despesa += ip.despesa;
              }
            })
          })
          delete this.mesa.id;
          this.providerMesa.atualizarMesa(this.produto.idMesa,this.mesa);
          this.printMensagem("Produto Adicionado");
          this.navCtrl.setRoot(MesaPage,{mesaKey:this.produto.idMesa});
       }else{
          this.printMensagem("O valor não pode ser Menor ou Igual Zero");
       }
     }else{
        this.printMensagem("Selecione os Integrantes");
     }
  }

  printMensagem(mensagem){
    this.toast.create({duration:2000, position:"bottom",message:mensagem}).present();
  }
}
