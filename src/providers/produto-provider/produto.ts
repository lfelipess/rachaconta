
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Produto } from '../../models/produto';


/*
  Generated class for the ProdutoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProdutoProvider {

  private produtos;

  constructor(private db: AngularFireDatabase) {
   this.produtos= this.db.database.ref("/produtos");
  }

  adicionarProduto(produto):string{
    return this.produtos.push(produto).key;
  }

  consultarProdutos(idMesa){
    return this.db.list("/produtos", ref => ref.orderByChild('idMesa').equalTo(idMesa))
    .snapshotChanges().map(changes=>{
      return changes.map(c =>({key:c.payload.key,...c.payload.val()}));
    });
  }

}
