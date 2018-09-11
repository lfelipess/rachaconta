import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import { DatabaseReference } from 'angularfire2/database/interfaces';

/*
  Generated class for the UsuarioProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UsuarioProvider {

  private usuarios:DatabaseReference;
  
  constructor(private db: AngularFireDatabase) {
   this.usuarios = this.db.database.ref("/usuario");
  }

  save(usuario){
    let key = usuario.key;
    delete usuario.key;
    this.db.list("/usuario").update(key,usuario);
  }

  getUsuario(key):any{
    return this.db.object('/usuario/'+key).snapshotChanges().map( 
      r=>{
        return {key:r.key, ...r.payload.val()};
      })
  }

}
