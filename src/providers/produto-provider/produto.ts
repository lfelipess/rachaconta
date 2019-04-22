
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Produto } from '../../models/produto';
import { Observable } from 'rxjs/Observable';
import { AngularFireAction, DatabaseSnapshot } from '@angular/fire/database';


/*
  Generated class for the ProdutoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProdutoProvider {

  private produtos:any;

  constructor(private db: AngularFireDatabase) {
   this.produtos= this.db.database.ref("/produtos");
  }

  adicionarProduto(produto):string{
    return this.produtos.push(produto).key;
  }

  consultarProdutos(idMesa):Observable<AngularFireAction<DatabaseSnapshot<{}>>[]>{
    return this.db.list("/produtos", ref => ref.orderByChild('idMesa').equalTo(idMesa))
    .snapshotChanges();
  }

  atualizarProduto(id,produto){
    this.db.list("/produtos").update(id,produto);
  }

  excluirProduto(produto){
    this.db.database.ref("/produtos/"+produto).remove();
  }

}
