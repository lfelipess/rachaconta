import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Mesa } from '../../models/mesa';




@Injectable()
export class MesaProvider {
  
  private mesa;

  constructor(private db : AngularFireDatabase) {
    this.mesa = this.db.database.ref("/mesa");
  }

  criarMesa(mesa):string{
    return  this.mesa.push(mesa).key;
  }

  consultarMesa(id:string):any{
   return this.db.object('/mesa/'+id).snapshotChanges().map( 
     r=>{
       return {id:r.key, ...r.payload.val()};
     })
  }

  atualizarMesa(id,mesa){
      this.db.list("/mesa").update(id,mesa);
  }
  
}
