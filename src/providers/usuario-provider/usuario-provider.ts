import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';

/*
  Generated class for the UsuarioProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UsuarioProvider {

  private usuarios;
  
  constructor(private db: AngularFireDatabase) {
   this.usuarios = this.db.database.ref("/usuario");
  }

  save(usuario){
    let id = usuario.id;
    delete usuario.idy;
    this.db.list("/usuario").update(id,usuario);
  }

  getUsuario(id):any{
    return this.db.object('/usuario/'+id).snapshotChanges().map( 
      r=>{
        return {id:r.key, ...r.payload.val()};
      })
  }

  fecharMesa(key:string){
    this.db.object('/mesa/'+key).update({"ativa":false});
  }

}
