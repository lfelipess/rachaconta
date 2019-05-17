import { MesaProvider } from './../../providers/mesa-provider/mesa-provider';
import { Component, ViewChild, OnInit } from '@angular/core';
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
  inclusao:boolean;
  @ViewChild('checkbox') check;
  constructor(public navCtrl: NavController, public navParams: NavParams,private mesaProvider:MesaProvider
    ,private toast: ToastController,private providerProduto:ProdutoProvider,private providerMesa:MesaProvider) {
    this.inclusao = this.navParams.data.inclusao;
    if(!this.inclusao){
      this.produto = this.navParams.data.produto;
    }
    
    this.mesa.id = this.navParams.data.idMesa;
    this.mesaProvider.consultarMesa(this.mesa.id).subscribe( r=>{
      this.mesa = <Mesa> r.payload.val();
      this.mesa.id = r.key;
      this.mesa.integrantes.forEach( i =>{
        if(this.produto.integrantes.filter(ip => ip.id == i.id).length > 0){
          i['check'] = true;
        }else{
          i['check'] = false;
        }
      })
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
    if(this.verificarDesc(this.produto.descricao)){
      if(this.verificarValor(this.produto.valor)){
        if(this.verificarQtd(this.produto.quantidade)){  
          if(this.produto.integrantes.length > 0){       
              let valorDividido = (this.produto.valor * this.produto.quantidade) / this.produto.integrantes.length;
              this.produto.idMesa = this.mesa.id;
              this.produto.integrantes.forEach( p=>{
                p.despesa = valorDividido;
              })
              if(this.inclusao){
                this.providerProduto.adicionarProduto(this.produto);
                this.printMensagem("Produto Adicionado");
              }else{
                this.providerProduto.atualizarProduto(this.produto.id,this.produto);
                this.printMensagem("Produto Atualizado");
              }
              this.providerProduto.consultarProdutos(this.mesa.id).subscribe( p =>{
                let produtos = <Array<Produto>> p.map( p => ({id:p.key ,...p.payload.val()}));
                this.mesa.integrantes.forEach( inte =>{
                  inte.despesa = 0;
                });
                this.mesa.integrantes.forEach( i =>{
                  produtos.forEach( produto =>{
                      produto.integrantes.forEach( ip =>{
                      if(i.id == ip.id){
                        i.despesa += ip.despesa;
                      }
                    })
                  })
                });
                delete this.mesa.id;
                this.providerMesa.atualizarMesa(this.produto.idMesa,this.mesa);
                this.navCtrl.setRoot(MesaPage,{mesaKey:this.produto.idMesa});
              })


          }else{
            this.printMensagem("Selecione os Integrantes.");
          }
        }else {
          this.printMensagem("O campo Quantidade não pode ser vazio ou possuir números não inteiros.");
        }
      }else{
        this.printMensagem("O campo Valor não pode ser vazio, menor ou igual zero.");
      }
    }else{
      this.printMensagem("O campo Nome do produto não pode ser vazio ou possuir números.");
    }
  }

  printMensagem(mensagem){
    this.toast.create({duration:2000, position:"bottom",message:mensagem}).present();
  }

  verificarDesc(descricao:any){
    if(descricao){
      var regex = /^[A-z]+$/; 
       if (!regex.test(descricao)) {
        return false
       }
       else{
         return true;
       }
    } else {
      return false;
    }
  }

  verificarValor(valor:any){
    if (valor){
      if(valor > 0){
          return true;
      } else {
       return false;
      }
    } else {
      return false;
    }
  }
  
  verificarQtd(qtd:any){
    if (qtd){
      if(qtd > 0){
        var regex = /^[a-zA-Z0-9]+$/; 
         if (!regex.test(qtd)) {
         return false
        }
        else{
          return true;
        }
      } else {
       return false;
      }
    } else {
      return false;
    }
  }
}
