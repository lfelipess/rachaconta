import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Usuario } from '../../models/usuario';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';
import { UsuarioProvider } from '../../providers/usuario-provider/usuario-provider';

/**
 * Generated class for the EditarPerfilPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-editar-perfil',
  templateUrl: 'editar-perfil.html',
})
export class EditarPerfilPage {

  usuarioLogado : Usuario;
  userFirebase: any;
  private form: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder:FormBuilder, private toast: ToastController
    ,private afAuth: AngularFireAuth, private usuarioProvider:UsuarioProvider) {
    this.usuarioLogado = this.navParams.data.usuarioLogado;
    this.userFirebase = this.afAuth.auth.currentUser;
    this.createForm();
  }

  createForm(){
    this.form = this.formBuilder.group({
      nome:['', Validators.required],
      sobrenome:['', Validators.required],
      dataNascimento:['', Validators.required],
      sexo:['', Validators.required],
      email:['',Validators.required],
    })
  }

  alterar(){
    if(this.form.valid){
      if(this.form.value.nome != this.usuarioLogado.nome){
        this.usuarioLogado.nome = this.form.value.nome;
      }
      if(this.form.value.sobrenome != this.usuarioLogado.sobrenome){
        this.usuarioLogado.sobrenome = this.form.value.sobrenome;
      }
      if(this.form.value.email != this.usuarioLogado.email){
        this.usuarioLogado.email = this.form.value.email;
      }
      this.usuarioProvider.save(this.usuarioLogado);
      this.navCtrl.pop();
    }else{
      this.printErro("Preencha todos os Campos!");
    }
  }

  cancelar(){
    this.navCtrl.pop();
  }

  alterarSenha(){

  }

  printErro(erro:string){
    if(erro){
      let toast = this.toast.create({ duration: 3000, position: 'bottom' });
      toast.setMessage(erro).present();
    }
  }
}
