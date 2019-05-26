import { FinalPage } from './../final/final';
import { AddProdPage } from './../add-prod/add-prod';
import { DetalhePessoaPage } from './../detalhe-pessoa/detalhe-pessoa';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ActionSheetController, Platform, ToastController } from 'ionic-angular';
import { MesaProvider } from '../../providers/mesa-provider/mesa-provider';
import { Mesa } from '../../models/mesa';
import { ProdutoProvider } from '../../providers/produto-provider/produto';
import { Produto } from '../../models/produto';
import { AngularFireAuth } from 'angularfire2/auth';
import { HomePage } from '../home/home';
import { FormatCurrencyPipe } from '../../pipes/format-currency/format-currency';
import { SocialSharing } from '@ionic-native/social-sharing'


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
  formatCurrency = new FormatCurrencyPipe();

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController
    ,private mesaProvider:MesaProvider,private produtoProvider:ProdutoProvider,public actionSheetCtrl: ActionSheetController,
    public platform: Platform,private afAuth: AngularFireAuth, private toast: ToastController,private socialSharing: SocialSharing) {
    this.mesa = "integrantes";
    this.mesaAtual.id= this.navParams.data.mesaKey;
    this.mesaProvider.consultarMesa(this.mesaAtual.id).subscribe( r=>{
      this.total =0;
      this.mesaAtual = <Mesa> r.payload.val();
      this.mesaAtual.id = r.key;
      let removido = this.mesaAtual.integrantes.filter( i => i.id == this.afAuth.auth.currentUser.uid).length == 0 ? true : false;
      if(removido){
        this.navCtrl.setRoot(HomePage);
      } 
      this.produtoProvider.consultarProdutos(this.mesaAtual.id).subscribe( produto =>{
        this.produtos = <Array<Produto>> produto.map( p => ({id:p.key ,...p.payload.val()}));
        this.mesaAtual.integrantes.forEach( inte =>{
          inte.despesa = 0;
        });
        this.mesaAtual.integrantes.forEach( i =>{
          this.produtos.forEach( produto =>{
              produto.integrantes.forEach( ip =>{
              if(i.id == ip.id){
                i.despesa += ip.despesa;
              }
            })
          })
        });
      })
      this.mesaAtual.integrantes.forEach( i =>{
        this.total += i.despesa;
      })
    })

  }


  editProd(produto){
    let chave = this.navParams.data.mesaKey;
    this.navCtrl.push(AddProdPage,{idMesa:chave, inclusao:false,produto:produto});
  }
  addProdAll(){
    let chave = this.navParams.data.mesaKey;
    this.navCtrl.push(AddProdPage,{idMesa:chave, inclusao:true});
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
            this.compartilhar(this.mesaAtual.codigoMesa);
          }
        },{
          text: 'Conta Parcial',
          role: 'destructive',
          cssClass: 'action-sheet-parcial',
          icon: !this.platform.is('ios') ? 'logo-usd' : null,
          handler: () => {
            let alert = this.alertCtrl.create({
              title: 'Conta Parcial',
              message: this.formatCurrency.transform(this.total),
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

  add(){
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Adicionar',
      cssClass: 'action-sheet-info',
      buttons: [
        {
          text: 'Produtos',
          role: 'destructive',
          cssClass: 'action-sheet-parcial',
          icon: !this.platform.is('ios') ? 'beer' : null,
          handler: () => {
            this.addProdAll();
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

  excluirIntegrante(codigo){
    if (this.afAuth.auth.currentUser.uid != codigo){
    this.mesaAtual.integrantes = this.mesaAtual.integrantes.filter( i => i.id != codigo); 
    this.mesaProvider.atualizarMesa(this.mesaAtual.id,this.mesaAtual);
    } else {
      this.printMensagem("Não é possível se excluir da mesa, caso deseje, por favor encerre sua conta individual.");
    }
  }

  emBreve(){
    let alert = this.alertCtrl.create({
      title: 'Em breve!',
      subTitle: 'Esta função ainda não está disponível!',
      buttons: ['OK']
    });
    alert.present();
  }

  excluirProduto(produto){
    this.produtoProvider.excluirProduto(produto.id);
  }

  printMensagem(mensagem){
    this.toast.create({duration:2000, position:"bottom",message:mensagem}).present();
  }

  compartilhar(cdMesa){
    this.socialSharing.shareViaWhatsApp('Olá! Estou te convidando para fazer parte da minha mesa no RachaConta. O código dela é: '+cdMesa)
  }

}
