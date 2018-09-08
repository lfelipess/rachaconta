import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Mesa } from '../../models/mesa';
import { DatabaseReference } from 'angularfire2/database/interfaces';



@Injectable()
export class MesaProvider {
  private mesa:DatabaseReference;

  constructor(private db : AngularFireDatabase) {
    this.mesa = this.db.database.ref("/mesa");
  }

  criarMesa(mesa):string{
    return  this.mesa.push(mesa).key;
  }

  consultarMesa(key:string):any{
   return this.db.object('/mesa/'+key).snapshotChanges().map( 
     r=>{
       return {key:r.key, ...r.payload.val()};
     })
  }

  atualizarMesa(key,mesa){
      this.db.list("/mesa").update(key,mesa);
  }
  
}
