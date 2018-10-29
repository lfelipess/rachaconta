import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { AngularFireAuth } from 'angularfire2/auth';
import { LoginPage } from '../login/login';
import { UsuarioProvider } from '../../providers/usuario-provider/usuario-provider';
import { auth } from 'firebase';

/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
    ngOnInit(): any {
        throw new Error("Method not implemented.");
    }

  form: FormGroup;

  constructor(public navCtrl: NavController, public formBuilder: FormBuilder
    , private fire: AngularFireAuth, private usuarioProvider: UsuarioProvider, private toast: ToastController) {
    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group({
      nome: ['', Validators.required],
      sobrenome: ['', Validators.required],
      dataNascimento: ['', Validators.required],
      sexo: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      senha: ['', Validators.required],
      confirmSenha: ['', Validators.required]
    })
  }

  cadastrar() {

    if (this.form.value.senha == this.form.value.confirmSenha) {
      if (this.form.valid) {
        this.fire.auth.createUserWithEmailAndPassword(this.form.value.email, this.form.value.senha)
          .then((certo) => {
            this.form.value.id = certo.uid;
            delete this.form.value.senha;
            delete this.form.value.confirmSenha;
            this.usuarioProvider.save(this.form.value);
            this.navCtrl.setRoot(LoginPage);
          })
          .catch(erro => {
            if (erro.code == "auth/weak-password") {
              this.printErro('A senha deve ter no mínimo 6 Caracteres.');
            } else if (erro.code == "auth/email-already-in-use") {
              this.printErro('E-mail já em Uso');
            }
          });
      } else {
        this.printErro("Preencha todos os Campos com asterisco (*)");
      }
    } else {
      this.printErro("Senhas Distintas");
    }
  }

  printErro(erro: string) {
    if (erro) {
      let toast = this.toast.create({ duration: 3000, position: 'bottom' });
      toast.setMessage(erro).present();
    }
  }

  cancelar() {
    this.navCtrl.setRoot(LoginPage);
  }

}
