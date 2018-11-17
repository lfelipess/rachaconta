import { FinalPage } from './../final/final';
import { AddProdPage } from './../add-prod/add-prod';
import { DetalhePessoaPage } from './../detalhe-pessoa/detalhe-pessoa';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ActionSheetController, Platform } from 'ionic-angular';
import { MesaProvider } from '../../providers/mesa-provider/mesa-provider';
import { Mesa } from '../../models/mesa';
import { ProdutoProvider } from '../../providers/produto-provider/produto';
import { Produto } from '../../models/produto';


@IonicPage()
@Component({
  selector: 'page-mesa',
  templateUrl: 'mesa.html',
})
export class MesaPage {
  mesa: any
  total:number= 0;
  mesaAtual:Mesa = new Mesa();
  produtos:Array<Produto> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController
    ,private mesaProvider:MesaProvider,private produtoProvider:ProdutoProvider,public actionSheetCtrl: ActionSheetController,
    public platform: Platform) {
    this.mesa = "integrantes";
    this.mesaAtual.id= this.navParams.data.mesaKey;
    this.mesaProvider.consultarMesa(this.mesaAtual.id).subscribe( r=>{
      this.total =0;
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


  editProd(){
    this.navCtrl.push(AddProdPage);
  }
  addProdAll(){
    let chave = this.navParams.data.mesaKey;
    this.navCtrl.push(AddProdPage,{chave});
  }

  removePessoa(){

  }

  encerrarMesa(){
    let confirm = this.alertCtrl.create({
      title: 'Fechar conta',
      message: 'Você gostaria realmente de fechar a conta da mesa?',
      buttons: [
        {
          text: 'Sim',
          handler: () => {
            this.navCtrl.setRoot(FinalPage,{mesaKey:this.mesaAtual.id});
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

  detalhePessoa(integrante){
    this.navCtrl.push(DetalhePessoaPage,{idMesa:this.mesaAtual.id, idUsuario:integrante.id});
  }

  informacoes(){
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Informações da Mesa',
      cssClass: 'action-sheet-info',
      buttons: [
        {
          text: 'Compartilhar Mesa',
          role: 'destructive',
          cssClass: 'action-sheet-parcial',
          icon: !this.platform.is('ios') ? 'share' : null,
          handler: () => {
            this.emBreve();
          }
        },{
          text: 'Conta Parcial',
          role: 'destructive',
          cssClass: 'action-sheet-parcial',
          icon: !this.platform.is('ios') ? 'logo-usd' : null,
          handler: () => {
            let alert = this.alertCtrl.create({
              title: 'Conta Parcial',
              message: 'R$'+this.total,
              cssClass: 'alert-parcial',
              buttons: ['OK']
            });
            alert.present();
          }
        },{
          text: 'Finalizar Mesa',
          cssClass: 'action-sheet-final',
          icon: !this.platform.is('ios') ? 'ios-log-out' : null,
          handler: () => {
            this.encerrarMesa();
          }
        },{
          text: 'Cancelar',
          role: 'cancel',
          icon: !this.platform.is('ios') ? 'close' : null,
          handler: () => {
            console.log('Cancelado');
          }
        }
      ]
    });
    actionSheet.present();
  }

  emBreve(){
    let alert = this.alertCtrl.create({
      title: 'Em breve!',
      subTitle: 'Esta função ainda não está disponível!',
      buttons: ['OK']
    });
    alert.present();
  }

}
