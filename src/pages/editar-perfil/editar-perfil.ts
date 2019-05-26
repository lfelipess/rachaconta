import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Usuario } from '../../models/usuario';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';
import { UsuarioProvider } from '../../providers/usuario-provider/usuario-provider';
import { PerfilPage } from '../perfil/perfil';

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
  dtNascAtual: any;
  sexoAtual: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder:FormBuilder, private toast: ToastController
    ,private afAuth: AngularFireAuth, private usuarioProvider:UsuarioProvider) {
    this.usuarioLogado = this.navParams.data.usuarioLogado;
    this.userFirebase = this.afAuth.auth.currentUser;
    this.createForm();
    this.dtNascAtual = this.usuarioLogado.dataNascimento;
    this.sexoAtual = this.usuarioLogado.sexo;
  }

  createForm(){
    this.form = this.formBuilder.group({
      nome:['', Validators.required],
      sobrenome:['', Validators.required],
      dataNascimento:['', Validators.required],
      sexo:['', Validators.required],
      email:['',Validators.required],
      senha:[''],
      confirmSenha:[''],
    })
  }

  alterar(){
    var aux:number = 0;
    if(this.form.valid){
      if(this.form.value.nome != this.usuarioLogado.nome){
        this.usuarioLogado.nome = this.form.value.nome;
      } else{
        aux++;
      }
      if(this.form.value.sobrenome != this.usuarioLogado.sobrenome){
        this.usuarioLogado.sobrenome = this.form.value.sobrenome;
      } else{
        aux++;
      }
      if(this.form.value.dataNascimento == this.dtNascAtual){
        aux++
      }
      if(this.form.value.sexo == this.sexoAtual){
        aux++
      }
      if(this.form.value.email != this.usuarioLogado.email){
        this.usuarioLogado.email = this.form.value.email;
        this.userFirebase.updateEmail(this.form.value.email).then(function() {
          console.log("Email alterado com sucesso");
        }).catch(function(error) {
          console.log("Erro no processo de alteração do email: " + error);
        });
      } else{
        aux++;
      }
    }else{
      this.printErro("Preencha todos os campos de informações pessoais!");
      return;
    }

    if((!this.form.value.senha && this.form.value.confirmSenha) || (this.form.value.senha && !this.form.value.confirmSenha)){
      this.printErro("Os campos de senha devem conter valores iguais para alteração ou serem deixados em branco para não alterar!");
      return;
    }

    if(this.form.value.senha && this.form.value.confirmSenha){
      if(this.form.value.senha == this.form.value.confirmSenha){
        if(this.form.value.senha.length >= 6){
          this.userFirebase.updatePassword(this.form.value.senha).then(function() {
            console.log("Senha alterada com sucesso");
          }).catch(function(error) {
            console.log("Erro no processo de alteração da senha: " + error);
          });
        } else {
          this.printErro("A senha informada possui menos de 6 digitos!");
          return;
        }
      } else {
        this.printErro("Senhas diferentes!");
        return;
      }
    } else{
      aux++;
    }

    if(aux == 6){
      this.printErro("Não há alterações no cadastro para salvar");
      return;
    }
    else{
      this.printErro("Informações salvas com sucesso!");
      this.usuarioProvider.save(this.usuarioLogado);
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
