import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DatabaseSnapshot, AngularFireAction } from '@angular/fire/database';

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
    delete usuario.id;
    this.db.list("/usuario").update(id,usuario);
  }

  getUsuario(id): Observable<AngularFireAction<DatabaseSnapshot<{}>>>{
    return this.db.object('/usuario/'+id).snapshotChanges();
  }
}
