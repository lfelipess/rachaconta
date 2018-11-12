import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Mesa } from '../../models/mesa';
import { AngularFireAction, DatabaseSnapshot } from '@angular/fire/database';
import { Observable } from 'rxjs/Observable';




@Injectable()
export class MesaProvider {
  
  private mesa;

  constructor(private db : AngularFireDatabase) {
    this.mesa = this.db.database.ref("/mesa");
  }

  criarMesa(mesa):string{
    return  this.mesa.push(mesa).key;
  }

  consultarMesa(id:string):Observable<AngularFireAction<DatabaseSnapshot<{}>>>{
   return this.db.object('/mesa/'+id).snapshotChanges();
  }

  atualizarMesa(id,mesa){
      this.db.list("/mesa").update(id,mesa);
  }

  consultarMesaPorCodigo(codigo):Observable<AngularFireAction<DatabaseSnapshot<{}>>[]>{
    return this.db.list("/mesa", ref => ref.orderByChild('codigoMesa').equalTo(codigo))
    .snapshotChanges();
  }

  consultarTodasMesa():Observable<AngularFireAction<DatabaseSnapshot<{}>>[]>{
    return this.db.list("/mesa").snapshotChanges();
  }

  consultarMesaDesativada():Observable<AngularFireAction<DatabaseSnapshot<{}>>[]>{
    return this.db.list("/mesa", ref => ref.orderByChild('ativa').equalTo(false))
    .snapshotChanges();
  }

  fecharMesa(key:string){
    this.db.object('/mesa/'+key).update({"ativa":false});
  }

  
}
